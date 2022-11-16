import { AggregateRoot } from '@nestjs/cqrs';

import { UserCreatedEvent } from './events/impl/user-created.event';
import { UserDeletedEvent } from './events/impl/user-deleted.event';
import { IUser, IUserPremium } from './interfaces/user.interface';

export class User extends AggregateRoot implements IUser {
  constructor(
    private readonly props: {
      readonly id: string;
      readonly type: 'native' | 'google';
      readonly email: string;
      name: string;
      password: string;
      picture: string;
      verified: boolean;
      admin: boolean;
      premium: IUserPremium;
    },
  ) {
    super();
  }

  get id() {
    return this.props.id;
  }

  get type() {
    return this.props.type;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get picture() {
    return this.props.picture;
  }

  get verified() {
    return this.props.verified;
  }

  get admin() {
    return this.props.admin;
  }

  get premium() {
    return { ...this.props.premium };
  }

  createUser() {
    this.apply(new UserCreatedEvent(this.id, this.email));
  }

  deleteUser() {
    this.apply(new UserDeletedEvent(this.id));
  }

  updateName(name: string) {
    this.props.name = name;
  }

  updatePassword(password: string) {
    this.props.password = password;
  }

  updatePicture(picture: string) {
    this.props.picture = picture;
  }

  updatePremium(premium: IUserPremium) {
    this.props.premium = { ...premium };
  }

  updateVerified(verified: boolean) {
    this.props.verified = verified;
  }

  updateAdmin(admin: boolean) {
    this.props.admin = admin;
  }
}
