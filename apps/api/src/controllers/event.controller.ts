import { Request, Response } from 'express';
import { Prisma, Type } from '@prisma/client';
import prisma from '@/prisma';

import { createEventSchema } from '@/schemas';

export class EventController {
  async createEvent(req: Request, res: Response) {
    const { start_event, end_event, tags, discount_code, ...rest } = req.body;

    const parsedBody = {
      ...rest,
      start_event: new Date(start_event),
      end_event: new Date(end_event),
      start_time: start_event.split('T')[1],
      end_time: end_event.split('T')[1],
      tags,
      discount_code,
    };

    const validatedRequest = createEventSchema.safeParse(parsedBody);

    if (!validatedRequest.success) {
      return res.status(400).json({
        ok: false,
        message: validatedRequest.error.issues[0].message,
      });
    }

    try {
      const organizer = await prisma.organizer.findUnique({
        where: { user_id: Number(req.user.id) },
      });

      if (!organizer) {
        return res.status(404).send('Organizer not found');
      }

      // Check if end_event is earlier than start_event
      if (new Date(end_event) < new Date(start_event)) {
        return res.status(400).json({
          ok: false,
          message: 'End event cannot be earlier than start event',
        });
      }

      // Ensure price can be 0
      if (validatedRequest.data.price < 0) {
        return res.status(400).json({
          ok: false,
          message: 'Price cannot be negative',
        });
      }

      // Validate discount code uniqueness and format
      if (discount_code) {
        const discountCodeExists = await prisma.event.findFirst({
          where: { discount_code: Number(discount_code) },
        });

        if (discountCodeExists) {
          return res.status(400).json({
            ok: false,
            message: 'Discount code already exists',
          });
        }

        const discountCodePattern = /^\d{6}$/;
        if (!discountCodePattern.test(discount_code.toString())) {
          return res.status(400).json({
            ok: false,
            message: 'Discount code must be a 6-digit number',
          });
        }
      }

      // Validate discount usage limit
      if (validatedRequest.data.discount_usage_limit) {
        const { discount_usage_limit, seats } = validatedRequest.data;
        if (discount_usage_limit > seats || discount_usage_limit <= 0) {
          return res.status(400).json({
            ok: false,
            message: 'Invalid discount usage limit',
          });
        }
      }

      // Create the event
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
          discount_code: validatedRequest.data.discount_code,
          discount_usage_limit: validatedRequest.data.discount_usage_limit,
          organizer_id: organizer.id,
          likes: 0,
          shared: 0,
        },
      });

      // Handle tags
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
          organizer: true,
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
            discount_code: event.discount_code,
            discount_usage_limit: event.discount_usage_limit,
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
          id: parseInt(id, 10),
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

      const eventLiked = await prisma.eventLike.findMany({
        where: { event_id: event.id },
      });

      const eventTags = await prisma.eventTag.findMany({
        where: { event_id: event.id },
        select: {
          tag: true,
        },
      });

      const tags = eventTags.map((tag) => tag.tag.tag);

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
        discount_code: event.discount_code,
        discount_usage_limit: event.discount_usage_limit,
        shared: event.shared,
        tags: tags,
        likes: event.likes,
        liked: eventLiked,
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
        end_event: {
          gte: currentDate,
        } as Prisma.DateTimeFilter,
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
            discount_code: event.discount_code,
            discount_usage_limit: event.discount_usage_limit,
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
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  async updateEvent(req: Request, res: Response) {
    const { id } = req.params;
    const {
      start_event,
      end_event,
      tags,
      discount_usage_limit,
      discount_code,
      ...rest
    } = req.body;

    const parsedBody = {
      ...rest,
      tags,
      start_event: new Date(start_event),
      end_event: new Date(end_event),
      discount_usage_limit: Number(discount_usage_limit),
      discount_code: Number(discount_code),
    };

    const validatedRequest = createEventSchema.safeParse(parsedBody);

    if (!validatedRequest.success) {
      return res.status(400).json({
        ok: false,
        message: validatedRequest.error.issues[0].message,
      });
    }

    try {
      const organizer = await prisma.organizer.findUnique({
        where: { user_id: Number(req.user.id) },
      });

      if (!organizer) {
        return res
          .status(404)
          .json({ ok: false, message: 'Organizer not found' });
      }

      const event = await prisma.event.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          organizer: true,
        },
      });

      if (!event) {
        return res.status(404).json({ ok: false, message: 'Event not found' });
      }

      if (req.user.id !== event.organizer.user_id) {
        return res.status(401).json({ ok: false, message: 'Unauthorized' });
      }

      const updatedEvent = await prisma.event.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: validatedRequest.data.name,
          tagline: validatedRequest.data.tagline,
          about: validatedRequest.data.about,
          event_type: validatedRequest.data.event_type,
          thumbnail: validatedRequest.data.thumbnail,
          seats: validatedRequest.data.seats,
          discount_code: validatedRequest.data.discount_code,
          discount_usage_limit: validatedRequest.data.discount_usage_limit,
          start_event: validatedRequest.data.start_event,
          end_event: validatedRequest.data.end_event,
          start_time: validatedRequest.data.start_time,
          end_time: validatedRequest.data.end_time,
          price: validatedRequest.data.price,
          location: validatedRequest.data.location,
        },
      });

      if (tags && Array.isArray(tags)) {
        const tagPromises = tags.map(async (tagName: string) => {
          const tag = await prisma.tag.upsert({
            where: { tag: tagName },
            create: { tag: tagName },
            update: {},
          });

          await prisma.eventTag.deleteMany({
            where: {
              event_id: event.id,
            },
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
      }

      return res.status(200).json({
        ok: true,
        message: 'Event updated successfully',
        updatedEvent,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  async getEventByOrganizerId(req: Request, res: Response) {
    try {
      const organizerId = req.user.id;

      const organizer = await prisma.organizer.findUnique({
        where: { user_id: Number(organizerId) },
      });

      if (!organizer) {
        return res
          .status(404)
          .json({ ok: false, message: 'Organizer not found' });
      }

      const events = await prisma.event.findMany({
        where: { organizer_id: organizer.id },
        include: {
          organizer: {
            select: {
              id: true,
              contact_number: true,
              social_links: true,
              followers: true,
              _count: {
                select: {
                  events: true,
                },
              },
            },
          },
          _count: {
            select: {
              attendes: true,
              like: true,
              review: true,
            },
          },
        },
      });

      return res
        .status(200)
        .json({ ok: true, message: 'success', data: events });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const userId = req.user.id;

      const organizer = await prisma.organizer.findUnique({
        where: {
          user_id: Number(userId),
        },
      });

      if (!organizer) {
        return res
          .status(404)
          .json({ ok: false, message: 'Organizer not found' });
      }

      const event = await prisma.event.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!event) {
        return res.status(404).json({ ok: false, message: 'Event not found' });
      }

      const isOrganizerOwnEvent = event.organizer_id === organizer.id;

      if (!isOrganizerOwnEvent) {
        return res.status(401).json({ ok: false, message: 'Unauthorized' });
      }

      if (
        new Date(event.end_event) > new Date() &&
        new Date(event.end_time).getTime() > new Date().getTime()
      ) {
        return res
          .status(400)
          .json({ ok: false, message: 'Event has not ended yet' });
      }

      await prisma.$transaction([
        prisma.attendees.deleteMany({ where: { event_id: Number(id) } }),
        prisma.rating.deleteMany({ where: { event_id: Number(id) } }),
        prisma.review.deleteMany({ where: { event_id: Number(id) } }),
        prisma.eventLike.deleteMany({ where: { event_id: Number(id) } }),
        prisma.eventTag.deleteMany({ where: { event_id: Number(id) } }),
        prisma.event.delete({ where: { id: Number(id) } }),
      ]);

      res.status(200).json({ ok: true, message: 'Event deleted successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }

  async getEventsByAttended(req: Request, res: Response) {
    const { username } = req.params;
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: String(username),
        },
      });

      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      const attendes = await prisma.attendees.findMany({
        where: {
          user_id: user.id,
        },
        include: {
          event: {
            include: {
              like: true,
              organizer: true,
            },
          },
        },
      });

      const transformedData = await Promise.all(
        attendes.map(async (event) => {
          const user = await prisma.user.findUnique({
            where: { id: event.event.organizer.user_id },
            select: {
              username: true,
              email: true,
            },
          });

          return {
            id: event.event.id,
            name: event.event.name,
            tagline: event.event.tagline,
            about: event.event.about,
            event_type: event.event.event_type,
            thumbnail: event.event.thumbnail,
            seats: event.event.seats,
            start_event: event.event.start_event,
            end_event: event.event.end_event,
            start_time: event.event.start_time,
            end_time: event.event.end_time,
            price: event.price,
            location: event.event.location,
            discount_code: event.event.discount_code,
            discount_usage_limit: event.event.discount_usage_limit,
            likes: event.event.likes,
            shared: event.event.shared,
            organizer: {
              id: event.event.organizer.id,
              username: user?.username || 'Unknown',
              email: user?.email || 'Unknown',
            },
          };
        }),
      );

      return res
        .status(200)
        .json({ ok: true, message: 'Success', data: transformedData });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: 'Internal server error' });
    }
  }
}
