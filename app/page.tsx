import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import nuesa from "@/app/nuesa.jpg"


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="flex justify-center py-2">
        <img
          src={nuesa.src}
          alt="Quiz App"
          className="rounded-full shadow-lg"
          width={180}
          height={180}
        />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">NUESA PRE-ETEST 2025</h1>
          <p className="mx-auto max-w-2xl text-color-blue text-lg text-muted-foreground">
            A introductory preparation for 100 level students to understand the school testing format
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
            <h3 className="mb-4 text-4xl font-bold tracking-tight sm:text-3xl md:text-4xl text-center leading-relaxed">
              Anticipate
              <br />
              <span className="text-blue-600">CALCULUS</span>
              <br />
              @ SUG'25
            </h3>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            </CardHeader>
            <CardContent className="p-1">
              <p className="text-center text-muted-foreground">
                Use your pin to access your assigned exam, answer questions, and submit your responses
                securely.
              </p>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6">
              <Link href="/student/login" className="w-full">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                >
                  Enter Exam
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

