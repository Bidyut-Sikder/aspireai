"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = ai.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateIndustryInsight = async (industry: string) => {
  const prompt = `
  Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
  {
    "salaryRanges": [
      { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
    ],
    "growthRate": number,
    "demandLevel": "HIGH" | "MEDIUM" | "LOW",
    "topSkills": ["skill1", "skill2"],
    "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
    "keyTrends": ["trend1", "trend2"],
    "recommendedSkills": ["skill1", "skill2"]
  }
  
  IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
  Include at least 5 common roles for salary ranges.
  Growth rate should be a percentage.
  Include at least 5 skills and trends.
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  const cleanText = response.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanText);
};

export const getIndustryInsights = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      industryInsight: true,
      industry: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  // console.log(user)

  if (!user.industryInsight) {
    if (user.industry) {
      const insights = await generateIndustryInsight(user.industry);
      const industryInsight = await prisma.industryInsight.create({
        data: {
          industry: user.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      return industryInsight;
    } else {
      throw new Error("User industry is null");
    }
  }

  return user.industryInsight;
};
