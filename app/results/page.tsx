"use client"

import { useState } from "react"
import AdminHeader from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Download, Eye } from "lucide-react"
import Link from "next/link"

// Mock data for results
const mockResults = [
  {
    id: "1",
    studentName: "John Smith",
    examTitle: "Midterm Exam - Mathematics",
    score: 85,
    totalPoints: 100,
    completedAt: "2023-10-15 14:30",
    status: "passed",
  },
  {
    id: "2",
    studentName: "Emily Johnson",
    examTitle: "Final Exam - Physics",
    score: 92,
    totalPoints: 100,
    completedAt: "2023-10-14 10:15",
    status: "passed",
  },
  {
    id: "3",
    studentName: "Michael Brown",
    examTitle: "Pop Quiz - Chemistry",
    score: 68,
    totalPoints: 100,
    completedAt: "2023-10-13 09:45",
    status: "failed",
  },
  {
    id: "4",
    studentName: "Sarah Davis",
    examTitle: "Chapter Test - Biology",
    score: 75,
    totalPoints: 100,
    completedAt: "2023-10-12 13:20",
    status: "passed",
  },
  {
    id: "5",
    studentName: "David Wilson",
    examTitle: "Practice Test - Computer Science",
    score: 62,
    totalPoints: 100,
    completedAt: "2023-10-11 15:40",
    status: "failed",
  },
]

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [examFilter, setExamFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter results based on search query and filters
  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.examTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesExam = examFilter === "all" || result.examTitle.includes(examFilter)
    const matchesStatus = statusFilter === "all" || result.status === statusFilter

    return matchesSearch && matchesExam && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Exam Results</h1>
          <p className="text-muted-foreground">View and analyze student exam results</p>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>Results Overview</CardTitle>
            <CardDescription>Track student performance across all exams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student or exam..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={examFilter} onValueChange={setExamFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    <SelectItem value="Midterm">Midterm Exams</SelectItem>
                    <SelectItem value="Final">Final Exams</SelectItem>
                    <SelectItem value="Quiz">Quizzes</SelectItem>
                    <SelectItem value="Test">Tests</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="hidden sm:flex">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.studentName}</TableCell>
                        <TableCell>{result.examTitle}</TableCell>
                        <TableCell>
                          {result.score}/{result.totalPoints} ({Math.round((result.score / result.totalPoints) * 100)}%)
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              result.status === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.status === "passed" ? "Passed" : "Failed"}
                          </span>
                        </TableCell>
                        <TableCell>{result.completedAt}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/results/${result.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

