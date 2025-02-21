"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const userUpdate = async (data: any) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        //find the insights
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });
        //does not find create the insight
        if (!industryInsight) {
          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              salaryRanges: [],
              growthRate: 0,
              demandLevel: "MEDIUM",
              topSkills: [],
              marketOutlook: "NEUTRAL",
              keyTrends: [],
              recommendedSkills: [],
              nextUpdate: new Date(Date.now()),
            },
          });
        }
        //update the user
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.exprience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );

    return result.updatedUser;
    // return result.user;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload profile.");
  }
};

export const getUserOnboardingStatus = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });
    // console.log(user)
    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    throw new Error(" Failed to get user onboarding status.");
  }
};
