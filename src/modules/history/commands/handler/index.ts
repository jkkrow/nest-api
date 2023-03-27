import { SaveHistoryHandler } from './save-history.handler';
import { DeleteHistoryHandler } from './delete-history.handler';
import { ClearHistoryHandler } from './clear-history.handler';

export const CommandHandlers = [
  SaveHistoryHandler,
  DeleteHistoryHandler,
  ClearHistoryHandler,
];
