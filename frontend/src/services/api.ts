import type { CVFile } from "@/types/cv";
import type { DashboardStats } from "@/types/stats";
import type { AuthResponse, RegisterPayload, LoginPayload } from "@/types/auth";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
const BACKEND_URL = `${BASE_URL}/api`;

const normalizeFileUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const cache: Record<string, { data: any; expiry: number }> = {};
const CACHE_TTL = 30000;

const getCachedData = (key: string) => {
  const cached = cache[key];
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache[key] = {
    data,
    expiry: Date.now() + CACHE_TTL,
  };
};

export const clearApiCache = () => {
  for (const key in cache) {
    delete cache[key];
  }
};

const authorizedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    ...options.headers,
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.setItem("logoutReason", "Sesi Anda telah berakhir. Silakan masuk kembali.");
    window.location.href = "/login";
    throw new Error("Sesi Anda telah berakhir. Silakan masuk kembali.");
  }

  return res;
};

export const api = {

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password } as LoginPayload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Authentication failed");
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },

  async uploadCV(file: File, signal?: AbortSignal): Promise<any> {
    clearApiCache();
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Authentication token not found");

    const formData = new FormData();
    formData.append("cv", file);

    const res = await authorizedFetch(`${BACKEND_URL}/cv/upload-and-analyse`, {
      method: "POST",
      body: formData,
      signal,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "CV Upload & Analysis failed");
    }

    const cvData = data.data;
    return {
      id: cvData.cvId,
      fileUrl: normalizeFileUrl(cvData.fileUrl),
      status: cvData.status,
      recommendations: cvData.recommendations,
      domains: cvData.domains,
      name: cvData.fileUrl?.split('/').pop() || file.name,
      uploadedAt: new Date(),
    };
  },

  async getStats(): Promise<DashboardStats> {
    const cacheKey = "stats";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const token = localStorage.getItem("accessToken");
    if (!token) return { totalCVsParsed: 0, jobMatchRate: 0, jobRecommendations: 0 };

    const res = await authorizedFetch(`${BACKEND_URL}/dashboard/stats`);

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { totalCVsParsed: 0, jobMatchRate: 0, jobRecommendations: 0 };
    }

    setCachedData(cacheKey, data.data);
    return data.data;
  },

  async getRecentUploads(): Promise<CVFile[]> {
    const cacheKey = "recent-uploads";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const token = localStorage.getItem("accessToken");
    if (!token) return [];

    const res = await authorizedFetch(`${BACKEND_URL}/cv`);

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch CVs");
    }

    const rawCVs = Array.isArray(data.data) ? data.data : [];

    const formatted = rawCVs.map((cv: any) => ({
      id: cv.id,
      name: cv.originalName || cv.fileUrl?.split('/').pop() || "Untitled CV",
      size: cv.fileSize || 0,
      sizeFormatted: cv.fileSizeFormatted,
      uploadedAt: new Date(cv.createdAt),
      status: cv.status === "done" ? "done" : (cv.status === "pending" || cv.status === "processing" ? "parsing" : "error"),
      matchScore: cv.matchScore || 0,
      fileUrl: normalizeFileUrl(cv.fileUrl),
      hasEducations: cv.status === "done" && cv.hasEducations,
      hasExperiences: cv.status === "done" && cv.hasExperiences,
      domainCount: cv.domainCount || 0,
    }));

    setCachedData(cacheKey, formatted);
    return formatted;
  },

  async getCVMetadata(cvId: string): Promise<any> {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Authentication token not found");

    const res = await authorizedFetch(`${BACKEND_URL}/cv/${cvId}/metadata`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch CV metadata");
    }

    const metadata = data.data;
    if (metadata.fileUrl) {
      metadata.fileUrl = normalizeFileUrl(metadata.fileUrl);
    }
    return metadata;
  },

  async getCVDetailedAnalysis(cvId: string): Promise<any> {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Authentication token not found");

    const res = await authorizedFetch(`${BACKEND_URL}/cv/${cvId}/detailed-analysis`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch detailed analysis");
    }

    const analysis = data.data;
    if (analysis.metadata?.fileUrl) {
      analysis.metadata.fileUrl = normalizeFileUrl(analysis.metadata.fileUrl);
    }
    if (analysis.fileUrl) {
      analysis.fileUrl = normalizeFileUrl(analysis.fileUrl);
    }
    return analysis;
  },

  async deleteCV(cvId: string): Promise<any> {
    clearApiCache();
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Authentication token not found");

    const res = await authorizedFetch(`${BACKEND_URL}/cv/${cvId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete CV");
    }

    return data;
  },

  async deleteAllCVs(): Promise<any> {
    clearApiCache();
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Authentication token not found");

    const res = await authorizedFetch(`${BACKEND_URL}/cv/all`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete all CVs");
    }

    return data;
  },
};
