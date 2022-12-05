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
