import { AuthController } from '@/controllers/auth.controller';
import { verifyToken } from '@/middleware/verifyToken';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authRouter: AuthController;

  constructor() {
    this.authRouter = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.authRouter.register);
    this.router.post('/login', this.authRouter.login);
    this.router.post('/otp-code', this.authRouter.verifyOtpCode);
    this.router.patch(
      '/reset-password',
      verifyToken,
      this.authRouter.resetPassword,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
