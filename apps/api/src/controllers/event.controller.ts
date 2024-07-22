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
      start_time: start_event.split('T')[1],
      end_time: end_event.split('T')[1],
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
          thumbnail: validatedRequest.data.thumbnail || 'default',
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

  async getEventById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const event = await prisma.event.findUnique({
        where: {
          id: parseInt(id, 10), // Ensure id is a number
        },
        include: {
          organizer: true,
        },
      });

      if (!event) {
        return res.status(404).json({ ok: false, message: 'Event not found' });
      }

      const user = await prisma.user.findUnique({
        where: { id: event.organizer.user_id },
        select: {
          username: true,
          email: true,
        },
      });

      const transformedData = {
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

      return res
        .status(200)
        .json({ ok: true, message: 'success', data: transformedData });
    } catch (error) {
      console.error('Error fetching event:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }
  async getAllEventByEventFilter(req: Request, res: Response) {
    const { event_type, page, date_filter, location, price, query } = req.query;
    const pageNumber = page ? Number(page) : 1;
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    let endDate: Date | undefined;

    // Adjust date range based on the date_filter
    if (date_filter === 'today') {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else if (date_filter === 'this_week') {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (7 - startDate.getDay()));
    } else if (date_filter === 'this_month') {
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    }

    try {
      const where: Prisma.EventWhereInput = {
        start_event: {
          gte: currentDate, // Ensure only upcoming events are fetched with precise hour
        } as Prisma.DateTimeFilter, // Type assertion
      };

      if (
        event_type &&
        typeof event_type === 'string' &&
        event_type !== 'all'
      ) {
        where.event_type = event_type as Type;
      }

      if (location && typeof location === 'string' && location !== 'All') {
        where.location = {
          contains: location,
        } as Prisma.StringFilter;
      }

      if (endDate) {
        if (typeof where.start_event === 'object') {
          (where.start_event as Prisma.DateTimeFilter).lte = endDate;
        } else {
          where.start_event = {
            gte: currentDate,
            lte: endDate,
          } as Prisma.DateTimeFilter;
        }
      }

      if (query && typeof query === 'string') {
        where.OR = [
          {
            name: {
              contains: query,
            } as Prisma.StringFilter,
          },
          {
            about: {
              contains: query,
            } as Prisma.StringFilter,
          },
        ];
      }

      const orderBy: Prisma.EventOrderByWithRelationInput[] = [
        { start_event: 'asc' },
      ];

      if (price && (price === 'asc' || price === 'desc')) {
        orderBy.push({ price: price as Prisma.SortOrder });
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
      console.error('Error fetching events:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  // async getAllEventByEventFilter(req: Request, res: Response) {
  //   const { event_type, page, date_filter, location, price } = req.query;
  //   const pageNumber = page ? Number(page) : 1;
  //   const currentDate = new Date();
  //   const startDate = new Date(currentDate);
  //   let endDate: Date | undefined;

  //   // Adjust date range based on the date_filter
  //   if (date_filter === 'today') {
  //     endDate = new Date(startDate);
  //     endDate.setDate(endDate.getDate() + 1);
  //   } else if (date_filter === 'this_week') {
  //     endDate = new Date(startDate);
  //     endDate.setDate(endDate.getDate() + (7 - startDate.getDay()));
  //   } else if (date_filter === 'this_month') {
  //     endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  //   }

  //   try {
  //     const where: Prisma.EventWhereInput = {
  //       start_event: {
  //         gte: currentDate, // Ensure only upcoming events are fetched with precise hour
  //       } as Prisma.DateTimeFilter, // Type assertion
  //     };

  //     if (event_type && event_type !== 'all') {
  //       where.event_type = event_type as Type;
  //     }

  //     if (location && location !== 'All') {
  //       where.location = location as string;
  //     }

  //     if (endDate) {
  //       if (typeof where.start_event === 'object') {
  //         (where.start_event as Prisma.DateTimeFilter).lte = endDate;
  //       } else {
  //         where.start_event = {
  //           gte: currentDate,
  //           lte: endDate,
  //         } as Prisma.DateTimeFilter;
  //       }
  //     }

  //     const orderBy: Prisma.EventOrderByWithRelationInput[] = [
  //       { start_event: 'asc' },
  //     ];

  //     if (price) {
  //       const order: Prisma.SortOrder = price === 'desc' ? 'desc' : 'asc';
  //       orderBy.push({ price: order });
  //     }

  //     const events = await prisma.event.findMany({
  //       where,
  //       orderBy,
  //       skip: (pageNumber - 1) * 9,
  //       take: 9,
  //       include: {
  //         organizer: true, // Including organizer
  //       },
  //     });

  //     const transformedData = await Promise.all(
  //       events.map(async (event) => {
  //         const user = await prisma.user.findUnique({
  //           where: { id: event.organizer.user_id },
  //           select: {
  //             username: true,
  //             email: true,
  //           },
  //         });

  //         return {
  //           id: event.id,
  //           name: event.name,
  //           tagline: event.tagline,
  //           about: event.about,
  //           event_type: event.event_type,
  //           thumbnail: event.thumbnail,
  //           seats: event.seats,
  //           start_event: event.start_event,
  //           end_event: event.end_event,
  //           start_time: event.start_time,
  //           end_time: event.end_time,
  //           price: event.price,
  //           location: event.location,
  //           likes: event.likes,
  //           shared: event.shared,
  //           organizer: {
  //             id: event.organizer.id,
  //             username: user?.username || 'Unknown',
  //             email: user?.email || 'Unknown',
  //           },
  //         };
  //       }),
  //     );

  //     return res
  //       .status(200)
  //       .json({ ok: true, message: 'success', transformedData });
  //   } catch (error) {
  //     console.error('Error creating event:', error);
  //     return res
  //       .status(500)
  //       .json({ ok: false, message: 'Internal server error' });
  //   }
  // }
}
