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

export const contactShema = z.object({
  email: z.string().email("Please enter a valid email"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  x: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required."),
    organization: z.string().min(1, "organization is required."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().optional(),
    description: z.string().min(1, " description is required."),
    current: z.boolean().default(false), //this is not optional field
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Enddate is required. unless this is your current position.",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({
  contactInfo: contactShema,
  summary: z.string().min(1, "Professional summary is required."),
  skills: z.string().min(1, "Skills are required."),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
});
