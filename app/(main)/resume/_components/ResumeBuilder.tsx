"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit, Loader2, Monitor, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/schema";
import { saveResume } from "@/actions/resume";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./EntryForm";
import { entriesToMarkdown } from "@/lib/helper";
import { useUser } from "@clerk/nextjs";
// @ts-ignore
const html2pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

import { toast } from "sonner";

interface ResumeBuilderProps {
  initialContent: any; // Replace 'any' with the appropriate type if known
}

const ResumeBuilder = ({ initialContent }: ResumeBuilderProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const [active, setActive] = useState<string>("edit");
  const [resumeMode, setResumeMode] = useState<string>("preview");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isResumeSaving,
    fn: saveResumeFunction,
    data: savedData,
    error: savingError,
  } = useFetch(saveResume);

  const formValues = watch();

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    try {
      setIsPdfLoading(true);
      const element = pdfRef.current;
      if (element) {
        element.classList.remove("hidden");
        const opt = {
          margin: 1,
          filename: "div-content.pdf",
          image: { type: "png", quality: 1 },
          html2canvas: { scale: 3 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        // Generate the PDF
        html2pdf(element, opt);
        // Add the "hidden" class again after the PDF is generated
        setTimeout(() => {
          element.classList.add("hidden");
        }, 100);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfLoading(false);
    }
  };
  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`Email: ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`Phone: ${contactInfo.mobile}`);
    if (contactInfo.linkedin) parts.push(`[Linkedin](${contactInfo.linkedin})`);
    if (contactInfo.x) parts.push(`[X](${contactInfo.x})`);

    return parts.length > 0 && user
      ? `## <div align="center">${
          user.fullName
        } <div/>\n\n <div align="center">\n\n${parts.join(" | ")}\n\n <div/>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary} `,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  useEffect(() => {
    if (initialContent) {
      setActive("preview");
    }
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (active === "edit") {
      const newContent = getCombinedContent();

      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, active]);
  useEffect(() => {
    if (savedData) {
      toast.success("Resume has been saved successfully");
    }
    if (savingError) {
      toast.error("Error saving resume");
    }
  }, [savedData, savingError]);
  const submitHandler = async (data: any) => {
    console.log(data);
  };
  const savePDFHandler = async () => {
    try {
      await saveResumeFunction(previewContent);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 ">
        <h1 className="font-bold gradient-title text-5xl">Resume Builder</h1>

        <div className="space-x-2">
          <Button variant="destructive" onClick={savePDFHandler}>
            {isResumeSaving ? (
              <>
                <Loader2 className="h-4 w-4" />
                Saving..
              </>
            ) : (
              <>
                {" "}
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isPdfLoading}>
            {isPdfLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin " />
                Generating PDF...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div>
        <Tabs value={active} onValueChange={setActive} className="f">
          <TabsList>
            <TabsTrigger value="edit">Form</TabsTrigger>
            <TabsTrigger value="preview">Markdown</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <form className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Contact Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2 ">
                    <Label className="text-sm font-medium" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      {...register("contactInfo.email")}
                      type="email"
                      placeholder="youremail@gmail."
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-red-500">
                        {errors.contactInfo.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 ">
                    <Label className="text-sm font-medium" htmlFor="mobile">
                      Mobile
                    </Label>
                    <Input
                      {...register("contactInfo.mobile")}
                      type="text"
                      placeholder="017*******"
                    />
                    {errors.contactInfo?.mobile && (
                      <p className="text-red-500">
                        {errors.contactInfo.mobile.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 ">
                    <Label className="text-sm font-medium" htmlFor="linkedin">
                      Linkedin
                    </Label>
                    <Input
                      {...register("contactInfo.linkedin")}
                      type="text"
                      placeholder="profie url.."
                    />
                    {errors.contactInfo?.linkedin && (
                      <p className="text-red-500">
                        {errors.contactInfo.linkedin.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 ">
                    <Label className="text-sm font-medium" htmlFor="x">
                      X.com
                    </Label>
                    <Input
                      {...register("contactInfo.x")}
                      type="url"
                      placeholder="url."
                    />
                    {errors.contactInfo?.x && (
                      <p className="text-red-500">
                        {errors.contactInfo.x.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 ">
                  <Label className="text-sm font-medium" htmlFor="x">
                    Professions Summary
                  </Label>
                  <Controller
                    // controller takes the control of shadcn <Textarea /> component
                    name="summary"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Textarea
                          {...field}
                          rows={4}
                          cols={50}
                          placeholder="write a short summary about yourself"
                        />
                      );
                    }}
                  />
                  {errors.summary && (
                    <p className="text-red-500">{errors.summary.message}</p>
                  )}
                </div>

                {/* skills */}
                <div className="space-y-2 ">
                  <Label className="text-sm font-medium" htmlFor="skills">
                    Professions Skills
                  </Label>
                  <Controller
                    // controller takes the control of shadcn <Textarea /> component
                    name="skills"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Textarea
                          {...field}
                          rows={4}
                          cols={50}
                          placeholder="write your skills"
                        />
                      );
                    }}
                  />
                  {errors.skills && (
                    <p className="text-red-500">{errors.skills.message}</p>
                  )}
                </div>

                {/* experience */}
                <div className="space-y-2 ">
                  <Label className="text-sm font-medium" htmlFor="experience">
                    Experience
                  </Label>
                  <Controller
                    // controller takes the control of shadcn <Textarea /> component
                    name="experience"
                    control={control}
                    render={({ field }) => {
                      return (
                        <EntryForm
                          type="Experience"
                          entries={field.value}
                          onChange={field.onChange}
                        />
                      );
                    }}
                  />
                  {errors.experience && (
                    <p className="text-red-500">{errors.experience.message}</p>
                  )}
                </div>
                {/* Educations */}
                <div className="space-y-2 ">
                  <Label className="text-sm font-medium" htmlFor="education">
                    Education
                  </Label>
                  <Controller
                    // controller takes the control of shadcn <Textarea /> component
                    name="education"
                    control={control}
                    render={({ field }) => {
                      return (
                        <EntryForm
                          type="Education"
                          entries={field.value}
                          onChange={field.onChange}
                        />
                      );
                    }}
                  />
                  {errors.experience && (
                    <p className="text-red-500">{errors.experience.message}</p>
                  )}
                </div>
                {/* Projects */}
                <div className="space-y-2 ">
                  <Label className="text-sm font-medium" htmlFor="projects">
                    Projects
                  </Label>
                  <Controller
                    // controller takes the control of shadcn <Textarea /> component
                    name="projects"
                    control={control}
                    render={({ field }) => {
                      return (
                        <EntryForm
                          type="Projects"
                          entries={field.value}
                          onChange={field.onChange}
                        />
                      );
                    }}
                  />
                  {errors.projects && (
                    <p className="text-red-500">{errors.projects.message}</p>
                  )}
                </div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="preview">
            <Button
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
              variant={"link"}
              type="button"
              className="mb-2"
            >
              {resumeMode === "preview" ? (
                <>
                  {" "}
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  {" "}
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
            {resumeMode !== "preview" && (
              <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  You will lose edited markdown if you switch to preview mode.
                </span>
              </div>
            )}

            <div className="border rounded-lg">
              <MDEditor
                value={previewContent}
                onChange={setPreviewContent}
                height={800}
                preview={resumeMode as "edit" | "preview"}
              />
            </div>

            <div className="hidden" ref={pdfRef} id="resume_pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeBuilder;
