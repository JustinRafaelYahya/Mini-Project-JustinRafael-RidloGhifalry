import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class TransactionController {
  async purchaseTicket(req: Request, res: Response) {
    const user = req.user;
    const { eventId, discountCode } = req.body;

    try {
      const event = await prisma.event.findUnique({
        where: { id: Number(eventId) },
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (discountCode !== event.discount_code) {
        return res.status(400).json({ message: 'Invalid discount code' });
      }

      const discountUsageLimit = event.discount_usage_limit ?? 0;

      if (discountUsageLimit <= 0) {
        return res
          .status(400)
          .json({ message: 'Discount code usage limit exceeded' });
      }

      const userRecord = await prisma.user.findUnique({
        where: { id: Number(user.id) },
      });

      if (!userRecord) {
        return res.status(404).json({ message: 'User not found' });
      }

      let finalPrice = Number(event.price);
      if (userRecord.use_redeem_code && discountCode === event.discount_code) {
        finalPrice *= 0.9; // Apply 10% discount
      }

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
        data: { discount_usage_limit: discountUsageLimit - 1 },
      });

      return res
        .status(200)
        .json({ message: 'Ticket purchased successfully', attendee });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }
}
