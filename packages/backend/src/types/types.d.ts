import { JWTToken } from '../middleware/authentication';
declare global {
  namespace Express {
    interface Request {
      token: JWTToken | null;
    }
  }
}
