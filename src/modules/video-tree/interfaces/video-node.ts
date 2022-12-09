export interface IVideoNode {
  id: string;
  name: string;
  url: string;
  label: string;
  level: number;
  size: number;
  duration: number;
  selectionTimeStart: number;
  selectionTimeEnd: number;
  children: IVideoNode[];
}

export interface UpdateVideoNodeProps {
  name: string;
  url: string;
  duration: number;
  size: number;
  label: string;
  selectionTimeStart: number;
  selectionTimeEnd: number;
}
