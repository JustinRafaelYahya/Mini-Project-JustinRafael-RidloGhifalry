import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

export class DashboardController {
  async getDashboardLifeTimeData(req: Request, res: Response) {
    const { published_at, visit_count } = req.query;

    try {
      const organizer = await prisma.organizer.findUnique({
        where: { user_id: Number(req.user.id) },
      });

      if (!organizer) {
        return res
          .status(404)
          .json({ ok: false, message: 'Organizer not found' });
      }

      const orderBy: Prisma.EventOrderByWithRelationInput[] = [];

      if (published_at) {
        orderBy.push({
          start_event: published_at === 'desc' ? 'desc' : 'asc',
        });
      }

      if (visit_count) {
        orderBy.push({
          attendes: {
            _count: visit_count === 'desc' ? 'desc' : 'asc',
          },
        });
      }

      const events = await prisma.event.findMany({
        orderBy,
        where: {
          organizer_id: organizer.id,
        },
        include: {
          _count: {
            select: { attendes: true },
          },
        },
      });

      return res.status(200).json({ ok: true, message: 'success', events });
    } catch (error) {
      console.error('Error creating event:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }
}
