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
    this.router.patch(
      '/:id',
      verifyToken,
      verifyOrganizerByRole,
      this.eventRouter.updateEvent,
    );
    this.router.get(
      '/my-events',
      verifyToken,
      verifyOrganizerByRole,
      this.eventRouter.getEventByOrganizerId,
    );
    this.router.get('/', this.eventRouter.getAllEvent);
    this.router.get(
      '/attended/:username',
      this.eventRouter.getEventsByAttended,
    );
    this.router.get('/event-detail/:id', this.eventRouter.getEventById);
    this.router.get('/event-filter', this.eventRouter.getAllEventByEventFilter);
    this.router.delete(
      '/:id',
      verifyToken,
      verifyOrganizerByRole,
      this.eventRouter.deleteEvent,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
