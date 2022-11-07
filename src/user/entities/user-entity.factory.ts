// import { Injectable } from '@nestjs/common';
// import { DatabaseEntityFactory } from 'src/database/entities/database-entity.factory';

// import { User } from '../user.model';
// import { UserFactory } from '../user.factory';
// import { UserEntity } from './user.entity';

// @Injectable()
// export class UserSchemaFactory
//   implements DatabaseEntityFactory<UserEntity, User>
// {
//   create(user: User): UserEntity {
//     return {
//       id: user.getId(),
//       type: user.getType(),
//       name: user.getName(),
//       email: user.getEmail(),
//       password: user.getPassword(),
//       picture: user.getPicture(),
//       verified: user.getVerified(),
//       premium: user.getPremium(),
//       admin: user.getAdmin(),
//     };
//   }

//   createFromSchema(userSchema: UserEntity): User {
//     return new UserFactory().build(
//       userSchema.id,
//       userSchema.type,
//       userSchema.name,
//       userSchema.email,
//       userSchema.password,
//       userSchema.picture,
//       userSchema.verified,
//       userSchema.admin,
//       userSchema.premium,
//     );
//   }
// }
