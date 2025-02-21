import React from "react";
import OnboardingForm from "./_components/OnboardingForm";
import { industries } from "@/data/industries";
import { getUserOnboardingStatus } from "@/actions/user";

const page = async () => {
  const {isOnboarded} = await getUserOnboardingStatus();


  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default page;
