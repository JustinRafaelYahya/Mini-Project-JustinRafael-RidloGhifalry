import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PORT } from './config';

import { AuthRouter } from '@/routers/auth.router';
import { EventRouter } from '@/routers/event.router';
import { DashboardRouter } from '@/routers/dashboard.router';
import { UserRouter } from '@/routers/user.router';
import { TransactionRouter } from '@/routers/transaction.router';
import { ReviewRouter } from '@/routers/review.router';
import { LikesRouter } from '@/routers/likes.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const authRouter = new AuthRouter();
    const eventRouter = new EventRouter();
    const dashboardRouter = new DashboardRouter();
    const userRouter = new UserRouter();
    const transactionRouter = new TransactionRouter();
    const reviewRouter = new ReviewRouter();
    const likesRouter = new LikesRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/events', eventRouter.getRouter());
    this.app.use('/api/events', dashboardRouter.getRouter());
    this.app.use('/api/user', userRouter.getRouter());
    this.app.use('/api/transactions', transactionRouter.getRouter());
    this.app.use('/api/reviews', reviewRouter.getRouter());
    this.app.use('/api/likes', likesRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
