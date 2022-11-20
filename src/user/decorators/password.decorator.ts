import { Matches } from 'class-validator';

export const IsStrongPassword = () =>
  Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message: 'password too weak',
  });
