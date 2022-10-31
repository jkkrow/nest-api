import { AggregateRoot } from '@nestjs/cqrs';

import { UserCreatedEvent } from './events/impl/user-created.event';
import { IUserPremium } from './interfaces/user.interface';

export class User extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly type: string,
    private name: string,
    private readonly email: string,
    private password: string,
    private picture: string,
    private verified: boolean,
    private admin: boolean,
    private premium: IUserPremium | null,
    private readonly subscribers: string[],
  ) {
    super();
  }

  getId() {
    return this._id;
  }

  getType() {
    return this.type;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getPicture() {
    return this.picture;
  }

  getVerified() {
    return this.verified;
  }

  getAdmin() {
    return this.admin;
  }

  getPremium() {
    return this.premium ? { ...this.premium } : null;
  }

  getSubscribers() {
    return [...this.subscribers];
  }

  createUser(userId: string, email: string) {
    this.apply(new UserCreatedEvent(userId, email));
  }
}
