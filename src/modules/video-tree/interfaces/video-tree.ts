import { User } from 'src/modules/user/interfaces/user.interface';
import { History } from 'src/modules/history/interfaces/history.interface';
import { VideoNode, VideoNodeOnlyRoot } from './video-node';
import { VideoTreeStatus } from '../constants/video-tree.contstant';

export interface VideoTree {
  id: string;
  title: string;
  description: string;
  categories: string[];
  thumbnail: string;
  size: number;
  maxDuration: number;
  minDuration: number;
  status: VideoTreeStatus;
  editing: boolean;
  creatorId: string;
  root: VideoNode;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoTreeNoRoot extends Omit<VideoTree, 'root'> {}

export interface VideoTreeOnlyRoot extends VideoTreeNoRoot {
  root: VideoNodeOnlyRoot;
}

export interface VideoTreeWithData extends VideoTree {
  user: User;
  views: number;
  favorites: number;
  favorited: boolean;
  history: Omit<History, 'videoId' | 'creatorId'> | null;
}

export interface VideoTreeNoRootWithData
  extends VideoTreeNoRoot,
    Omit<VideoTreeWithData, 'root'> {}

export interface VideoTreeOnlyRootWithData
  extends VideoTreeOnlyRoot,
    Omit<VideoTreeWithData, 'root'> {}

export interface UpdateVideoTreeProps {
  title: string;
  categories: string[];
  description: string;
  thumbnail: string;
  status: VideoTreeStatus;
  editing: boolean;
  root: {
    id: string;
    label: string;
    selectionTimeStart: number;
    selectionTimeEnd: number;
    children: UpdateVideoTreeProps['root'][];
  };
}
