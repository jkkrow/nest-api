import { SubscribeChannelHandler } from './subscribe-channel.handler';
import { UnsubscribeChannelHandler } from './unsubscribe-channel.handler';

export const CommandHandlers = [
  SubscribeChannelHandler,
  UnsubscribeChannelHandler,
];
