import { ICommand } from '@nestjs/cqrs';

export class SaveHistoryCommand implements ICommand {
  constructor(
    public readonly videoId: string,
    public readonly userId: string,
    public readonly activeNodeId: string,
    public readonly progress: number,
    public readonly totalProgress: number,
    public readonly ended: boolean,
  ) {}
}
