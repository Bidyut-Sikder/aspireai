import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

const dashboard = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  //if we do not have any industry selected ,we connot show insights so
  //we redirect to onboarding page where user can insert industry
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return <div>dashboard</div>;
};

export default dashboard;
