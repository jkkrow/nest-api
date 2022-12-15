import { User } from 'src/modules/user/interfaces/user.interface';
import { History } from 'src/modules/history/interfaces/history.interface';
import { VideoNode, VideoNodeOnlyRoot } from './video-node';
import { VideoTreeStatus } from '../constants/video-tree.contstant';

export interface VideoTree {
  id: string;
  title: string;
  description: string;
  categories: { name: string }[];
  thumbnail: string;
  size: number;
  maxDuration: number;
  minDuration: number;
  status: VideoTreeStatus;
  editing: boolean;
  userId: string;
  root: VideoNode;
}

export interface VideoTreeOnlyRoot extends Omit<VideoTree, 'root'> {
  root: VideoNodeOnlyRoot;
}

export interface VideoTreeWithData extends VideoTree {
  user: User;
  views: number;
  favorites: number;
  favorited: boolean;
  history: Omit<History, 'videoId' | 'userId'> | null;
}

export interface VideoTreeOnlyRootWithData
  extends VideoTreeOnlyRoot,
    Omit<VideoTreeWithData, 'root'> {}

export interface UpdateVideoTreeProps {
  title: string;
  categories: { name: string }[];
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
