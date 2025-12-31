import { prisma } from '../lib/prisma.js';

export const getDishes = async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice, userId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }
    if (userId) where.userId = userId;

    const [dishes, total] = await Promise.all([
      prisma.dish.findMany({
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
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.dish.count({ where }),
    ]);

    res.json({
      dishes,
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

export const getDish = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          where: {
            status: 'APPROVED',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
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
            },
          },
          orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' },
          ],
          take: 20,
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!dish) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    res.json(dish);
  } catch (error) {
    next(error);
  }
};

export const createDish = async (req, res, next) => {
  try {
    const { name, description, imageUrl, price } = req.body;
    const userId = req.user.id;

    const dish = await prisma.dish.create({
      data: {
        name,
        description,
        imageUrl,
        price: parseFloat(price),
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

    res.status(201).json(dish);
  } catch (error) {
    next(error);
  }
};

export const updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, price } = req.body;

    // Check if dish exists
    const existingDish = await prisma.dish.findUnique({
      where: { id },
    });

    if (!existingDish) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    const dish = await prisma.dish.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(imageUrl && { imageUrl }),
        ...(price !== undefined && { price: parseFloat(price) }),
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

    res.json(dish);
  } catch (error) {
    next(error);
  }
};

export const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.dish.delete({
      where: { id },
    });

    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

