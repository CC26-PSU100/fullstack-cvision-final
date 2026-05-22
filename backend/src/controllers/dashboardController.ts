import { Response } from 'express';
import prisma from '../config/prisma';

export const getStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const totalCVsParsed = await (prisma.cv as any).count({
      where: {
        userId,
        status: 'done'
      }
    });

    const recommendationsCount = await (prisma.recommendation as any).count({
      where: {
        cv: { userId }
      }
    });

    const totalUserCVs = await (prisma.cv as any).count({
      where: { userId }
    });

    const jobMatchRate = totalUserCVs > 0 ? 85 : 0;

    res.json({
      success: true,
      data: {
        totalCVsParsed,
        jobMatchRate,
        jobRecommendations: recommendationsCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await (prisma.user as any).findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkillGap = async (req: any, res: Response) => {
  try {
    
    res.json({
      success: true,
      data: {
        missingSkills: ['Typescript', 'Prisma'],
        currentSkills: ['Javascript', 'SQL']
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
