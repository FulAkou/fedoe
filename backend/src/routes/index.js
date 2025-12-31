import express from 'express';
import authRoutes from './auth.routes.js';
import dishRoutes from './dish.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dishes', dishRoutes);
router.use('/reviews', reviewRoutes);
router.use('/orders', orderRoutes);

export default router;
