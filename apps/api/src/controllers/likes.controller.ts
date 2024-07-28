import { Request, Response } from 'express';
import prisma from '@/prisma';

export class LikesController {
  async likeEvent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const event = await prisma.event.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!event) {
        return res.status(404).json({ ok: false, message: 'Event not found' });
      }

      const isEventLiked = await prisma.eventLike.findUnique({
        where: {
          event_id_user_id: {
            event_id: event.id,
            user_id: Number(req.user.id),
          },
        },
      });

      if (isEventLiked) {
        await prisma.$transaction([
          prisma.event.update({
            where: {
              id: event.id,
            },
            data: {
              likes: {
                decrement: 1,
              },
            },
          }),
          prisma.eventLike.delete({
            where: {
              event_id_user_id: {
                event_id: event.id,
                user_id: Number(req.user.id),
              },
            },
          }),
        ]);
        return res.status(200).json({ ok: true, message: 'Event unliked' });
      }

      await prisma.$transaction([
        prisma.event.update({
          where: {
            id: event.id,
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        }),
        prisma.eventLike.create({
          data: {
            event_id: event.id,
            user_id: Number(req.user.id),
          },
        }),
      ]);

      return res.status(200).json({ ok: true, message: 'Event liked' });
    } catch (error: any) {
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }
}
