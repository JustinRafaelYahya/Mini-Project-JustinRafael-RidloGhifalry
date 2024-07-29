import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { addMonths } from 'date-fns';
import prisma from '@/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpCodeSchema,
} from '@/schemas';
import { sendVerificationEmail } from '@/utils/send-email';

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

      const generatedOtpCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

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

      const hashedOtpCode = await bcrypt.hash(generatedOtpCode, 10);

      const userOtpCode = await prisma.userOtpCode.create({
        data: {
          user_id: newUser.id,
          otp_code: hashedOtpCode,
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

      await sendVerificationEmail({
        email: newUser.email,
        id: userOtpCode.id,
        otpCode: generatedOtpCode,
      });

      res.status(201).json({ ok: true, message: 'Email verification sent!' });
    } catch (error) {
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

      if (!user.is_verified) {
        const generatedOtpCode = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();

        const hashedOtpCode = await bcrypt.hash(generatedOtpCode, 10);

        const userOtpCode = await prisma.userOtpCode.create({
          data: {
            user_id: user.id,
            otp_code: hashedOtpCode,
          },
        });

        await sendVerificationEmail({
          email: user.email,
          id: userOtpCode.id,
          otpCode: generatedOtpCode,
        });

        return res
          .status(401)
          .json({ ok: false, message: 'Verify your email, check your email!' });
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
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async verifyOtpCode(req: Request, res: Response) {
    const { token } = req.query;
    const validatedField = verifyOtpCodeSchema.safeParse(req.body);

    if (!validatedField.success) {
      if (!validatedField.success) {
        return res.status(400).json({
          ok: false,
          message: validatedField.error.issues[0].message,
        });
      }
    }

    try {
      const { otpCode } = validatedField.data;

      const userOtpCode = await prisma.userOtpCode.findFirst({
        where: {
          id: String(token),
        },
      });

      if (!userOtpCode) {
        return res
          .status(400)
          .json({ ok: false, message: 'Invalid credentials!' });
      }

      const isOtpCodeValid = await bcrypt.compare(
        otpCode,
        userOtpCode!.otp_code,
      );

      if (!isOtpCodeValid) {
        return res
          .status(400)
          .json({ ok: false, message: 'Invalid credentials!' });
      }

      await prisma.$transaction([
        prisma.userOtpCode.deleteMany({
          where: {
            user_id: userOtpCode.user_id,
          },
        }),
        prisma.user.update({
          where: {
            id: userOtpCode.user_id,
          },
          data: {
            is_verified: true,
          },
        }),
      ]);

      res.status(200).json({ ok: true, message: 'Otp code verified!' });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
}
