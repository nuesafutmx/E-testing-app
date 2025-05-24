"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Home } from "lucide-react"
import sucreSrc from "@/app/student/sucre.jpg"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "1")

  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 70 // Assuming 70% is passing

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-950 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-center">
        <img
          src={sucreSrc.src}
          alt="Exam Result"
          
          width={200}
          height={50}
        />
      </div>
      <Card className="w-full max-w-md overflow-hidden border-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-blue-900/30">
        <CardHeader className="text-center">
          {passed ? (
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
          ) : (
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          )}
          <CardTitle className="text-2xl font-bold">Exam Results</CardTitle>
          <CardDescription>
            {passed ? "Congratulations! You passed the exam." : "You did not pass the exam."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold">
              {score}/{total}
            </p>
            <p className="text-sm text-muted-foreground">Total Score</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Percentage</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

