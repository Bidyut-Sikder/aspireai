"use client";

import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  median: number;
  role: string;
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
    console.log(outlook.toLowerCase());
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

  const OutLookIcon = marketOutlookInfo(insights.marketOutlook).icon;
  const outLookColor = marketOutlookInfo(insights.marketOutlook).color;
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/mm/yy");

  const nextUpdateTime = formatDistanceToNow(new Date(insights.nextUpdate), {
    addSuffix: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last Updated: {lastUpdatedDate}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center flex-row justify-between spacey-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutLookIcon className={`h-4 w-4  ${outLookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">Next Update</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center flex-row justify-between spacey-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <OutLookIcon className={`h-4 w-4  ${outLookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>

            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center flex-row justify-between spacey-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <BriefcaseIcon className={`h-4 w-4  text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDamandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center flex-row justify-between spacey-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4  text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} className="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Salary Ranges By Role
          </CardTitle>
          <CardDescription>
            Displaying minimum,median and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar
                  dataKey="min"
                  fill="#8884d8"
                  activeBar={
                    <Rectangle
                      fill="pink"
                      stroke="blue"
                      name="Min Salary (K)"
                    />
                  }
                />
                <Bar
                  dataKey="median"
                  fill="#64748b"
                  activeBar={
                    <Rectangle
                      fill="#12768b"
                      stroke="blue"
                      name="Median Salary (K)"
                    />
                  }
                />
                <Bar
                  dataKey="max"
                  fill="#82ca9d"
                  activeBar={
                    <Rectangle
                      fill="gold"
                      stroke="purple"
                      name="Max Salary (K)"
                    />
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Key Industry Trends
            </CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {insights.keyTrends.map((trend, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Recommended Skills
            </CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill, i) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
];
