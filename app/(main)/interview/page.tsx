import { getAssessments } from "@/actions/interview";
import React from "react";
import StatusCard from "./_components/StatusCard";
import PerformanceChart from "./_components/PerformanceChart";
import QuizList from "./_components/QuizList";

const page = async () => {
  const assessments = await getAssessments();

  return (
    <div>
      <div>
        <h1 className="text-6xl font-bold gradient-title mb-5">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatusCard assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments}/>
      </div>
    </div>
  );
};

export default page;
