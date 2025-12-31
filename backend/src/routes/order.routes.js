import express from 'express';
import {
  getOrders,
  getOrder,
  getOrderBySecretCode,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createOrderSchema,
  updateOrderSchema,
  getOrdersSchema,
} from '../validations/order.validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (for authenticated users)
router.get('/secret-code/:secretCode', getOrderBySecretCode);

// User routes
router.get('/', validate(getOrdersSchema), getOrders);
router.get('/:id', getOrder);
router.post('/', validate(createOrderSchema), createOrder);

// Admin/Staff routes
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN', 'STAFF'), validate(updateOrderSchema), updateOrder);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), deleteOrder);

export default router;

