import { IQuery } from '@nestjs/cqrs';

export class GetCredentialsQuery implements IQuery {
  constructor(public readonly refreshToken: string) {}
}
