"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Clock, ChevronLeft, ChevronRight, CheckCircle, Calculator } from "lucide-react"
import ScientificCalculator from "@/components/scientific-calculator"
import { getQuizByExamid } from "@/actions/getquizByExamId"
import { addResult } from "@/actions/addResult"

export default function ExamPage() {

  interface Option {
    id: string;
    text: string;
    isCorrect: boolean
    correctOption?: string;
  }
  
  interface Question {
    id: string;
    text: string;
    type: string;
    options?: Option[];
    points: number;
    correctAnswer?: string;
  }
  
  interface Exam {
    id: string;
    title: string;
    duration: number;
    questions: Question[];
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const pin = searchParams.get("pin")
  const { toast } = useToast()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [pins, setPins] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0) // in seconds
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const currentQuestion = exam?.questions ? exam.questions[currentQuestionIndex] : null
  const progress = exam ? ((currentQuestionIndex + 1) / exam.questions.length) * 100 : 0
  const [score, setScore] = useState(0)
  const [name, setName] = useState("")
  
  useEffect(() => {
    const fetchExam = async (examId: string) => {
      try {
        const examsData = await getQuizByExamid(examId);
        if (examsData.length > 0) {
          const examData = examsData[0];
          setExam({
            id: examData._id,
            title: examData.subject,
            duration: examData.duration,
            questions: examData.questions,
          });
          setTimeLeft(examData.duration * 60);
        }
      } catch (error) {
        console.log("Error fetching exam:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const examId = searchParams.get("examId")
    if (examId) {
      fetchExam(examId)
    }
    console.log('examId :>> ', examId);
  }, [searchParams])

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Timer effect
  useEffect(() => {
    if (examSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examSubmitted, timeLeft])

  // Check if pin is valid
  useEffect(() => {
    if (!pin) {
      toast({
        title: "No access pin",
        description: "Please enter a valid access pin to take the exam",
        variant: "destructive",
      })
      router.push("/student/login")
    }
  }, [pin, router, toast])

  // Submit exam if the tab is minimized or hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentQuestion) {
        handleSubmitExam()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [currentQuestion])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  const goToNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  
  const handleSubmitExam = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before submitting the exam",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(answers).length === 0) {
      toast({
        title: "No answers",
        description: "Please answer at least one question before submitting the exam",
        variant: "destructive",
      });
      return;
    }

    setExamSubmitted(true);
  
    let score = 0;
    let totalPoints = 0;
  
    exam?.questions?.forEach((question) => {
      totalPoints += question.points;
  
      if (question.type === "essay") return;
  
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
  
      if (["multiple-choice", "true-false"].includes(question.type)) {
        const selectedOption = question.options?.find(option => option.id === userAnswer);
        if (selectedOption?.isCorrect) {
          score += question.points;
        }
      } else if (question.type === "short-answer") {
        if (
          question.correctAnswer &&
          userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
        ) {
          score += question.points;
        }
      }
    });

    console.log('score :>> ', score);
    console.log('Name :>> ', name);

    const percentage = Math.round((score / totalPoints) * 100);

    const results = async () => {
      try {
        await addResult({ name, score, pin, title: exam?.title || "" });
      } catch (error) {
        console.log("Error submitting results:", error);
      }
    };
  
    toast({
      title: "Exam submitted",
      description: `Your score: ${score}/${totalPoints} (${percentage}%)`,
    });
  
    setTimeout(() => {
      router.push(`/student/results?score=${score}&total=${totalPoints}`);
    }, 3000);
  };
  

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-950 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Loading Exam...</CardTitle>
            <CardDescription>Please wait while we fetch the exam details.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (examSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-950 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <CardTitle className="text-2xl font-bold">Exam Submitted</CardTitle>
            <CardDescription>Thank you for completing the exam</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Your answers have been recorded.</p>
            <p className="text-sm text-muted-foreground">You will be redirected to the results page shortly.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 dark:from-gray-900 dark:to-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{exam?.title}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 rounded-full"
                onClick={toggleCalculator}
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Calculator</span>
              </Button>
              <div className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-red-100 to-pink-100 px-3 py-1 text-red-800 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300">
                <Clock className="mr-1 h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {exam?.questions.length}
            </p>
            <p className="text-sm text-muted-foreground">
              {exam?.questions[currentQuestionIndex].points}{" "}
              {exam?.questions[currentQuestionIndex].points === 1 ? "point" : "points"}
            </p>
          </div>
          <Progress value={progress} className="mt-2" />
        </header>

        {currentQuestion && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className={`md:col-span-${showCalculator ? "2" : "3"}`}>
              <Card className="mb-6 border-blue-100 shadow-md transition-all duration-300 hover:shadow-lg dark:border-blue-900/30">
                <CardHeader>
                  <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentQuestion.type === "multiple-choice" && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value: string) => handleAnswerChange(currentQuestion.id, value)}
                      className="space-y-3"
                    >
                      {currentQuestion.options && currentQuestion.options.map((option: { id: string; text: string }) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQuestion.type === "true-false" && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value: string) => handleAnswerChange(currentQuestion.id, value)}
                      className="space-y-3"
                    >
                      {currentQuestion.options && currentQuestion.options.map((option: { id: string; text: string }) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQuestion.type === "short-answer" && (
                    <div className="space-y-2">
                      <Label htmlFor="short-answer">Your Answer</Label>
                      <Input
                        id="short-answer"
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Type your answer here"
                      />
                    </div>
                  )}

                  {currentQuestion.type === "essay" && (
                    <div className="space-y-2">
                      <Label htmlFor="essay-answer">Your Answer</Label>
                      <Textarea
                        id="essay-answer"
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Write your essay answer here"
                        rows={8}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {exam && currentQuestionIndex < exam.questions.length - 1 ? (
                    <Button onClick={goToNextQuestion}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => setConfirmSubmit(true)} variant="default">
                      Submit Exam
                    </Button>
                  )}
                </CardFooter>
              </Card>

              <div className="flex flex-wrap gap-2">
                {exam?.questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={
                      index === currentQuestionIndex
                        ? "default"
                        : answers[exam.questions[index].id]
                          ? "outline"
                          : "ghost"
                    }
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>

            {showCalculator && (
              <div className="md:col-span-1">
                <ScientificCalculator />
              </div>
            )}
          </div>
        )}
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                Confirm Submission
              </CardTitle>
              <CardDescription>Are you sure you want to submit your exam?</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have answered {Object.keys(answers).length} out of {exam?.questions.length} questions.
                {exam && Object.keys(answers).length < exam.questions.length && (
                  <span className="mt-2 block text-yellow-600 dark:text-yellow-400">
                    Warning: You have unanswered questions.
                  </span>
                )}
              </p>
            </CardContent>
            <div className="space-y-8 m-6">
              <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-center font-mono text-lg uppercase"
              maxLength={60}
              required
              />
              <p className="text-center text-sm text-muted-foreground mb-6">Your pin was provided by your instructor</p>
            </div>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setConfirmSubmit(false)}>
                Continue Exam
              </Button>
              <Button onClick={handleSubmitExam}>Submit Exam</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}


