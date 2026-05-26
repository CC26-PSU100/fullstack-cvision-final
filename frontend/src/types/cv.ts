export type CVStatus = "parsing" | "done" | "error";

export interface CVFile {
  id: string;
  name: string;
  size: number;
  sizeFormatted?: string;
  uploadedAt: Date;
  status: CVStatus;
  matchScore?: number;
  jobCount?: number;
  fileUrl?: string;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  matchScore: number;
}

export interface CVAnalysisResult {
  metadata?: {
    cvId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileSizeFormatted: string;
    inputType: string;
    status: string;
    uploadedAt: string;
    updatedAt: string;
    originalName?: string;
    scanDurationSeconds?: number;
  };
  summary?: {
    totalEducations: number;
    totalExperiences: number;
    totalDomains: number;
    totalInterests: number;
  };
  recommendations: Array<{
    rank: number;
    title: string;
    score: number;
    category: string;
  }>;
  domains: Array<{
    domain: string;
    confidence: number;
    sector: string;
    source?: string;
  }>;
  educations?: Array<{
    level: string;
    major: string;
    institution: string;
    startYear: number;
    endYear: number | null;
  }>;
  experiences?: Array<{
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string | null;
  }>;
  skills?: string[];
  fileUrl?: string;
}