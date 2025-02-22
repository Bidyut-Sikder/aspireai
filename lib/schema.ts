import { z } from "zod";

export const onBoardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  subIndustry: z
    .string({
      required_error: "Please select a specialization.",
    })
    .nonempty("Please select a specialization."),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Experience must be a valid number.",
    })
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, { message: "Experience must be at least 0 years." })
        .max(50, { message: "Experience cannot exceed 50 years." })
    ),
  skills: z.string().transform((val) =>
    val.trim()
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : []
  ),
});
