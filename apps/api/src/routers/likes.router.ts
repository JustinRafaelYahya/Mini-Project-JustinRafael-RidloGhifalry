import { Router } from 'express';
import { LikesController } from '@/controllers/likes.controller';
import { verifyToken } from '@/middleware/verifyToken';

export class LikesRouter {
  private router: Router;
  private likesController: LikesController;

  constructor() {
    this.likesController = new LikesController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/:id', verifyToken, this.likesController.likeEvent);
  }

  getRouter(): Router {
    return this.router;
  }
}
