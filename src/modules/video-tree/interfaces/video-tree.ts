import { IVideoNode } from './video-node';
import { VideoTreeStatus } from '../constants/video-tree.contstant';

export interface IVideoTree {
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
  userId: string;
  root: IVideoNode;
}

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
