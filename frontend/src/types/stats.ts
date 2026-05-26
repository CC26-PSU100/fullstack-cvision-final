export interface DashboardStats {
  totalCVsParsed: number;
  jobMatchRate: number;
  jobRecommendations: number;
  cvsParsedDescription?: string;
  jobMatchRateDescription?: string;
  jobRecommendationsDescription?: string;
}