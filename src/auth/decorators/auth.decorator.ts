import { SetCookie } from 'src/common/decorators/cookie.decorator';

export function Authenticate(options?: { expire: boolean }) {
  const maxAge = options?.expire ? 0 : 60 * 60 * 24 * 7 * 1000;

  return SetCookie('refreshToken', {
    httpOnly: true,
    maxAge,
  });
}
