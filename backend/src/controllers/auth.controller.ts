import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, description } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await prisma.business.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    let slug = generateSlug(name);
    let slugExists = await prisma.business.findUnique({ where: { slug } });
    let count = 1;
    while (slugExists) {
      const newSlug = `${slug}-${count}`;
      slugExists = await prisma.business.findUnique({ where: { slug: newSlug } });
      if (!slugExists) {
        slug = newSlug;
      }
      count++;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const business = await prisma.business.create({
      data: {
        name,
        email,
        slug,
        passwordHash,
        description,
      },
    });

    const secret = process.env.JWT_SECRET || 'fintel_super_secret_jwt_key_2026_purple_m3';
    const token = jwt.sign({ businessId: business.id }, secret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      business: {
        id: business.id,
        name: business.name,
        email: business.email,
        slug: business.slug,
        description: business.description,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const business = await prisma.business.findUnique({ where: { email } });
    if (!business) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, business.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fintel_super_secret_jwt_key_2026_purple_m3';
    const token = jwt.sign({ businessId: business.id }, secret, { expiresIn: '7d' });

    res.status(200).json({
      token,
      business: {
        id: business.id,
        name: business.name,
        email: business.email,
        slug: business.slug,
        description: business.description,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error during login' });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        description: true,
        logoUrl: true,
        createdAt: true,
      },
    });

    if (!business) {
      res.status(404).json({ error: 'Business profile not found' });
      return;
    }

    res.status(200).json(business);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching profile' });
  }
};
