import { prisma } from '../lib/prisma.js';

export const getReviews = async (req, res, next) => {
  try {
    const { dishId, userId, status, featured, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (dishId) where.dishId = dishId;
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured === 'true';

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          dish: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.review.count({ where }),
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment, dishId } = req.body;
    const userId = req.user.id;

    // Check if dish exists
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
    });

    if (!dish) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    // Check if user already reviewed this dish
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        dishId,
      },
    });

    if (existingReview) {
      return res.status(409).json({ error: 'Vous avez déjà laissé un avis pour ce plat' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        dishId,
        userId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });





    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment, status, featured } = req.body;

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    // Only allow users to update their own reviews (unless admin)
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      if (existingReview.userId !== req.user.id) {
        return res.status(403).json({ error: 'Vous ne pouvez modifier que vos propres avis' });
      }
      // Users can't change status or featured
      if (status !== undefined || featured !== undefined) {
        return res.status(403).json({ error: 'Vous ne pouvez pas modifier le statut de l\'avis' });
      }
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating: parseInt(rating) }),
        ...(comment && { comment }),
        ...(status && { status }),
        ...(featured !== undefined && { featured }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    // Only allow users to delete their own reviews (unless admin)
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      if (review.userId !== req.user.id) {
        return res.status(403).json({ error: 'Vous ne pouvez supprimer que vos propres avis' });
      }
    }

    await prisma.review.delete({
      where: { id },
    });

    res.json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

export const createReviewReply = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    // Only chefs and admins can reply
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Seuls les administrateurs peuvent répondre' });
    }

    const reply = await prisma.reviewReply.create({
      data: {
        content,
        reviewId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};

