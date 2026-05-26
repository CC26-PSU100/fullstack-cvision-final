import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import cloudinary from "../config/cloudinary";
import prisma from "../config/prisma";

function formatFileSize(bytes: number): string {
   if (bytes === 0) return "0 Bytes";
   const k = 1024;
   const sizes = ["Bytes", "KB", "MB", "GB"];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileSize(fileUrl: string | null): {
   size: number;
   formatted: string;
   exists: boolean;
} {
   if (!fileUrl) return { size: 0, formatted: "0 Bytes", exists: false };

   if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return { size: 1024 * 1024, formatted: "1.0 MB", exists: true };
   }

   const filePath = path.join(__dirname, "../../", fileUrl);
   try {
      if (fs.existsSync(filePath)) {
         const stats = fs.statSync(filePath);
         return {
            size: stats.size,
            formatted: formatFileSize(stats.size),
            exists: true,
         };
      }
   } catch (err) {}
   return { size: 0, formatted: "0 Bytes", exists: false };
}

export const uploadCv = async (req: any, res: Response) => {
   try {
      const file = req.file;
      if (!file) {
         return res
            .status(400)
            .json({ success: false, message: "No file uploaded" });
      }

      const userId = req.user?.id;
      const folderPath = userId ? `cvs/${userId}` : "cvs/guests";

      let fileUrl = "";
      try {
         const result = await cloudinary.uploader.upload(file.path, {
            folder: folderPath,
            public_id: path.parse(file.filename).name,
            resource_type: "auto",
         });
         fileUrl = result.secure_url;
      } finally {
         if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
         }
      }

      const ipAddress = req.ip;

      const cv = await (prisma.cv as any).create({
         data: {
            userId,
            ipAddress,
            fileUrl,
            inputType: "pdf",
            status: "done",
         },
      });

      res.json({
         success: true,
         data: {
            cvId: cv.id,
            fileUrl: cv.fileUrl,
            status: cv.status,
         },
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
         include: {
            cvAnalysis: true,
         },
         orderBy: { createdAt: "desc" },
      });

      const cvsWithSize = cvs.map((cv: any) => {
         const fileInfo = getFileSize(cv.fileUrl);
         const analysisResult = cv.cvAnalysis?.analysisResult || {};
         const metadata = (analysisResult as any).metadata || {};
         return {
            ...cv,
            fileSize: metadata.fileSize || fileInfo.size,
            fileSizeFormatted: metadata.fileSizeFormatted || fileInfo.formatted,
            originalName: metadata.originalName || cv.fileUrl?.split("/").pop() || "Untitled CV",
            fileExists: fileInfo.exists,
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
         data: { status },
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
               status: "pending",
               inputType: "manual",
            },
         });
      }

      const experience = await (prisma.experience as any).create({
         data: {
            cvId: cv.id,
            title,
            company,
            description,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
         },
      });

      res.json({ success: true, data: experience });
   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export const updateSkills = async (req: any, res: Response) => {
   try {
      res.json({ success: true, message: "Skills updated (placeholder)" });
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
            experiences: true,
         },
      });

      if (!cv) {
         return res
            .status(404)
            .json({ success: false, message: "CV not found" });
      }

      res.json({
         success: true,
         data: {
            status: "done",
            domains: (cv.cvDomains || []).map((d: any) => ({
               domain: d.domain.name,
               confidence: d.confidence,
               sector: d.domain.sector,
            })),
            educations: (cv.educations || []).map((e: any) => ({
               level: e.level,
               major: e.major,
               institution: e.institution,
               startYear: e.startYear,
               endYear: e.endYear,
            })),
            experiences: (cv.experiences || []).map((ex: any) => ({
               title: ex.title,
               company: ex.company,
               description: ex.description,
               startDate: ex.startDate?.toISOString(),
               endDate: ex.endDate?.toISOString() || null,
            })),
         },
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
         where: { id: cvId, userId },
      });

      if (!cv) {
         return res
            .status(404)
            .json({ success: false, message: "CV not found or unauthorized" });
      }

      if (
         cv.fileUrl &&
         (cv.fileUrl.startsWith("http://") || cv.fileUrl.startsWith("https://"))
      ) {
         try {
            const parts = cv.fileUrl.split("/upload/");
            if (parts.length === 2) {
               const pathPart = parts[1].replace(/^v\d+\//, "");
               const resourceType = parts[0].endsWith("/raw") ? "raw" : "image";
               const publicId =
                  resourceType === "raw"
                     ? pathPart
                     : pathPart.replace(/\.[^/.]+$/, "");
               await cloudinary.uploader.destroy(publicId, {
                  resource_type: resourceType,
               });
            }
         } catch (cloudErr) {
            console.error(cloudErr);
         }
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
               gte: today,
            },
         },
      });

      res.json({
         data: {
            limitReached: count >= 3,
         },
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
            userId: null,
         },
      });

      if (!cv) {
         return res.status(404).json({
            success: false,
            message: "Guest CV not found or already linked to a user",
         });
      }

      const updatedCv = await (prisma.cv as any).update({
         where: { id: cvId },
         data: { userId },
      });

      res.json({
         success: true,
         message: "CV successfully linked to user",
         data: {
            cvId: updatedCv.id,
            fileUrl: updatedCv.fileUrl,
            status: updatedCv.status,
            linkedAt: updatedCv.createdAt,
         },
      });
   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export const getGuestCvs = async (req: any, res: Response) => {
   try {
      const userId = req.user.id;
      const clientIp = req.ip || req.headers["x-forwarded-for"] || "";
      const cleanIp = clientIp.replace(/^::ffff:/, "");

      const guestCvs = await (prisma.cv as any).findMany({
         where: {
            ipAddress: cleanIp,
            userId: null,
         },
         select: {
            id: true,
            fileUrl: true,
            inputType: true,
            status: true,
            createdAt: true,
         },
      });

      res.json({
         success: true,
         data: {
            count: guestCvs.length,
            cvs: guestCvs,
         },
      });
   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export const uploadAndAnalyse = async (req: any, res: Response) => {
   try {
      const file = req.file;
      if (!file) {
         return res
            .status(400)
            .json({ success: false, message: "No file uploaded" });
      }

      const startTime = Date.now();

      const fileBuffer = fs.readFileSync(file.path);
      const fileBlob = new Blob([fileBuffer], { type: file.mimetype });
      const formData = new FormData();
      formData.append("file", fileBlob, file.originalname);

      const aiResponse = await axios.post("https://cv-recommender-306785532444.asia-southeast2.run.app/recommend", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      const analysisResult = aiResponse.data;
      const endTime = Date.now();
      const scanDurationSeconds = Math.round((endTime - startTime) / 1000);

      analysisResult.metadata = {
         fileSize: file.size,
         fileSizeFormatted: formatFileSize(file.size),
         originalName: file.originalname,
         scanDurationSeconds
      };

      const userId = req.user?.id;
      const folderPath = userId ? `cvs/${userId}` : "cvs/guests";

      let fileUrl = "";
      try {
         const result = await cloudinary.uploader.upload(file.path, {
            folder: folderPath,
            public_id: path.parse(file.filename).name,
            resource_type: "auto",
         });
         fileUrl = result.secure_url;
      } finally {
         if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
         }
      }

      const ipAddress = req.ip;

      const cv = await (prisma.cv as any).create({
         data: {
            userId,
            ipAddress,
            fileUrl,
            inputType: "pdf",
            status: "done",
         },
      });

      await (prisma.cvAnalysis as any).create({
         data: {
            cvId: cv.id,
            analysisResult,
         },
      });

      if (analysisResult.domains && Array.isArray(analysisResult.domains)) {
         for (const dom of analysisResult.domains) {
            let dbDomain = await (prisma.domain as any).findFirst({
               where: { name: dom.domain }
            });
            if (!dbDomain) {
               dbDomain = await (prisma.domain as any).create({
                  data: {
                     name: dom.domain,
                     sector: dom.sector || "General"
                  }
               });
            }
            await (prisma.cvDomain as any).create({
               data: {
                  cvId: cv.id,
                  domainId: dbDomain.id,
                  confidence: dom.confidence,
                  source: "extracted"
               }
            });
         }
      }

      if (analysisResult.recommendations && Array.isArray(analysisResult.recommendations)) {
         const recommendation = await (prisma.recommendation as any).create({
            data: {
               cvId: cv.id
            }
         });

         for (const rec of analysisResult.recommendations) {
            let dbJob = await (prisma.job as any).findFirst({
               where: { title: rec.title }
            });
            if (!dbJob) {
               const glintsUrl = `https://glints.com/id/opportunities/jobs/explore?keyword=${encodeURIComponent(rec.title)}&country=ID&locationName=All+Cities%2FProvinces&lowestLocationLevel=1`;
               const indeedUrl = `https://id.indeed.com/jobs?q=${encodeURIComponent(rec.title)}`;
               dbJob = await (prisma.job as any).create({
                  data: {
                     title: rec.title,
                     description: `Rekomendasi karir untuk ${rec.title}. Cari lowongan kerja di Glints: ${glintsUrl} atau di Indeed: ${indeedUrl}`,
                     company: "Mitra CVision",
                     location: "Indonesia",
                     workType: "Full-time",
                  }
               });
            }
            await (prisma.recommendationItem as any).create({
               data: {
                  recommendationId: recommendation.id,
                  jobId: dbJob.id,
                  score: rec.score
               }
            });
         }
      }

      res.json({
         success: true,
         data: {
            cvId: cv.id,
            fileUrl: cv.fileUrl,
            status: cv.status,
            ...analysisResult,
         },
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
            message: "cvId is required",
         });
      }

      const cv = await (prisma.cv as any).findFirst({
         where: { id: cvId },
      });

      if (!cv) {
         return res.status(404).json({
            success: false,
            message: "CV not found",
         });
      }

      if (userId && cv.userId && cv.userId !== userId) {
         return res.status(403).json({
            success: false,
            message: "Unauthorized",
         });
      }

      const startTime = Date.now();

      const fileResponse = await axios.get(cv.fileUrl, { responseType: "arraybuffer" });
      const fileBuffer = Buffer.from(fileResponse.data);
      const fileBlob = new Blob([fileBuffer], { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", fileBlob, "cv.pdf");

      const aiResponse = await axios.post("https://cv-recommender-306785532444.asia-southeast2.run.app/recommend", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      const analysisResult = aiResponse.data;
      const endTime = Date.now();
      const scanDurationSeconds = Math.round((endTime - startTime) / 1000);

      analysisResult.metadata = {
         fileSize: fileBuffer.length,
         fileSizeFormatted: formatFileSize(fileBuffer.length),
         originalName: cv.fileUrl.split("/").pop() || "cv.pdf",
         scanDurationSeconds
      };

      await (prisma.cv as any).update({
         where: { id: cvId },
         data: { status: "done" },
      });

      await (prisma.cvAnalysis as any).upsert({
         where: { cvId },
         create: { cvId, analysisResult },
         update: { analysisResult },
      });

      await (prisma.cvDomain as any).deleteMany({
         where: { cvId }
      });

      if (analysisResult.domains && Array.isArray(analysisResult.domains)) {
         for (const dom of analysisResult.domains) {
            let dbDomain = await (prisma.domain as any).findFirst({
               where: { name: dom.domain }
            });
            if (!dbDomain) {
               dbDomain = await (prisma.domain as any).create({
                  data: {
                     name: dom.domain,
                     sector: dom.sector || "General"
                  }
               });
            }
            await (prisma.cvDomain as any).create({
               data: {
                  cvId,
                  domainId: dbDomain.id,
                  confidence: dom.confidence,
                  source: "extracted"
               }
            });
         }
      }

      await (prisma.recommendation as any).deleteMany({
         where: { cvId }
      });

      if (analysisResult.recommendations && Array.isArray(analysisResult.recommendations)) {
         const recommendation = await (prisma.recommendation as any).create({
            data: {
               cvId
            }
         });

         for (const rec of analysisResult.recommendations) {
            let dbJob = await (prisma.job as any).findFirst({
               where: { title: rec.title }
            });
            if (!dbJob) {
               const glintsUrl = `https://glints.com/id/opportunities/jobs/explore?keyword=${encodeURIComponent(rec.title)}&country=ID&locationName=All+Cities%2FProvinces&lowestLocationLevel=1`;
               const indeedUrl = `https://id.indeed.com/jobs?q=${encodeURIComponent(rec.title)}`;
               dbJob = await (prisma.job as any).create({
                  data: {
                     title: rec.title,
                     description: `Rekomendasi karir untuk ${rec.title}. Cari lowongan kerja di Glints: ${glintsUrl} atau di Indeed: ${indeedUrl}`,
                     company: "Mitra CVision",
                     location: "Indonesia",
                     workType: "Full-time",
                  }
               });
            }
            await (prisma.recommendationItem as any).create({
               data: {
                  recommendationId: recommendation.id,
                  jobId: dbJob.id,
                  score: rec.score
               }
            });
         }
      }

      res.json({
         success: true,
         data: {
            cvId: cv.id,
            fileUrl: cv.fileUrl,
            status: "done",
            ...analysisResult,
         },
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
            cvAnalysis: true,
         },
      });

      if (!cv) {
         return res.status(404).json({
            success: false,
            message: "CV not found or unauthorized",
         });
      }

      const fileInfo = getFileSize(cv.fileUrl);
      const analysisResult = cv.cvAnalysis?.analysisResult || {
         recommendations: [],
         domains: [],
      };

      const finalAnalysisResult = typeof analysisResult === "object" ? { ...analysisResult } : { recommendations: [], domains: [] };
      if (!finalAnalysisResult.metadata) {
         finalAnalysisResult.metadata = {
            fileSize: fileInfo.size,
            fileSizeFormatted: fileInfo.formatted,
            originalName: cv.fileUrl?.split("/").pop() || "cv.pdf",
            scanDurationSeconds: 15
         };
      }

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
            ...finalAnalysisResult,
         },
      });
   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};
