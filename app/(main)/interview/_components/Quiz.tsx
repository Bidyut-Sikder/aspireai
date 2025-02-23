"use client";
import { generateQuiz, saveQuestionResults } from "@/actions/interview";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QuizResult from "./QuizResult";

const Quiz = () => {
  const [currentQuestionNo, setCurrentQuestionNo] = useState<number>(0);
  const [answers, setAnswers] = useState<(string | undefined)[]>([]);
  const [showExplanation, setExplanation] = useState(false);

  const { loading, data, fn } = useFetch(generateQuiz);
  const {
    setData: setSavedData,
    loading: savingLoading,
    data: savedData,
    fn: savingFunction,
  } = useFetch(saveQuestionResults);
  // useEffect(() => {
  //   if (data) {
  //     setAnswers(new Array(data.length).fill(undefined));
  //   }
  // }, [data]);
  const handleAnswer = (userAnswer: any) => {
    // const newAnswers = [...answers];

    // newAnswers[currentQuestionNo] = userAnswer;
    // setAnswers(newAnswers);
    let Answers = [...answers];
    Answers.push(userAnswer);
    setAnswers(Answers);
  };

  if (loading) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }
  const startNewQuiz = () => {
    setCurrentQuestionNo(0);
    setAnswers([]);
    setExplanation(false);
    setSavedData(null);
    fn();
  };

  if (savedData) {
    return (
      <div className="mx-2">
        <QuizResult
          result={savedData}
          onStartNew={startNewQuiz}
          hideStartNew={false}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Test your knowledge.</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Thsi quiz contains 10 questions specific to your industry and
            skills.Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={fn} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }
  const nextHandler = () => {
    if (currentQuestionNo < data.length - 1) {
      setCurrentQuestionNo(currentQuestionNo + 1);
      setExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      // console.log(score);

      await savingFunction(data, answers, score);
      toast.success(" Quiz completed successfully");
    } catch (error) {
      toast.error(" Error submitting quiz");
    }
  };
  const calculateScore = () => {
    let correct = 0;
    // console.log(answers)
    answers.forEach((answer, i) => {
      if (answer === data[i].correctAnswer) {
        correct++;
      }
    });
    return (correct / data.length) * 100;
  };
  const question = data[currentQuestionNo];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question: {currentQuestionNo + 1} of {data.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-2 font-medium text-muted-foreground">
          {question.question}
        </p>
        <RadioGroup
          className="space-y-2"
          onValueChange={handleAnswer}
          //   value={'answers[currentQuestionNo]'}
          //   value={answers[currentQuestionNo]}
        >
          {question.options.map((option: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${option}`} />
              <Label htmlFor={`option-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium ">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => setExplanation(true)}
          variant={"outline"}
          disabled={!answers[currentQuestionNo]}
        >
          Show Explanation
        </Button>
        <Button
          onClick={nextHandler}
          className="ml-auto"
          disabled={!answers[currentQuestionNo] || savingLoading}
        >
          {savingLoading && <Loader2 className="h-4 mr-2 w-4 animate-spin" />}
          {currentQuestionNo < data.length - 1 ? "Next" : "Finish"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
