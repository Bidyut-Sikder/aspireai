"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onBoardingSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { userUpdate } from "@/actions/user";
import { toast } from "sonner";
type IndustryProps = {
  id: string;
  name: string;
  subIndustries: string[];
};

type Props = {
  industries: IndustryProps[];
};

const OnboardingForm = ({ industries }: Props) => {
  const [selectedIndustry, setSelectedIndustry] =
    useState<IndustryProps | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,

    formState: { errors },
  } = useForm({ resolver: zodResolver(onBoardingSchema) });
  const { loading, fn, data } = useFetch(userUpdate);

  const submitHandler = async (data: any) => {
    try {
      const formattedIndustry = `${data.industry}-${data.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;
      await fn({ ...data, industry: formattedIndustry });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };
  useEffect(() => {
    if (data?.success && !loading) {
      setTimeout(() => {
        toast.success("Profile completed successfully!");
        router.push("/dashboard");
        router.refresh();
      }, 0);
    }
  }, [data, loading]);
  const watchIndustry = watch("industry");
  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
            <div className=" space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value, { shouldValidate: true }); // Ensure validation updates
                  setSelectedIndustry(
                    industries.find((industry) => industry.id === value) || null
                  );
                  setValue("subIndustry", "", { shouldValidate: true }); // Reset subIndustry
                  //   setValue("industry", value);

                  //   setSelectedIndustry(
                  //     industries.filter((industry) => industry.id === value)[0] ||
                  //       null
                  //     // industries.find((industry) => industry.id === value) || null
                  //   );
                  //   setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry." />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                  {/* {JSON.stringify(errors.industry)} */}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  onValueChange={(value) => {
                    // setValue("subIndustry", value);
                    setValue("subIndustry", value, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select a subIndustry." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.subIndustries.map((subIndustry) => (
                      <SelectItem key={subIndustry} value={subIndustry}>
                        {subIndustry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                    {/* {JSON.stringify(errors.subIndustry)} */}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                {...register("experience")}
                id="experience"
                type="number"
                min={0}
                max={50}
                placeholder="Enter years of experience"
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                {...register("skills")}
                id="skills"
                placeholder="e.g., python, javascript etc.."
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas.
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Professional Bio</Label>
              <Textarea
                {...register("bio")}
                id="bio"
                className="h-32 resize-none"
                placeholder="Tell us about yourself"
              />

              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending.." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
