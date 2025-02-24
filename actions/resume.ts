"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = ai.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const saveResume = async (data: any) => {
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
    const resume = await prisma.resume.upsert({
      where: { userId: user.id },
      update: {
        content: data,
      },
      create: {
        userId: user.id,
        content: data,
      },
    });
    revalidatePath("/resume"); // refetch the resume page
    return resume;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save resume");
  }
};

export const getResume = async () => {
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
    const resume = await prisma.resume.findUnique({
      where: {
        userId: user.id,
      },
    });
    return resume;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get resume");
  }
};

export const improveWithAI = async ({
  promptText,
  type,
}: {
  promptText: any;
  type: any;
}) => {
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

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${promptText}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();
    return text;
  } catch (error) {
    console.error(error);
    throw new Error("Error processing the request");
  }
};
