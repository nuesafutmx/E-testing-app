"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuestionEditor from "@/components/question-editor"
import AdminHeader from "@/components/admin-header"
import { addQuiz } from "@/actions/addQuiz"
import { v4 as uuidv4 } from 'uuid';


export default function CreateExam() {
  const [examTitle, setExamTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("60")
  const [passingScore, setPassingScore] = useState("70")
  const [isPublished, setIsPublished] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!examTitle || !subject || !duration) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      console.log({
        examTitle,
        subject,
        examId: uuidv4(),
        description,
        duration,
        passingScore,
        isPublished,
        questions,
      })
      setIsSubmitting(false)
      return
    }

    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question to the exam",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Prepare exam data with questions in JSON format
    const examData = {
      title: examTitle,
      examId: uuidv4(),
      subject,
      description,
      duration: Number.parseInt(duration),
      passingScore: Number.parseInt(passingScore),
      isPublished,
      questions: JSON.stringify(questions),
    }
    console.log('examData :>> ', examData);

    // Simulate API call to save exam
    try {
      // In a real app, you would send examData to your backend
      await addQuiz(examData)
      console.log("Submitting exam data:", examData)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Exam created",
        description: "Your exam has been created successfully",
      })

      router.push("/admin/exams")
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the exam",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Exam</h1>
          <p className="text-muted-foreground">Create a new exam and add questions</p>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Exam Details</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setActiveTab("questions")
                }}
              >
                <CardHeader>
                  <CardTitle>Exam Details</CardTitle>
                  <CardDescription>Set the basic information for your exam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title</Label>
                    <Input
                      id="title"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      placeholder="e.g. Midterm Exam"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Mathematics"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide a brief description of the exam"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passing-score">Passing Score (%)</Label>
                      <Input
                        id="passing-score"
                        type="number"
                        min="0"
                        max="100"
                        value={passingScore}
                        onChange={(e) => setPassingScore(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.push("/admin/exams")}>
                    Cancel
                  </Button>
                  <Button type="submit">Continue to Questions</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <QuestionEditor
              onBack={() => setActiveTab("details")}
              onNext={() => setActiveTab("settings")}
              questions={questions}
              setQuestions={setQuestions}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
                <CardDescription>Configure additional settings for your exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="randomize">Randomize Questions</Label>
                      <p className="text-sm text-muted-foreground">
                        Present questions in a random order for each student
                      </p>
                    </div>
                    <Switch id="randomize" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-results">Show Results Immediately</Label>
                      <p className="text-sm text-muted-foreground">
                        Show students their results as soon as they complete the exam
                      </p>
                    </div>
                    <Switch id="show-results" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="time-limit">Enforce Time Limit</Label>
                      <p className="text-sm text-muted-foreground">Automatically submit when time expires</p>
                    </div>
                    <Switch id="time-limit" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="published">Publish Exam</Label>
                      <p className="text-sm text-muted-foreground">Make the exam available for students to take</p>
                    </div>
                    <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("questions")}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab("preview")}>Preview Exam</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Exam Preview</CardTitle>
                <CardDescription>Review your exam before publishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h2 className="text-xl font-bold">{examTitle || "Exam Title"}</h2>
                  <p className="text-muted-foreground">{subject || "Subject"}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Duration: {duration} minutes
                    </div>
                    <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Passing: {passingScore}%
                    </div>
                    <div className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      Questions: {questions.length}
                    </div>
                  </div>
                  {description && (
                    <div className="mt-4">
                      <p className="text-sm">{description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Questions</h3>

                  {questions.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
                      No questions added yet. Go back to the Questions tab to add some.
                    </div>
                  ) : (
                    questions.slice(0, 3).map((question, index) => (
                      <div key={question.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex justify-between">
                          <span className="font-medium">Question {index + 1}</span>
                          <span className="text-sm text-muted-foreground">{question.type}</span>
                        </div>
                        <p className="mb-4">{question.text}</p>
                        {(question.type === "multiple-choice" || question.type === "true-false") && (
                            <div className="space-y-2">
                            {question.options.map((option: { id: string; text: string; isCorrect: boolean }) => (
                              <div
                              key={option.id}
                              className={`flex items-center rounded-md border p-2 ${
                                option.isCorrect ? "bg-green-50" : ""
                              }`}
                              >
                              <div
                                className={`mr-2 h-4 w-4 rounded-full ${
                                option.isCorrect ? "bg-green-500" : "border border-primary"
                                }`}
                              ></div>
                              <span>{option.text}</span>
                              </div>
                            ))}
                            </div>
                        )}
                        {question.type === "short-answer" && question.correctAnswer && (
                          <div className="mt-2 rounded-md bg-blue-50 p-2">
                            <span className="text-sm font-medium">Correct Answer: </span>
                            <span>{question.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {questions.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground">
                      Showing 3 of {questions.length} questions. All questions will be included in the exam.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("settings")}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting || questions.length === 0}>
                  {isSubmitting ? "Creating..." : "Create Exam"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

