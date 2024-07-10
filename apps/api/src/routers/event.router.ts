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
    this.router.get('/start-date', this.eventRouter.getAllEventByStartDate);
    this.router.get('/event-filter', this.eventRouter.getAllEventByEventFilter);
  }

  getRouter(): Router {
    return this.router;
  }
}
