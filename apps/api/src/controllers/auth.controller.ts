import { Request, Response } from 'express';
import prisma from '@/prisma';
import bcrypt from 'bcryptjs';
import { addMonths } from 'date-fns';

import { loginSchema, registerSchema } from '@/schemas';

export class AuthController {
  async register(req: Request, res: Response) {
    const { referral_number } = req.query;

    const validatedRequest = registerSchema.safeParse(req.body);

    if (!validatedRequest.success) {
      return res.status(400).send(validatedRequest.error);
    }

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

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        referral_number: randomReferralNumber,
        referral_number_expired: referralNumberExpired,
        use_redeem_code: !!referral_number,
        role,
        points: 0,
      },
    });

    return res.status(201).json({ ok: true, message: 'User created!' });
  }

  async login(req: Request, res: Response) {
    const validatedRequest = loginSchema.safeParse(req.body);

    if (!validatedRequest.success) {
      return res.status(400).send(validatedRequest.error);
    }

    const { email, password } = validatedRequest.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
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

    return res.status(200).json({ ok: true, message: 'User logged in!' });
  }
}
