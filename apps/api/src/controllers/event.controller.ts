import { Request, Response } from 'express';
import prisma from '@/prisma';

import { createEventSchema } from '@/schemas';

export class EventController {
  async createEvent(req: Request, res: Response) {
    const { start_event, end_event, tags, ...rest } = req.body;

    const parsedBody = {
      ...rest,
      start_event: new Date(start_event),
      end_event: new Date(end_event),
      tags,
    };

    const validatedRequest = createEventSchema.safeParse(parsedBody);

    if (!validatedRequest.success) {
      return res.status(400).json({
        ok: false,
        message: validatedRequest.error,
      });
    }

    try {
      const organizer = await prisma.organizer.findUnique({
        where: { user_id: Number(req.user.id) },
      });

      if (!organizer) {
        return res.status(404).send('Organizer not found');
      }

      const event = await prisma.event.create({
        data: {
          name: validatedRequest.data.name,
          tagline: validatedRequest.data.tagline,
          about: validatedRequest.data.about,
          event_type: validatedRequest.data.event_type,
          thumbnail: validatedRequest.data.thumbnail,
          seats: validatedRequest.data.seats,
          start_event: validatedRequest.data.start_event,
          end_event: validatedRequest.data.end_event,
          start_time: validatedRequest.data.start_time,
          end_time: validatedRequest.data.end_time,
          price: validatedRequest.data.price,
          location: validatedRequest.data.location,
          organizer_id: organizer.id,
          likes: 0,
          shared: 0,
        },
      });

      const tagPromises = tags.map(async (tagName: string) => {
        const tag = await prisma.tag.upsert({
          where: { tag: tagName },
          create: { tag: tagName },
          update: {},
        });

        await prisma.eventTag.create({
          data: {
            event_id: event.id,
            tag_id: tag.id,
          },
        });

        return tag;
      });

      await Promise.all(tagPromises);

      return res.status(200).json({ ok: true, message: 'Event created!' });
    } catch (error) {
      console.error('Error creating event:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  async getAllEvent(req: Request, res: Response) {
    const { page } = req.query;
    const pageNumber = page ? Number(page) : 1;

    try {
      const events = await prisma.event.findMany({
        where: {
          start_event: {
            gte: new Date(),
          },
        },
        orderBy: {
          start_event: 'asc', // Order by start_event in ascending order
        },
        skip: (pageNumber - 1) * 3,
        take: 3,
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
