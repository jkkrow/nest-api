import { AggregateRoot } from '@nestjs/cqrs';

import { NotFoundException, BadRequestException } from 'src/common/exceptions';
import { VideoTreeCreatedEvent } from '../events/impl/video-tree-created.event';
import { VideoTreeDeletedEvent } from '../events/impl/video-tree-deleted.event';
import { VideoNodeCreatedEvent } from '../events/impl/video-node-created.event';
import { VideoNodeDeletedEvent } from '../events/impl/video-node-deleted.event';
import { IVideoTree } from '../interfaces/video-tree';
import { IVideoNode } from '../interfaces/video-node';
import { VideoTreeStatus } from '../constants/video-tree.contstant';

export class VideoTree extends AggregateRoot implements IVideoTree {
  constructor(
    private readonly props: {
      readonly id: string;
      readonly userId: string;
      title: string;
      description: string;
      categories: string[];
      thumbnail: string;
      size: number;
      maxDuration: number;
      minDuration: number;
      status: VideoTreeStatus;
      editing: boolean;
      root: IVideoNode;
    },
  ) {
    super();
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get title() {
    return this.props.title;
  }

  get categories() {
    return this.props.categories;
  }

  get description() {
    return this.props.description;
  }

  get thumbnail() {
    return this.props.thumbnail;
  }

  get size() {
    return this.props.size;
  }

  get maxDuration() {
    return this.props.maxDuration;
  }

  get minDuration() {
    return this.props.minDuration;
  }

  get status() {
    return this.props.status;
  }

  get editing() {
    return this.props.editing;
  }

  get root() {
    return JSON.parse(JSON.stringify(this.props.root)) as IVideoNode;
  }

  create() {
    this.apply(new VideoTreeCreatedEvent(this.id));
  }

  delete() {
    this.apply(new VideoTreeDeletedEvent(this.id, this.userId));
  }

  createNode(id: string, parentId: string) {
    const parentNode = this.findNodeById(parentId);

    if (!parentNode) {
      throw new NotFoundException('ParentNode not found');
    }

    if (parentNode.children.length >= 4) {
      throw new BadRequestException('Max length of children exceeded (max: 4)');
    }

    const node: this['root'] = {
      id,
      level: parentNode.level + 1,
      name: '',
      label: '',
      url: '',
      size: 0,
      duration: 0,
      selectionTimeStart: 0,
      selectionTimeEnd: 0,
      children: [],
    };

    parentNode.children.push(node);
    this.apply(new VideoNodeCreatedEvent(id));
  }

  deleteNode(id: string) {
    const deletedNode = this.findNodeById(id);
    const parentNode = this.findNodeByChildId(id);

    if (!deletedNode || !parentNode) {
      throw new NotFoundException('VideoNode not found');
    }

    parentNode.children = parentNode.children.filter(
      (child) => child.id !== id,
    );

    this.traverseNodes(deletedNode).forEach((node) => {
      this.apply(new VideoNodeDeletedEvent(node.id, node.url));
    });
  }

  private findNodeById(nodeId: string) {
    return this.traverseNodes().find((node) => node.id === nodeId);
  }

  private findNodeByChildId(nodeId: string) {
    return this.traverseNodes().find((node) =>
      node.children.find((child) => child.id === nodeId),
    );
  }

  private traverseNodes(root = this.props.root) {
    let currentNode = root;
    const queue: typeof root[] = [];
    const nodes: typeof root[] = [];

    while (currentNode) {
      nodes.push(currentNode);

      if (currentNode.children.length) {
        currentNode.children.forEach((child) => queue.push(child));
      }

      currentNode = queue.shift() as typeof root;
    }

    return nodes;
  }
}
