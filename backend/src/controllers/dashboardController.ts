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

    const avgScoreResult = await (prisma.recommendationItem as any).aggregate({
      where: {
        recommendation: {
          cv: {
            userId
          }
        }
      },
      _avg: {
        score: true
      }
    });

    const rawAvgScore = avgScoreResult._avg?.score || 0;
    
    let jobMatchRate = 0;
    if (rawAvgScore > 0) {
      jobMatchRate = rawAvgScore <= 1 ? Math.round(rawAvgScore * 100) : Math.round(rawAvgScore);
    }

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const cvsThisMonth = await (prisma.cv as any).count({
      where: {
        userId,
        status: 'done',
        createdAt: {
          gte: startOfThisMonth
        }
      }
    });
    
    const cvsLastMonth = await (prisma.cv as any).count({
      where: {
        userId,
        status: 'done',
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfThisMonth
        }
      }
    });

    let cvsParsedDescription = "Belum ada unggahan bulan ini";
    if (totalCVsParsed > 0) {
      if (cvsLastMonth === 0) {
        if (cvsThisMonth > 0) {
          cvsParsedDescription = `Meningkat ${cvsThisMonth} baru bulan ini`;
        } else {
          cvsParsedDescription = "Sama seperti bulan lalu";
        }
      } else {
        const growth = Math.round(((cvsThisMonth - cvsLastMonth) / cvsLastMonth) * 100);
        if (growth > 0) {
          cvsParsedDescription = `Meningkat ${growth}% dari bulan lalu`;
        } else if (growth < 0) {
          cvsParsedDescription = `Menurun ${Math.abs(growth)}% dari bulan lalu`;
        } else {
          cvsParsedDescription = "Sama seperti bulan lalu";
        }
      }
    }

    const globalAvgResult = await (prisma.recommendationItem as any).aggregate({
      _avg: {
        score: true
      }
    });
    const globalAvg = globalAvgResult._avg?.score || 0;
    const globalAvgPercent = globalAvg > 0 ? (globalAvg <= 1 ? globalAvg * 100 : globalAvg) : 70;

    let jobMatchRateDescription = "Unggah CV untuk melihat tingkat kecocokan";
    if (jobMatchRate > 0) {
      if (jobMatchRate > globalAvgPercent) {
        const diff = Math.round(jobMatchRate - globalAvgPercent);
        jobMatchRateDescription = `${diff}% lebih tinggi dari rata-rata pengguna`;
      } else if (jobMatchRate < globalAvgPercent) {
        const diff = Math.round(globalAvgPercent - jobMatchRate);
        jobMatchRateDescription = `${diff}% lebih rendah dari rata-rata pengguna`;
      } else {
        jobMatchRateDescription = "Setara dengan rata-rata pengguna lainnya";
      }
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const newRecommendationsCount = await (prisma.recommendation as any).count({
      where: {
        cv: { userId },
        createdAt: {
          gte: yesterday
        }
      }
    });

    let jobRecommendationsDescription = "Belum ada rekomendasi baru";
    if (newRecommendationsCount > 0) {
      jobRecommendationsDescription = `${newRecommendationsCount} rekomendasi baru sejak kemarin`;
    } else if (recommendationsCount > 0) {
      jobRecommendationsDescription = "Tidak ada rekomendasi baru hari ini";
    }

    res.json({
      success: true,
      data: {
        totalCVsParsed,
        jobMatchRate,
        jobRecommendations: recommendationsCount,
        cvsParsedDescription,
        jobMatchRateDescription,
        jobRecommendationsDescription
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
