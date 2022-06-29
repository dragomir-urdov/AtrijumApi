export class JwtPayload {
  /**
   * User email address.
   */
  email: string;
  /**
   * User id.
   */
  id: string;

  /**
   * Initialized by Jwt itself.
   */
  exp: number;
  /**
   * Initialized by Jwt itself.
   */
  iat: number;
}
