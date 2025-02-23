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
      <div>
        <StatusCard assessments={assessments} />
        <PerformanceChart />
        <QuizList />
      </div>
    </div>
  );
};

export default page;
