import { AuthController } from '@/controllers/auth.controller';
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
  }

  getRouter(): Router {
    return this.router;
  }
}
