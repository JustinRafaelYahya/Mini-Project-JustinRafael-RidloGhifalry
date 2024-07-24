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
      this.transactionController.purchaseTicket,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
