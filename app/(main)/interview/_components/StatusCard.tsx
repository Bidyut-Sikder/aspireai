import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy } from "lucide-react";
import React from "react";

interface StatusCardProps {
  assessments: any;
}

const StatusCard: React.FC<StatusCardProps> = ({ assessments }) => {
  const getAvarageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum: any, assessment: any) => sum + assessment.quizScore,
      0
    );

    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };
  const getTotalNumberOfQuestions = () => {
    if (!assessments?.length) return null;

    return assessments.reduce(
      (sum: number, assesment: any) => sum + assesment.questions.length,
      0
    );
  };

  console.log(getTotalNumberOfQuestions());
  return (
    <div className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex items-center flex-row justify-between spacey-0 pb-2">
          <CardTitle className="text-sm font-medium">Avarage Score</CardTitle>
          <Trophy className={`h-4 w-4 text-muted-foreground `} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> {getAvarageScore()}%</div>
          <p className="text-xs text-muted-foreground">
            Accross all assessments.
          </p>
        </CardContent>
      </Card>


      <Card>
        <CardHeader className="flex items-center flex-row justify-between spacey-0 pb-2">
          <CardTitle className="text-sm font-medium">Questions Practiced.</CardTitle>
          <Brain className={`h-4 w-4 text-muted-foreground `} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> {getTotalNumberOfQuestions()}</div>
          <p className="text-xs text-muted-foreground">
            Total questions.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center flex-row justify-between spacey-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
          <Trophy className={`h-4 w-4 text-muted-foreground `} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> {getLatestAssessment()?.quizScore.toFixed(1)||0}</div>
          <p className="text-xs text-muted-foreground">
            Most recent quiz.
          </p>
        </CardContent>
      </Card>


    </div>
  );
};

export default StatusCard;
