import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export default function AdminAccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <ShieldCheck className="mx-auto mb-4 h-16 w-16 text-slate-600 dark:text-slate-400" />
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Admin Access</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Secure administrator portal for exam management
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <Card className="overflow-hidden border-slate-200 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardTitle className="text-center text-2xl">Admin Portal</CardTitle>
              <CardDescription className="text-center">
                Upload questions, manage exams, and generate access pins
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Create and manage exams, upload questions with images, generate one-time use pins for students, and view
                exam results.
              </p>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6">
              <Link href="/admin/login" className="w-full">
                <Button
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 dark:from-slate-700 dark:to-slate-600"
                  size="lg"
                >
                  Admin Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

