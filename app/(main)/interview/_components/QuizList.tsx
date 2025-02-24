"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import QuizResult from "./QuizResult";
interface QuizListProps {
  assessments: any; // Replace 'any' with the appropriate type if known
}
const QuizList: React.FC<QuizListProps> = ({ assessments }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const router = useRouter();

  console.log(selectedQuiz);
  return (
    <div>
      <Card >
        <CardHeader className="flex justify-between items-center flex-row ">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">
              Recent Quizes
            </CardTitle>
            <CardDescription>
              Review your past quiz performance.
            </CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div>
            {assessments.slice().reverse().map((assesment: any, i: number) => (
              <Card 
                key={i}
                className="mb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedQuiz(assesment)}
              >
                <CardHeader>
                  <CardTitle>Assessment No: {assessments.length-i}</CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <p>Score: {assesment.quizScore.toFixed(2)}%</p>
                    <p>{format(assesment.createdAt, " MMM dd, hh:mm a")}</p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tip: {assesment.improvementTip}
                  </p>
                </CardContent>

              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* dialog  */}
      {selectedQuiz && (
        <Dialog
          open={!!selectedQuiz}
          onOpenChange={() => setSelectedQuiz(null)}
        >
          <DialogContent className=" max-w-3xl overflow-y-auto max-h-[90vh] ">
            <DialogHeader>
              <DialogTitle></DialogTitle>

            </DialogHeader>
            <QuizResult 
              result={selectedQuiz}
              onStartNew={() => router.push("/interview/mock")}
              hideStartNew={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default QuizList;
