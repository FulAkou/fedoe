import express from 'express';
import {
  signup,
  signin,
  getMe,
  resetPassword,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  signupSchema,
  signinSchema,
  resetPasswordSchema,
} from '../validations/auth.validation.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/signin', validate(signinSchema), signin);
router.get('/me', authenticate, getMe);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;

