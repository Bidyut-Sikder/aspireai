import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import React from "react";

interface QuizResultProps {
  result: any;
  onStartNew: () => void;
  hideStartNew: boolean;
}

const QuizResult: React.FC<QuizResultProps> = ({
  result,
  hideStartNew = false,
  onStartNew,
}) => {
  if (!result) return null;
  // console.log(result);
  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Result : {result.quizScore.toFixed(1)}
      </h1>
      <CardContent>
        {/* <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}</h3>
        </div> */}

        {result.improvementTip && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement Tip</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="mt-1 font-medium">Question Review</h3>
          {result.questions.map((question: any, i: number) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p>{question.question}</p>
                {question.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your answer: {question.userAnswer}</p>
                {!question.isCorrect && (
                  <p>Correct answer: {question.answer}</p>
                )}
              </div>

              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onStartNew}>Start New Quiz</Button>
        </CardFooter>
      )}
    </div>
  );
};

export default QuizResult;
