export interface VideoNode {
  id: string;
  name: string;
  url: string;
  label: string;
  level: number;
  size: number;
  duration: number;
  selectionTimeStart: number;
  selectionTimeEnd: number;
  children: VideoNode[];
}

export interface VideoNodeOnlyRoot extends Omit<VideoNode, 'children'> {}

export interface UpdateVideoNodeProps {
  name: string;
  url: string;
  duration: number;
  size: number;
  label: string;
  selectionTimeStart: number;
  selectionTimeEnd: number;
}
