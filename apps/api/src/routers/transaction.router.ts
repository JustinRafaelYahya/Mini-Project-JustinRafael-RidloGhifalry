import { TransactionController } from '@/controllers/transaction.controller';
import { verifyToken } from '@/middleware/verifyToken';
import { Router } from 'express';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/purchase',
      verifyToken,
      this.transactionController.purchaseTicket.bind(
        this.transactionController,
      ),
    );

    this.router.get(
      '/checkPurchaseStatus/:eventId',
      verifyToken,
      this.transactionController.checkPurchaseStatus.bind(
        this.transactionController,
      ),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
