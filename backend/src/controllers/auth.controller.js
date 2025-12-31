import { comparePassword, hashPassword } from '../lib/bcrypt.js';
import { generateToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, telephone } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        telephone,
        ...(req.body.role ? { role: req.body.role } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Inscription réussie',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return res.json({
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      });
    }

    // TODO: Send reset password email
    // For now, just return success
    res.json({
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    });
  } catch (error) {
    next(error);
  }
};

