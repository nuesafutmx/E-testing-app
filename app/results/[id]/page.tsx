import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Home } from "lucide-react"

type ResultsPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ResultsPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Exam Results - ${id}`,
    description: "View your exam results and performance analysis",
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  // In a real app, you would fetch the results from your database using the ID
  // For this example, we'll use mock data
  const { id: examId } = await params

  const mockResults = {
    score: 85,
    total: 100,
    examTitle: "Mathematics Midterm",
    sections: [
      { name: "Multiple Choice", performance: "Good" },
      { name: "True/False", performance: "Excellent" },
      { name: "Short Answer", performance: "Needs Improvement" },
      { name: "Essay", performance: "Pending Review" },
    ],
  }

  const { score, total, examTitle, sections } = mockResults
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 70 // Assuming 70% is passing

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-950 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md overflow-hidden border-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-blue-900/30">
        <CardHeader className="text-center">
          {passed ? (
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
          ) : (
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          )}
          <CardTitle className="text-2xl font-bold">Exam Results</CardTitle>
          <CardDescription>
            {examTitle} (ID: {examId})
          </CardDescription>
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

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Performance Summary</h3>
            <ul className="space-y-2 text-sm">
              {sections.map((section, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{section.name}</span>
                  <span className="font-medium">{section.performance}</span>
                </li>
              ))}
            </ul>
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

