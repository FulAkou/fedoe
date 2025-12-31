import { prisma } from '../lib/prisma.js';

const generateSecretCode = () => {
  return `FF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

export const getOrders = async (req, res, next) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    // Regular users can only see their own orders
    if (req.user.role === 'USER') {
      where.userId = req.user.id;
    } else if (userId) {
      where.userId = userId;
    }

    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              dish: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  price: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
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

export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Regular users can only see their own orders
    if (req.user.role === 'USER' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderBySecretCode = async (req, res, next) => {
  try {
    const { secretCode } = req.params;

    const order = await prisma.order.findUnique({
      where: { secretCode },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, seats, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Au moins un article est requis' });
    }

    // Fetch dishes and calculate total
    const dishIds = items.map(item => item.dishId);
    const dishes = await prisma.dish.findMany({
      where: {
        id: { in: dishIds },
      },
    });

    if (dishes.length !== dishIds.length) {
      return res.status(400).json({ error: 'Un ou plusieurs plats sont invalides' });
    }

    let total = 0;
    const orderItems = items.map(item => {
      const dish = dishes.find(d => d.id === item.dishId);
      const itemTotal = dish.price * item.quantity;
      total += itemTotal;

      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: dish.price,
      };
    });

    // Generate unique secret code
    let secretCode = generateSecretCode();
    let codeExists = await prisma.order.findUnique({
      where: { secretCode },
    });

    // Ensure uniqueness
    while (codeExists) {
      secretCode = generateSecretCode();
      codeExists = await prisma.order.findUnique({
        where: { secretCode },
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        secretCode,
        total,
        seats: seats || 1,
        paymentMethod,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Only admins and staff can update order status
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'STAFF') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Only admins can delete orders
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await prisma.order.delete({
      where: { id },
    });

    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};

