
import { getResume } from "@/actions/resume";
import React from "react";
import ResumeBuilder from "./_components/ResumeBuilder";

const resume = async () => {
  const resume = await getResume();
  console.log(resume);

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
};

export default resume;
