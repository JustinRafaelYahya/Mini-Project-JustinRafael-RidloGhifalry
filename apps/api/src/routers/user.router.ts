import { verifyToken } from '@/middleware/verifyToken';
import { UserController } from '../controllers/user.controller';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/me', verifyToken, this.userController.findMe);
    this.router.patch(
      '/me/:id',
      verifyToken,
      this.userController.updateProfile,
    );
    this.router.get('/:id', verifyToken, this.userController.findUserById);
  }

  getRouter(): Router {
    return this.router;
  }
}
