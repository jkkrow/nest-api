import { IQuery } from '@nestjs/cqrs';

export class SigninQuery implements IQuery {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
