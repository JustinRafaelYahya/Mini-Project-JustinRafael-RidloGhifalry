import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { addMonths } from 'date-fns';
import prisma from '@/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { loginSchema, registerSchema, resetPasswordSchema } from '@/schemas';

export class AuthController {
  async register(req: Request, res: Response) {
    const { referral_number } = req.query;

    const validatedRequest = registerSchema.safeParse(req.body);

    if (!validatedRequest.success) {
      return res
        .status(400)
        .json({ ok: false, message: validatedRequest.error.issues[0].message });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          email: validatedRequest.data.email,
        },
      });

      if (user) {
        return res
          .status(400)
          .json({ ok: false, message: 'Invalid credentials!' });
      }

      const { username, email, password, role } = validatedRequest.data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const randomReferralNumber = Math.floor(1000 + Math.random() * 9000);
      const referralNumberExpired = addMonths(new Date(), 3);

      if (referral_number) {
        const user = await prisma.user.findFirst({
          where: {
            referral_number: Number(referral_number),
          },
        });

        if (!user) {
          return res
            .status(404)
            .json({ ok: false, message: 'Referral number not found!' });
        }

        if (user.referral_number_expired < new Date()) {
          return res
            .status(400)
            .json({ ok: false, message: 'Referral number expired!' });
        }

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            points: user.points + 10_000,
            referral_number_expired: addMonths(user.referral_number_expired, 3),
          },
        });
      }

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          referral_number: randomReferralNumber,
          referral_number_expired: referralNumberExpired,
          use_redeem_code: !!referral_number,
          redeem_code_expired: referral_number
            ? addMonths(new Date(), 3)
            : null,
          role: validatedRequest.data.role || Role.CUSTOMER,
          points: 0,
        },
      });

      if (validatedRequest.data.role === Role.ORGANIZER) {
        const organizer = await prisma.organizer.create({
          data: {
            user_id: newUser.id,
            contact_number: validatedRequest.data.contact_number || '',
            followers: 0,
          },
        });

        await prisma.socialLink.create({
          data: {
            organizer_id: organizer.id,
            facebook: null,
            twitter: null,
            instagram: null,
          },
        });
      }

      res.status(201).json({ ok: true, message: 'User created!' });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ register ~ error:', error);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    const validatedRequest = loginSchema.safeParse(req.body);

    if (!validatedRequest.success) {
      return res.status(400).json({
        ok: false,
        message: validatedRequest.error.issues[0].message,
      });
    }

    try {
      const { email, password } = validatedRequest.data;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ ok: false, message: 'Invalid credentials!' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ ok: false, message: 'Invalid credentials!' });
      }

      const payLoad = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      const token = jwt.sign(payLoad, process.env.JWT_SECRET!, {
        expiresIn: '3d',
      });

      return res
        .status(200)
        .json({ ok: true, message: 'User logged in!', token });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ register ~ error:', error);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(req.user.id),
        },
      });

      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ ok: false, message: 'Invalid credentials!' });
      }

      const validatedRequest = resetPasswordSchema.safeParse({ newPassword });

      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          message: validatedRequest.error.issues[0].message,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      res.status(200).json({ ok: true, message: 'Password updated!' });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ resetPassword ~ error:', error);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
}
