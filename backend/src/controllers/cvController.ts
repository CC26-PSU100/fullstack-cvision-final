import { Request, Response } from 'express';
import prisma from '../config/prisma';
import fs from 'fs';
import path from 'path';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileSize(fileUrl: string | null): { size: number; formatted: string; exists: boolean } {
  if (!fileUrl) return { size: 0, formatted: '0 Bytes', exists: false };

  const filePath = path.join(__dirname, '../../', fileUrl);
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return { size: stats.size, formatted: formatFileSize(stats.size), exists: true };
    }
  } catch (err) {
    
  }
  return { size: 0, formatted: '0 Bytes', exists: false };
}

export const uploadCv = async (req: any, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${file.filename}`;
    const userId = req.user?.id;
    const ipAddress = req.ip;

    const cv = await (prisma.cv as any).create({
      data: {
        userId,
        ipAddress,
        fileUrl,
        inputType: 'pdf',
        status: 'done' 
      }
    });

    res.json({
      success: true,
      data: {
        cvId: cv.id,
        fileUrl: cv.fileUrl,
        status: cv.status
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserCv = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const cvs = await (prisma.cv as any).findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const cvsWithSize = cvs.map((cv: any) => {
      const fileInfo = getFileSize(cv.fileUrl);
      return {
        ...cv,
        fileSize: fileInfo.size,
        fileSizeFormatted: fileInfo.formatted,
        fileExists: fileInfo.exists
      };
    });

    res.json({ success: true, data: cvsWithSize });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCv = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { status } = req.body;
    const cv = await (prisma.cv as any).updateMany({
      where: { userId },
      data: { status }
    });
    res.json({ success: true, data: cv });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addExperience = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { title, company, description, startDate, endDate } = req.body;
    
    let cv = await (prisma.cv as any).findFirst({ where: { userId } });

    if (!cv) {
      cv = await (prisma.cv as any).create({
        data: {
          userId,
          status: 'pending',
          inputType: 'manual'
        }
      });
    }

    const experience = await (prisma.experience as any).create({
      data: {
        cvId: cv.id,
        title,
        company,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.json({ success: true, data: experience });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkills = async (req: any, res: Response) => {
  try {

    res.json({ success: true, message: 'Skills updated (placeholder)' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const processCv = async (req: Request, res: Response) => {
  try {
    const cvId = req.params.cvId as string;

    const cv = await (prisma.cv as any).findUnique({
      where: { id: cvId },
      include: {
        cvDomains: { include: { domain: true } },
        educations: true,
        experiences: true
      }
    });

    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    res.json({
      success: true,
      data: {
        status: 'done',
        domains: (cv.cvDomains || []).map((d: any) => ({
          domain: d.domain.name,
          confidence: d.confidence,
          sector: d.domain.sector
        })),
        educations: (cv.educations || []).map((e: any) => ({
          level: e.level,
          major: e.major,
          institution: e.institution,
          startYear: e.startYear,
          endYear: e.endYear
        })),
        experiences: (cv.experiences || []).map((ex: any) => ({
          title: ex.title,
          company: ex.company,
          description: ex.description,
          startDate: ex.startDate?.toISOString(),
          endDate: ex.endDate?.toISOString() || null
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCv = async (req: any, res: Response) => {
  try {
    const { cvId } = req.params;
    const userId = req.user.id;

    const cv = await (prisma.cv as any).findFirst({
      where: { id: cvId, userId }
    });

    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found or unauthorized' });
    }

    await (prisma.cv as any).delete({ where: { id: cvId } });

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkGuestLimit = async (req: Request, res: Response) => {
  try {
    const ipAddress = req.ip;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await (prisma.cv as any).count({
      where: {
        ipAddress,
        userId: null,
        createdAt: {
          gte: today
        }
      }
    });

    res.json({
      data: {
        limitReached: count >= 3
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const linkCvToUser = async (req: any, res: Response) => {
  try {
    const { cvId } = req.params;
    const userId = req.user.id;

    const cv = await (prisma.cv as any).findFirst({
      where: {
        id: cvId,
        userId: null
      }
    });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'Guest CV not found or already linked to a user'
      });
    }

    const updatedCv = await (prisma.cv as any).update({
      where: { id: cvId },
      data: { userId }
    });

    res.json({
      success: true,
      message: 'CV successfully linked to user',
      data: {
        cvId: updatedCv.id,
        fileUrl: updatedCv.fileUrl,
        status: updatedCv.status,
        linkedAt: updatedCv.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGuestCvs = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '';
    const cleanIp = clientIp.replace(/^::ffff:/, '');

    const guestCvs = await (prisma.cv as any).findMany({
      where: {
        ipAddress: cleanIp,
        userId: null
      },
      select: {
        id: true,
        fileUrl: true,
        inputType: true,
        status: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: {
        count: guestCvs.length,
        cvs: guestCvs
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function generateDummyAnalysis(): any {
  return {
    recommendations: [
      { rank: 1, title: "Software Engineer", score: 0.9214, category: "IT" },
      { rank: 2, title: "Backend Developer", score: 0.8971, category: "IT" },
      { rank: 3, title: "Full Stack Developer", score: 0.8543, category: "IT" },
      { rank: 4, title: "DevOps Engineer", score: 0.7821, category: "IT" },
      { rank: 5, title: "Data Engineer", score: 0.7456, category: "IT" }
    ],
    domains: [
      { domain: "Technology", confidence: 62.3, sector: "IT & Software" },
      { domain: "Engineering", confidence: 25.1, sector: "Engineering" },
      { domain: "Business", confidence: 8.5, sector: "Management" },
      { domain: "Design", confidence: 4.1, sector: "Creative" }
    ]
  };
}

export const uploadAndAnalyse = async (req: any, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${file.filename}`;
    const userId = req.user?.id;
    const ipAddress = req.ip;

    const analysisResult = generateDummyAnalysis();

    const cv = await (prisma.cv as any).create({
      data: {
        userId,
        ipAddress,
        fileUrl,
        inputType: 'pdf',
        status: 'done'
      }
    });

    await (prisma.cvAnalysis as any).create({
      data: {
        cvId: cv.id,
        analysisResult
      }
    });

    res.json({
      success: true,
      data: {
        cvId: cv.id,
        fileUrl: cv.fileUrl,
        status: cv.status,
        ...analysisResult
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyseCv = async (req: any, res: Response) => {
  try {
    const { cvId } = req.body;
    const userId = req.user?.id;

    if (!cvId) {
      return res.status(400).json({
        success: false,
        message: 'cvId is required'
      });
    }

    const cv = await (prisma.cv as any).findFirst({
      where: { id: cvId }
    });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    if (userId && cv.userId && cv.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const analysisResult = generateDummyAnalysis();

    await (prisma.cv as any).update({
      where: { id: cvId },
      data: { status: 'done' }
    });

    await (prisma.cvAnalysis as any).upsert({
      where: { cvId },
      create: { cvId, analysisResult },
      update: { analysisResult }
    });

    res.json({
      success: true,
      data: {
        cvId: cv.id,
        fileUrl: cv.fileUrl,
        status: 'done',
        ...analysisResult
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCvDetailedAnalysis = async (req: any, res: Response) => {
  try {
    const { cvId } = req.params;
    const userId = req.user.id;

    const cv = await (prisma.cv as any).findFirst({
      where: { id: cvId, userId },
      include: {
        cvAnalysis: true
      }
    });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found or unauthorized'
      });
    }

    const analysisResult = cv.cvAnalysis?.analysisResult || {
      recommendations: [],
      domains: []
    };

    const fileInfo = getFileSize(cv.fileUrl);

    res.json({
      success: true,
      data: {
        cvId: cv.id,
        fileUrl: cv.fileUrl,
        fileSize: fileInfo.size,
        fileSizeFormatted: fileInfo.formatted,
        inputType: cv.inputType,
        status: cv.status,
        uploadedAt: cv.createdAt,
        ...analysisResult
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function generateDummyRecommendations(domains: any[]): any[] {
  const jobTitles = [
    { title: "Software Engineer", category: "IT" },
    { title: "Backend Developer", category: "IT" },
    { title: "Frontend Developer", category: "IT" },
    { title: "Full Stack Developer", category: "IT" },
    { title: "DevOps Engineer", category: "IT" },
    { title: "Data Engineer", category: "IT" },
    { title: "Product Manager", category: "Management" },
    { title: "UI/UX Designer", category: "Design" },
    { title: "QA Engineer", category: "IT" },
    { title: "Cloud Engineer", category: "IT" }
  ];

  const shuffled = jobTitles.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5).map((job, index) => ({
    rank: index + 1,
    title: job.title,
    score: parseFloat((0.9 - index * 0.05).toFixed(4)),
    category: job.category
  }));
}
