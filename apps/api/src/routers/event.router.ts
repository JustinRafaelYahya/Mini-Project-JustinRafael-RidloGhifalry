import { EventController } from '@/controllers/event.controller';
import { verifyOrganizerByRole } from '@/middleware/verifyOrganizer';
import { verifyToken } from '@/middleware/verifyToken';
import { Router } from 'express';

export class EventRouter {
  private router: Router;
  private eventRouter: EventController;

  constructor() {
    this.eventRouter = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      verifyOrganizerByRole,
      this.eventRouter.createEvent,
    );
    this.router.get('/', this.eventRouter.getAllEvent);
  }

  getRouter(): Router {
    return this.router;
  }
}
