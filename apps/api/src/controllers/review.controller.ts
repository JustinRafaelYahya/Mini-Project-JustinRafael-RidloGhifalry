import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class ReviewController {
  async checkReviewStatus(req: Request, res: Response) {
    const user = req.user;
    const { eventId } = req.params;

    try {
      const review = await prisma.review.findFirst({
        where: {
          event_id: Number(eventId),
          user_id: Number(user.id),
        },
      });

      const rating = await prisma.rating.findFirst({
        where: {
          event_id: Number(eventId),
          user_id: Number(user.id),
        },
      });

      if (review && rating) {
        return res.status(200).json({ reviewed: true, review, rating });
      } else {
        return res.status(200).json({ reviewed: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }

  async submitReview(req: Request, res: Response) {
    const user = req.user;
    const { eventId, rating, review } = req.body;

    // Validate rating and review
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating' });
    }
    if (typeof review !== 'string' || review.trim().length === 0) {
      return res.status(400).json({ message: 'Invalid review' });
    }

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const existingReview = await prisma.review.findFirst({
          where: {
            event_id: Number(eventId),
            user_id: Number(user.id),
          },
        });

        const existingRating = await prisma.rating.findFirst({
          where: {
            event_id: Number(eventId),
            user_id: Number(user.id),
          },
        });

        let updatedReview, updatedRating;

        if (existingReview) {
          updatedReview = await prisma.review.update({
            where: { id: existingReview.id },
            data: {
              review,
              updatedAt: new Date(),
            },
          });
        } else {
          updatedReview = await prisma.review.create({
            data: {
              event_id: Number(eventId),
              user_id: Number(user.id),
              review,
            },
          });
        }

        if (existingRating) {
          updatedRating = await prisma.rating.update({
            where: { id: existingRating.id },
            data: {
              rating,
              updatedAt: new Date(),
            },
          });
        } else {
          updatedRating = await prisma.rating.create({
            data: {
              event_id: Number(eventId),
              user_id: Number(user.id),
              rating,
            },
          });
        }

        return { updatedReview, updatedRating };
      });

      return res.status(201).json({
        message: 'Review and rating submitted successfully',
        review: result.updatedReview,
        rating: result.updatedRating,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }
}

// import { PrismaClient } from '@prisma/client';
// import { Request, Response } from 'express';

// const prisma = new PrismaClient();

// export class ReviewController {
//   async checkReviewStatus(req: Request, res: Response) {
//     const user = req.user;
//     const { eventId } = req.params;

//     try {
//       const event = await prisma.event.findUnique({
//         where: { id: Number(eventId) },
//         include: {
//           attendes: {
//             where: { user_id: Number(user.id) },
//           },
//         },
//       });

//       if (!event || !event.attendes.length) {
//         return res
//           .status(403)
//           .json({ message: 'User has not attended this event' });
//       }

//       if (new Date(event.end_event) > new Date()) {
//         return res.status(403).json({ message: 'Event has not ended yet' });
//       }

//       const review = await prisma.review.findFirst({
//         where: {
//           event_id: Number(eventId),
//           user_id: Number(user.id),
//         },
//       });

//       const rating = await prisma.rating.findFirst({
//         where: {
//           event_id: Number(eventId),
//           user_id: Number(user.id),
//         },
//       });

//       if (review && rating) {
//         return res.status(200).json({ reviewed: true, review, rating });
//       } else {
//         return res.status(200).json({ reviewed: false });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'An error occurred', error });
//     }
//   }

//   async submitReview(req: Request, res: Response) {
//     const user = req.user;
//     const { eventId, rating, review } = req.body;

//     if (typeof rating !== 'number' || rating < 1 || rating > 5) {
//       return res.status(400).json({ message: 'Invalid rating' });
//     }
//     if (typeof review !== 'string' || review.trim().length === 0) {
//       return res.status(400).json({ message: 'Invalid review' });
//     }

//     try {
//       const event = await prisma.event.findUnique({
//         where: { id: Number(eventId) },
//         include: {
//           attendes: {
//             where: { user_id: Number(user.id) },
//           },
//         },
//       });

//       if (!event || !event.attendes.length) {
//         return res
//           .status(403)
//           .json({ message: 'User has not attended this event' });
//       }

//       if (new Date(event.end_event) > new Date()) {
//         return res.status(403).json({ message: 'Event has not ended yet' });
//       }

//       const result = await prisma.$transaction(async (prisma) => {
//         const existingReview = await prisma.review.findFirst({
//           where: {
//             event_id: Number(eventId),
//             user_id: Number(user.id),
//           },
//         });

//         const existingRating = await prisma.rating.findFirst({
//           where: {
//             event_id: Number(eventId),
//             user_id: Number(user.id),
//           },
//         });

//         let updatedReview, updatedRating;

//         if (existingReview) {
//           updatedReview = await prisma.review.update({
//             where: { id: existingReview.id },
//             data: {
//               review,
//               updatedAt: new Date(),
//             },
//           });
//         } else {
//           updatedReview = await prisma.review.create({
//             data: {
//               event_id: Number(eventId),
//               user_id: Number(user.id),
//               review,
//             },
//           });
//         }

//         if (existingRating) {
//           updatedRating = await prisma.rating.update({
//             where: { id: existingRating.id },
//             data: {
//               rating,
//               updatedAt: new Date(),
//             },
//           });
//         } else {
//           updatedRating = await prisma.rating.create({
//             data: {
//               event_id: Number(eventId),
//               user_id: Number(user.id),
//               rating,
//             },
//           });
//         }

//         return { updatedReview, updatedRating };
//       });

//       return res.status(201).json({
//         message: 'Review and rating submitted successfully',
//         review: result.updatedReview,
//         rating: result.updatedRating,
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'An error occurred', error });
//     }
//   }
// }