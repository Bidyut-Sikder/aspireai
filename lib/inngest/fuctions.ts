import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../prisma";
import { inngest } from "./client";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "10s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, //this will run midnight every sunday

  async ({ step, event }) => {
    const industries = await step.run("Fetch Industries", async () => {
      return await prisma.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
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
      const res = await step.ai.wrap(
        "create-insights",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const textPart = res.response.candidates?.[0]?.content?.parts?.[0];

      const text = textPart && "text" in textPart ? textPart.text : "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      // console.log(cleanedText)
      const insights = JSON.parse(cleanedText);
      // console.log(insights);
      await step.run(`update ${industry} insights`, async () => {
        await prisma.industryInsight.update({
          where: { industry: industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);

export const geminiAPITesting = inngest.createFunction(
  { id: "gemint-api-testing" },
  { event: "testing/gemeniapi" },
  async ({ event, step }) => {
    const prompt = "how do you function";
    const res = await step.ai.wrap(
      "create-insights",
      async (p) => {
        return await model.generateContent(p);
      },
      prompt
    );
    console.log(JSON.stringify(res.response.usageMetadata?.promptTokenCount));
    console.log(
      JSON.stringify(res.response.usageMetadata?.candidatesTokenCount)
    );
    return { message: "success", res };
  }
);
