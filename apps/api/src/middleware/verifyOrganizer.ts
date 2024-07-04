import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export async function verifyOrganizerByRole(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user.role !== Role.ORGANIZER) {
    return res.status(401).send('Unauthorized');
  }

  next();
}
