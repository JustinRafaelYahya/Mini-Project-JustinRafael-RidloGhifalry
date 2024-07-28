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

      const now = new Date();
      if (weekly) {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        where.start_event = {
          gte: startOfWeek,
          lte: endOfWeek,
        };
      }

      if (monthly) {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        where.start_event = {
          gte: startOfMonth,
          lte: endOfMonth,
        };
      }

      if (yearly) {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        where.start_event = {
          gte: startOfYear,
          lte: endOfYear,
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
        name: event.name,
        date: event.start_event,
        attendesCount: event._count.attendes,
      }));

      res
        .status(200)
        .json({ ok: true, message: 'success', data: transformedData });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }
}
