import { IQuery } from '@nestjs/cqrs';

export class GoogleSigninQuery implements IQuery {
  constructor(public readonly token: string) {}
}
