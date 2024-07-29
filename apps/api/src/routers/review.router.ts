import { ReviewController } from '@/controllers/review.controller';
import { verifyToken } from '@/middleware/verifyToken';
import { Router } from 'express';

export class ReviewRouter {
  private router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/checkReviewStatus/:eventId',
      verifyToken,
      this.reviewController.checkReviewStatus.bind(this.reviewController),
    );

    this.router.post(
      '/submitReview',
      verifyToken,
      this.reviewController.submitReview.bind(this.reviewController),
    );

    this.router.get(
      '/eventReviews/:eventId',
      this.reviewController.getEventReviews.bind(this.reviewController),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
