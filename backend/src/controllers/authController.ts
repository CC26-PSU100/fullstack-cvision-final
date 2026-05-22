import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            fullName: name
          }
        }
      },
      include: { profile: true }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        accessToken: token,
        user: {
          id: user.id,
          name: user.profile?.fullName || '',
          email: user.email
        }
      }
    });
  } catch (error: any) {
    console.error('[Register Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const clientIp = (req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || '') as string;
    const cleanIp = clientIp.replace(/^::ffff:/, ''); 

    if (cleanIp) {
      await (prisma.cv as any).updateMany({
        where: {
          userId: null,
          ipAddress: cleanIp
        },
        data: {
          userId: user.id
        }
      });
    }

    res.json({
      success: true,
      data: {
        accessToken: token,
        user: {
          id: user.id,
          name: user.profile?.fullName || '',
          email: user.email
        }
      }
    });
  } catch (error: any) {
    console.error('[Login Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkSession = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.profile?.fullName || '',
        email: user.email
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
