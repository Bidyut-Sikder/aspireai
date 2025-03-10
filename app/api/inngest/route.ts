import { inngest } from "@/lib/inngest/client";
import { geminiAPITesting, generateIndustryInsights, helloWorld } from "@/lib/inngest/fuctions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    generateIndustryInsights,
    // geminiAPITesting
    /* your functions will be passed here later! */
  ],
});
