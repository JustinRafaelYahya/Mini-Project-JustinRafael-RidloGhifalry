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

  async getDashboardForChart(req: Request, res: Response) {
    const { weekly, monthly, yearly } = req.query;

    try {
      const organizer = await prisma.organizer.findUnique({
        where: { user_id: Number(req.user.id) },
      });

      if (!organizer) {
        return res
          .status(404)
          .json({ ok: false, message: 'Organizer not found' });
      }

      const where: Prisma.EventWhereInput = {
        organizer_id: organizer.id,
      };

      if (weekly) {
        where.start_event = {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        };
      }

      if (monthly) {
        where.start_event = {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        };
      }

      if (yearly) {
        where.start_event = {
          gte: new Date(new Date().setDate(new Date().getDate() - 365)),
        };
      }

      const events = await prisma.event.findMany({
        where,
        orderBy: {
          start_event: 'asc',
        },
        select: {
          name: true,
          start_event: true,
          _count: {
            select: { attendes: true },
          },
        },
      });

      const transformedData = events.map((event) => ({
        name: event.name.slice(0, 5) + '...',
        date: event.start_event,
        attendesCount: event._count.attendes,
      }));

      res
        .status(200)
        .json({ ok: true, message: 'success', data: transformedData });
    } catch (error) {
      console.error('Error creating event:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }
}
