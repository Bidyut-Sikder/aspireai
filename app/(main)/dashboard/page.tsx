import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import Dashboard from "./_components/Dashboard";

const dashboard = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  //if we do not have any industry selected ,we connot show insights so
  //we redirect to onboarding page where user can insert industry
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const insights: any = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <Dashboard insights={insights} />
    </div>
  );
};

export default dashboard;
