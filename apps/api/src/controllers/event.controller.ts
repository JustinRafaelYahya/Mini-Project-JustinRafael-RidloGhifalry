import { Request, Response } from 'express';
import { Prisma, Type } from '@prisma/client';
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

  // async getAllEvent(req: Request, res: Response) {
  //   console.log(process.env.DATABASE_URL);
  //   const { page } = req.query;
  //   const pageNumber = page ? Number(page) : 1;

  //   try {
  //     const events = await prisma.event.findMany({
  //       where: {
  //         start_event: {
  //           gte: new Date(),
  //         },
  //       },
  //       orderBy: {
  //         start_event: 'asc',
  //       },
  //       skip: (pageNumber - 1) * 9,
  //       take: 9,
  //     });

  //     return res.status(200).json({ ok: true, message: 'success', events });
  //   } catch (error) {
  //     console.error('Error creating event:', error);
  //     return res
  //       .status(500)
  //       .json({ ok: false, message: 'Internal server error' });
  //   }
  // }

  async getAllEvent(req: Request, res: Response) {
    const { page } = req.query;
    const pageNumber = page ? Number(page) : 1;

    try {
      const events = await prisma.event.findMany({
        orderBy: {
          start_event: 'asc',
        },
        skip: (pageNumber - 1) * 9,
        take: 9,
        include: {
          organizer: true, // Including organizer
        },
      });

      const transformedData = await Promise.all(
        events.map(async (event) => {
          const user = await prisma.user.findUnique({
            where: { id: event.organizer.user_id },
            select: {
              username: true,
              email: true,
            },
          });

          return {
            id: event.id,
            name: event.name,
            tagline: event.tagline,
            about: event.about,
            event_type: event.event_type,
            thumbnail: event.thumbnail,
            seats: event.seats,
            start_event: event.start_event,
            end_event: event.end_event,
            start_time: event.start_time,
            end_time: event.end_time,
            price: event.price,
            location: event.location,
            likes: event.likes,
            shared: event.shared,
            organizer: {
              id: event.organizer.id,
              username: user?.username || 'Unknown',
              email: user?.email || 'Unknown',
            },
          };
        }),
      );

      return res
        .status(200)
        .json({ ok: true, message: 'success', transformedData });
    } catch (error) {
      console.error('Error creating event:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  async getAllEventByStartDate(req: Request, res: Response) {
    const { start_event, page } = req.query;
    const startDate = new Date(start_event as string);
    const pageNumber = page ? Number(page) : 1;

    try {
      const events = await prisma.event.findMany({
        where: {
          start_event: {
            gte: startDate || '',
          },
        },
        orderBy: {
          start_event: 'asc',
        },
        skip: (pageNumber - 1) * 9,
        take: 9,
      });

      return res.status(200).json({ ok: true, message: 'success', events });
    } catch (error) {
      console.error('Error creating event:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  async getAllEventByEventType(req: Request, res: Response) {
    const { event_type, page, start_event, location, price } = req.query;
    const pageNumber = page ? Number(page) : 1;
    const startDate = start_event ? new Date(start_event as string) : undefined;

    try {
      const where: Prisma.EventWhereInput = {
        event_type: event_type as Type,
      };

      if (location) {
        where.location = location as string;
      }

      if (start_event) {
        where.start_event = {
          gte: startDate,
        };
      }

      const orderBy: Prisma.EventOrderByWithRelationInput[] = [];

      // Default order by start_event ascending
      orderBy.push({ start_event: 'asc' });

      // Check if price is provided and set orderBy accordingly
      if (price) {
        const order: Prisma.SortOrder = price === 'desc' ? 'desc' : 'asc';
        orderBy.push({ price: order });
      }

      const events = await prisma.event.findMany({
        where,
        orderBy,
        skip: (pageNumber - 1) * 9,
        take: 9,
        include: {
          organizer: true, // Including organizer
        },
      });

      const transformedData = await Promise.all(
        events.map(async (event) => {
          const user = await prisma.user.findUnique({
            where: { id: event.organizer.user_id },
            select: {
              username: true,
              email: true,
            },
          });

          return {
            id: event.id,
            name: event.name,
            tagline: event.tagline,
            about: event.about,
            event_type: event.event_type,
            thumbnail: event.thumbnail,
            seats: event.seats,
            start_event: event.start_event,
            end_event: event.end_event,
            start_time: event.start_time,
            end_time: event.end_time,
            price: event.price,
            location: event.location,
            likes: event.likes,
            shared: event.shared,
            organizer: {
              id: event.organizer.id,
              username: user?.username || 'Unknown',
              email: user?.email || 'Unknown',
            },
          };
        }),
      );

      return res
        .status(200)
        .json({ ok: true, message: 'success', transformedData });
    } catch (error) {
      console.error('Error creating event:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }
}
