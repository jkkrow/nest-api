import { AggregateRoot } from '@nestjs/cqrs';

import { NotFoundException, BadRequestException } from 'src/common/exceptions';
import { VideoTreeCreatedEvent } from '../events/impl/video-tree-created.event';
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
    return this.props.root;
  }

  create() {
    this.apply(new VideoTreeCreatedEvent(this.id));
  }

  addNode(id: string, parentId: string) {
    const parentNode = this.findNodeById(parentId);

    if (!parentNode) {
      throw new NotFoundException('Invalid nodeId');
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
  }

  private findNodeById(nodeId: string) {
    let currentNode = this.root;
    const queue: this['root'][] = [];

    queue.push(currentNode);

    while (queue.length) {
      currentNode = queue.shift() as this['root'];

      if (currentNode.id === nodeId) {
        return currentNode;
      }

      if (currentNode.children.length) {
        currentNode.children.forEach((child) => queue.push(child));
      }
    }

    return null;
  }
}
