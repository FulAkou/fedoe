import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        dishId: z.string(),
        quantity: z.number().int().positive(),
      })
    ).min(1, 'Au moins un article est requis'),
    seats: z.number().int().positive().default(1),
    paymentMethod: z.string().optional(),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const getOrdersSchema = z.object({
  query: z.object({
    userId: z.string().optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});

