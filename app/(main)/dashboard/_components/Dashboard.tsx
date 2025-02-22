import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

interface DashboardProps {
  insights: {
    id: string;
    industry: string;
    salaryRanges: SalaryRange[]; // Replace with the actual structure
    growthRate: number;
    demandLevel: string;
    topSkills: string[];
    marketOutlook: string;
    keyTrends: string[];
    recommendedSkills: string[];
    lastUpdated: string;
    nextUpdate: string;
  };
}

interface SalaryRange {
  max: number;
  min: number;
  role: string;
  median: number;
  location: string;
}

const Dashboard: React.FC<DashboardProps> = ({ insights }) => {
  const salaryRanges = insights.salaryRanges.map(
    (salaryRange: SalaryRange, index) => ({
      name: salaryRange.role,
      min: salaryRange.min / 1000,
      max: salaryRange.max / 1000,
      median: salaryRange.median / 1000,
    })
  );

  const getDamandLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const marketOutlookInfo = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };

      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };

      default:
        return { icon: TrendingUp, color: "text-gray-500" };
    }
  };

  return <div>Dashboard</div>;
};

export default Dashboard;
