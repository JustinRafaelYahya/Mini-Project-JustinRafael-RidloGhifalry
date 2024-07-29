import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class TransactionController {
  async purchaseTicket(req: Request, res: Response) {
    const user = req.user;
    const { eventId, discountCode, payWithPoints } = req.body;

    try {
      const event = await prisma.event.findUnique({
        where: { id: Number(eventId) },
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const userRecord = await prisma.user.findUnique({
        where: { id: Number(user.id) },
      });

      if (!userRecord) {
        return res.status(404).json({ message: 'User not found' });
      }

      const discountCodeValid =
        discountCode && Number(discountCode) === event.discount_code;
      const discountUsageLimit = event.discount_usage_limit ?? 0;

      if (discountCode && !discountCodeValid) {
        return res.status(400).json({ message: 'Invalid discount code' });
      }

      if (discountCodeValid && discountUsageLimit <= 0) {
        return res.status(400).json({
          message: 'Discount code usage limit exceeded for this event',
        });
      }

      let finalPrice = Number(event.price);
      const now = new Date();

      if (discountCodeValid) {
        if (!userRecord.use_redeem_code) {
          return res
            .status(400)
            .json({ message: 'You do not possess a discount coupon' });
        }

        if (
          userRecord.redeem_code_expired &&
          userRecord.redeem_code_expired <= now
        ) {
          return res
            .status(400)
            .json({ message: 'Your discount coupon already expired' });
        }

        finalPrice *= 0.9; // Apply 10% discount
      }

      if (payWithPoints) {
        const pointsToUse = Math.min(userRecord.points, finalPrice);
        await prisma.user.update({
          where: { id: Number(user.id) },
          data: { points: userRecord.points - pointsToUse },
        });
        finalPrice -= pointsToUse;
      }

      await prisma.$transaction(async (prisma) => {
        const attendee = await prisma.attendees.create({
          data: {
            event_id: event.id,
            user_id: Number(user.id),
            price: finalPrice,
            joinedAt: new Date(),
          },
        });

        await prisma.event.update({
          where: { id: event.id },
          data: {
            discount_usage_limit:
              discountUsageLimit - (discountCodeValid ? 1 : 0),
            seats: event.seats - 1,
          },
        });

        return attendee;
      });

      return res.status(200).json({ message: 'Ticket purchased successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }

  async checkPurchaseStatus(req: Request, res: Response) {
    const user = req.user;
    const { eventId } = req.params;

    try {
      const attendee = await prisma.attendees.findFirst({
        where: {
          event_id: Number(eventId),
          user_id: Number(user.id),
        },
      });

      if (attendee) {
        return res.status(200).json({ purchased: true });
      } else {
        return res.status(200).json({ purchased: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }
}
