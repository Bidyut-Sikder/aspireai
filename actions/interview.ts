"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = ai.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateQuiz = async () => {
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
    const prompt = `
  Generate 3 technical interview questions for a ${user.industry} professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
  
  Each question should be multiple choice with 4 options.
  
  Return the response in this JSON format only, no additional text:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const cleanText = response.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanText);

    return quiz.questions;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate quiz");
  }
};

export const saveQuestionResults = async (
  questions: any,
  anwsers: any,
  score: any
) => {
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

  const questionResults = questions.map((question: any, index: any) => ({
    question: question.question,
    answer: question.correctAnswer,
    userAnswer: anwsers[index],
    isCorrect: question.correctAnswer === anwsers[index],
    explanation: question.explanation,
  }));

  const worngAnswers = questionResults.filter((q: any) => !q.isCorrect);

  let improvementTip = <string | null>null;

  if (worngAnswers.length > 0) {
    const wrongQuestionsText = worngAnswers
      .map(
        (q: any) =>
          `Question: "${q.question}"\nCorrect Answer :"${q.answer}"\n user Answer :"${q.userAnswer}`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:
    
      ${wrongQuestionsText}
    
      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const result = await model.generateContent(improvementPrompt);

      const text = result.response.text().trim();
      improvementTip = text;
    } catch (error) {
      console.error(error);
      throw new Error("Error processing the request");
    }
  }

  try {
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error(error);
    throw new Error("Error processing the assessment request");
  }
};

export const getAssessments = async () => {
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
    const assessments = prisma.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy:{
        createdAt: 'asc'
      }
    });
    return assessments;
  } catch (error) {
    console.error(error);
    throw new Error("Error processing the getAssessment request");
  }
};
