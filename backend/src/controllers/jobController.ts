import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await (prisma.job as any).findMany();
    res.json({ success: true, data: jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const jobs = await (prisma.job as any).findMany({
      where: {
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } }
        ]
      }
    });
    res.json({ success: true, data: jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveJob = async (req: any, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const savedJob = await (prisma.savedJob as any).create({
      data: {
        userId,
        jobId
      }
    });

    res.json({ success: true, data: savedJob });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
