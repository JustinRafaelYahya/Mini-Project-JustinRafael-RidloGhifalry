import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '@/prisma';

import { updateOrganizerSchema, updateUserSchema } from '@/schemas';

export class UserController {
  async findMe(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(req.user.id),
        },
        select: {
          id: true,
          username: true,
          email: true,
          profile_picture: true,
          role: true,
          use_redeem_code: true,
          referral_number: true,
          referral_number_expired: true,
          redeem_code_expired: true,
          points: true,
          createdAt: true,
        },
      });

      const organizer = await prisma.organizer.findUnique({
        where: {
          user_id: Number(req.user.id),
        },
        include: {
          social_links: {
            select: {
              facebook: true,
              instagram: true,
              twitter: true,
            },
          },
        },
      });

      if (!organizer) {
        return res.status(200).json({ ok: true, message: 'User found!', user });
      }

      const userWithOrganizer = {
        ...user,
        contact_number: organizer?.contact_number,
        facebook: organizer?.social_links?.facebook || '',
        instagram: organizer?.social_links?.instagram || '',
        twitter: organizer?.social_links?.twitter || '',
      };

      res
        .status(200)
        .json({ ok: true, message: 'User found!', user: userWithOrganizer });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ register ~ error:', error);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    const { id } = req.params;

    if (Number(id) !== Number(req.user.id)) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    try {
      if (req.user.role !== Role.ORGANIZER) {
        const validatedRequest = updateUserSchema.safeParse(req.body);

        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const user = await prisma.user.update({
          where: {
            id: Number(id),
          },
          data: {
            username: validatedRequest.data.username,
            profile_picture: validatedRequest.data.profile_picture,
          },
        });

        res.status(200).json({ ok: true, message: 'User updated!', user });
      } else {
        const validatedRequest = updateOrganizerSchema.safeParse(req.body);

        if (!validatedRequest.success) {
          return res
            .status(400)
            .json({ ok: false, message: validatedRequest.error });
        }

        const foundOrganizer = await prisma.organizer.findUnique({
          where: {
            user_id: Number(id),
          },
          include: {
            social_links: true,
          },
        });

        const user = await prisma.user.update({
          where: {
            id: Number(id),
          },
          data: {
            username: validatedRequest.data.username,
            profile_picture: validatedRequest.data.profile_picture,
          },
        });

        const organizer = await prisma.organizer.update({
          where: {
            user_id: user.id,
          },
          data: {
            contact_number:
              validatedRequest.data.contact_number ||
              foundOrganizer?.contact_number,
          },
        });

        await prisma.socialLink.update({
          where: {
            organizer_id: organizer.id,
          },
          data: {
            facebook: validatedRequest.data.facebook,
            instagram: validatedRequest.data.instagram,
            twitter: validatedRequest.data.twitter,
          },
        });

        res.status(200).json({ ok: true, message: 'User updated!', user });
      }
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async findUserById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          use_redeem_code: true,
          redeem_code_expired: true,
        },
      });

      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      return res.status(200).json({ ok: true, message: 'User found!', user });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async findUserByUsername(req: Request, res: Response) {
    const { username } = req.params;

    try {
      const decodedUsername = decodeURIComponent(username);

      const user = await prisma.user.findFirst({
        where: {
          username: String(decodedUsername),
        },
        select: {
          id: true,
          username: true,
          email: true,
          profile_picture: true,
          role: true,
          use_redeem_code: true,
          referral_number: true,
          referral_number_expired: true,
          redeem_code_expired: true,
          points: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      const organizer = await prisma.organizer.findUnique({
        where: {
          user_id: Number(user.id),
        },
        include: {
          social_links: {
            select: {
              facebook: true,
              instagram: true,
              twitter: true,
            },
          },
        },
      });

      if (!organizer) {
        return res.status(200).json({ ok: true, message: 'User found!', user });
      }

      const userWithOrganizer = {
        ...user,
        contact_number: organizer?.contact_number,
        facebook: organizer?.social_links?.facebook || '',
        instagram: organizer?.social_links?.instagram || '',
        twitter: organizer?.social_links?.twitter || '',
      };

      res
        .status(200)
        .json({ ok: true, message: 'User found!', user: userWithOrganizer });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
}
