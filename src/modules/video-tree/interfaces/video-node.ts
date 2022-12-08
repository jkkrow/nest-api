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

export type UpdateVideoNodeParams = Omit<
  IVideoNode,
  'id' | 'level' | 'children'
>;
