import { Router } from 'express';

import { DashboardController } from '@/controllers/dashboard.controller';
import { verifyToken } from '@/middleware/verifyToken';
import { verifyOrganizerByRole } from '@/middleware/verifyOrganizer';

export class DashboardRouter {
  private router: Router;
  private dashboardController: DashboardController;
  constructor() {
    this.dashboardController = new DashboardController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      verifyOrganizerByRole,
      this.dashboardController.getDashboardLifeTimeData,
    );
    this.router.get(
      '/chart',
      verifyToken,
      verifyOrganizerByRole,
      this.dashboardController.getDashboardForChart,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
