"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash2, Image, Check, MoveUp, MoveDown, Edit } from "lucide-react"

interface QuestionEditorProps {
  onBack: () => void
  onNext: () => void
  questions: Question[]
  setQuestions: (questions: Question[]) => void
}

type QuestionType = "multiple-choice" | "true-false" | "short-answer" | "essay"

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  type: QuestionType
  text: string
  points: number
  options: Option[]
  correctAnswer?: string
  hasImage: boolean
  imageUrl?: string
}

export default function QuestionEditor({ onBack, onNext, questions, setQuestions }: QuestionEditorProps) {
  // Remove the local questions state and use the prop instead
  // const [questions, setQuestions] = useState<Question[]>([...])

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [editMode, setEditMode] = useState(false)
  const { toast } = useToast()

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type: "multiple-choice",
      text: "",
      points: 5,
      options: [
        { id: `o${Date.now()}-1`, text: "", isCorrect: false },
        { id: `o${Date.now()}-2`, text: "", isCorrect: false },
        { id: `o${Date.now()}-3`, text: "", isCorrect: false },
        { id: `o${Date.now()}-4`, text: "", isCorrect: false },
      ],
      hasImage: false,
    }

    setCurrentQuestion(newQuestion)
    setEditMode(true)
  }

  const editQuestion = (question: Question) => {
    setCurrentQuestion({ ...question })
    setEditMode(true)
  }

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
    toast({
      title: "Question deleted",
      description: "The question has been removed from the exam",
    })
  }

  const moveQuestionUp = (index: number) => {
    if (index === 0) return
    const newQuestions = [...questions]
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[index - 1]
    newQuestions[index - 1] = temp
    setQuestions(newQuestions)
  }

  const moveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return
    const newQuestions = [...questions]
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[index + 1]
    newQuestions[index + 1] = temp
    setQuestions(newQuestions)
  }

  const handleQuestionTypeChange = (type: QuestionType) => {
    if (!currentQuestion) return

    let options: Option[] = []

    switch (type) {
      case "multiple-choice":
        options = [
          { id: `o${Date.now()}-1`, text: "", isCorrect: false },
          { id: `o${Date.now()}-2`, text: "", isCorrect: false },
          { id: `o${Date.now()}-3`, text: "", isCorrect: false },
          { id: `o${Date.now()}-4`, text: "", isCorrect: false },
        ]
        break
      case "true-false":
        options = [
          { id: `o${Date.now()}-1`, text: "True", isCorrect: false },
          { id: `o${Date.now()}-2`, text: "False", isCorrect: false },
        ]
        break
      default:
        options = []
    }

    setCurrentQuestion({
      ...currentQuestion,
      type,
      options,
      correctAnswer: type === "short-answer" ? "" : undefined,
    })
  }

  const handleOptionChange = (optionId: string, text: string) => {
    if (!currentQuestion) return

    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option) => (option.id === optionId ? { ...option, text } : option)),
    })
  }

  const handleCorrectOptionChange = (optionId: string) => {
    if (!currentQuestion) return

    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option) => ({ ...option, isCorrect: option.id === optionId })),
    })
  }

  const addOption = () => {
    if (!currentQuestion) return

    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { id: `o${Date.now()}`, text: "", isCorrect: false }],
    })
  }

  const removeOption = (optionId: string) => {
    if (!currentQuestion) return

    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((option) => option.id !== optionId),
    })
  }

  const handleImageUpload = () => {
    if (!currentQuestion) return

    // In a real app, you would handle file upload here
    // For this demo, we'll just simulate an image upload
    setCurrentQuestion({
      ...currentQuestion,
      hasImage: true,
      imageUrl: "/placeholder.svg?height=200&width=400",
    })

    toast({
      title: "Image uploaded",
      description: "The image has been attached to the question",
    })
  }

  const saveQuestion = () => {
    if (!currentQuestion || !currentQuestion.text) {
      toast({
        title: "Missing question text",
        description: "Please enter the question text",
        variant: "destructive",
      })
      return
    }

    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") {
      const hasCorrectOption = currentQuestion.options.some((option) => option.isCorrect)
      if (!hasCorrectOption) {
        toast({
          title: "No correct answer",
          description: "Please mark at least one option as correct",
          variant: "destructive",
        })
        return
      }

      const emptyOptions = currentQuestion.options.some((option) => !option.text)
      if (emptyOptions) {
        toast({
          title: "Empty options",
          description: "Please fill in all option texts",
          variant: "destructive",
        })
        return
      }
    }

    if (currentQuestion.type === "short-answer" && !currentQuestion.correctAnswer) {
      toast({
        title: "Missing answer",
        description: "Please provide the correct answer",
        variant: "destructive",
      })
      return
    }

    const existingIndex = questions.findIndex((q) => q.id === currentQuestion.id)

    if (existingIndex >= 0) {
      // Update existing question
      const updatedQuestions = [...questions]
      updatedQuestions[existingIndex] = currentQuestion
      setQuestions(updatedQuestions)
    } else {
      // Add new question
      setQuestions([...questions, currentQuestion])
    }

    setCurrentQuestion(null)
    setEditMode(false)

    toast({
      title: "Question saved",
      description: "The question has been added to the exam",
    })
  }

  const cancelEdit = () => {
    setCurrentQuestion(null)
    setEditMode(false)
  }

  return (
    <div className="space-y-4">
      {editMode ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentQuestion?.id.startsWith("q") && !questions.find((q) => q.id === currentQuestion?.id)
                ? "Add New Question"
                : "Edit Question"}
            </CardTitle>
            <CardDescription>Configure your question details and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-type">Question Type</Label>
              <Select
                value={currentQuestion?.type}
                onValueChange={(value) => handleQuestionTypeChange(value as QuestionType)}
              >
                <SelectTrigger id="question-type">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                value={currentQuestion?.text}
                onChange={(e) => setCurrentQuestion((prev) => (prev ? { ...prev, text: e.target.value } : null))}
                placeholder="Enter your question here"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={currentQuestion?.points}
                  onChange={(e) =>
                    setCurrentQuestion((prev) =>
                      prev ? { ...prev, points: Number.parseInt(e.target.value) || 1 } : null,
                    )
                  }
                />
              </div>

              <div className="flex items-end space-x-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleImageUpload}>
                  <Image className="mr-2 h-4 w-4" />
                  {currentQuestion?.hasImage ? "Change Image" : "Add Image"}
                </Button>

                {currentQuestion?.hasImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      setCurrentQuestion((prev) => (prev ? { ...prev, hasImage: false, imageUrl: undefined } : null))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {currentQuestion?.hasImage && currentQuestion.imageUrl && (
              <div className="rounded-md border p-2">
                <img
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt="Question image"
                  className="mx-auto max-h-48 object-contain"
                />
              </div>
            )}

            {currentQuestion?.type === "multiple-choice" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Answer Options</Label>
                  {currentQuestion.options.length < 8 && (
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  )}
                </div>

                {currentQuestion.options.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={option.isCorrect ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleCorrectOptionChange(option.id)}
                    >
                      {option.isCorrect ? <Check className="h-4 w-4" /> : <span className="h-4 w-4" />}
                    </Button>
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {currentQuestion.options.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(option.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {currentQuestion?.type === "true-false" && (
              <div className="space-y-4">
                <Label>Select the correct answer:</Label>
                <RadioGroup
                  value={currentQuestion.options.find((o) => o.isCorrect)?.id || ""}
                  onValueChange={handleCorrectOptionChange}
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentQuestion?.type === "short-answer" && (
              <div className="space-y-2">
                <Label htmlFor="correct-answer">Correct Answer</Label>
                <Input
                  id="correct-answer"
                  value={currentQuestion.correctAnswer || ""}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => (prev ? { ...prev, correctAnswer: e.target.value } : null))
                  }
                  placeholder="Enter the correct answer"
                />
              </div>
            )}

            {currentQuestion?.type === "essay" && (
              <div className="rounded-md border border-dashed p-4 text-center text-muted-foreground">
                Essay questions will be manually graded after submission
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button onClick={saveQuestion}>Save Question</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add and manage questions for your exam</CardDescription>
              </div>
              <Button onClick={addNewQuestion}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">No questions added yet</p>
                <Button variant="link" onClick={addNewQuestion}>
                  Add your first question
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">Question {index + 1}</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {question.type === "multiple-choice"
                            ? "Multiple Choice"
                            : question.type === "true-false"
                              ? "True/False"
                              : question.type === "short-answer"
                                ? "Short Answer"
                                : "Essay"}
                        </span>
                        <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          {question.points} {question.points === 1 ? "point" : "points"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveQuestionUp(index)}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveQuestionDown(index)}
                          disabled={index === questions.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => editQuestion(question)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteQuestion(question.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="mb-2">{question.text}</p>

                    {question.hasImage && question.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={question.imageUrl || "/placeholder.svg"}
                          alt="Question image"
                          className="max-h-32 rounded-md object-contain"
                        />
                      </div>
                    )}

                    {(question.type === "multiple-choice" || question.type === "true-false") && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-center rounded-md border p-2 ${
                              option.isCorrect ? "bg-green-50 dark:bg-green-900/20" : ""
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
                      <div className="mt-2 rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                        <span className="text-sm font-medium">Correct Answer: </span>
                        <span>{question.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={onNext} disabled={questions.length === 0}>
              Continue to Settings
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

