"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/schema";
import { saveResume } from "@/actions/resume";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./EntryForm";

interface ResumeBuilderProps {
  initialContent: any; // Replace 'any' with the appropriate type if known
}

const ResumeBuilder = ({ initialContent }: ResumeBuilderProps) => {
  const [active, setActive] = useState<string>("edit");
  const {
    register,
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
    loading: isSaving,
    fn: saveResumeFunction,
    data: savedData,
    error: savingError,
  } = useFetch(saveResume);

  //   const formValues = watch();

  useEffect(() => {
    if (initialContent) {
      setActive("preview");
    }
  }, [initialContent]);

  const submitHandler = async (data: any) => {
    console.log(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 ">
        <h1 className="font-bold gradient-title text-5xl">Resume Builder</h1>

        <div className="space-x-2">
          <Button variant="destructive">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button>
            <Save className="h-4 w-4" />
            Download PDF
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
            <form className="space-y-8" onSubmit={handleSubmit(submitHandler)}>
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
                  <Label className="text-sm font-medium" htmlFor="experience">
                    Education
                  </Label>
                  <Controller
                    // controller takes the control of shadcn <Textarea /> component
                    name="experience"
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
          <TabsContent value="preview">Change your preview here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeBuilder;
