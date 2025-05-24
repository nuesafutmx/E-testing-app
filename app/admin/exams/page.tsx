import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ExamsList from "@/components/exams-list"
import AdminHeader from "@/components/admin-header"
import { PlusCircle } from "lucide-react"

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Exams Management</h1>
          <Link href="/admin/exams/create">
            <Button className="bg-slate-800 hover:bg-slate-900">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Exam
            </Button>
          </Link>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
            <CardDescription>View and manage all your exams</CardDescription>
          </CardHeader>
          <CardContent>
            <ExamsList />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

