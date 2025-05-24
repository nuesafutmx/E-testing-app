"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Copy, RefreshCw } from "lucide-react"
import { addPins } from "@/actions/addPins"
import { getPins } from "@/actions/getPins"
import { getQuiz } from "@/actions/getQuiz"
import { CSVLink } from "react-csv"

interface InitialPins {
  id: string
  pin: string
  exam: string
  examId: string
  status: string
  createdAt: string
}

interface exams {
  examId : string,
  subject: string
}

export default function PinGenerator() {
  const [selectedExam, setSelectedExam] = useState<string>("")
  const [pinCount, setPinCount] = useState<number>(10)
  const [generatedPins, setGeneratedPins] = useState<InitialPins[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const [pins, setPins] = useState<InitialPins[]>([])
  const [exam, setExams ] = useState<exams[]>([])
  
  useEffect(() => {
    const fetchPins = async () => {
      const pins = await getPins()
      console.log('fetched pins :>> ', pins);
      setPins(pins)
      setGeneratedPins(pins)
    }
    fetchPins()
  }, [])

  useEffect(() => {
    const fetchQuiz = async () =>{
      const exam = await getQuiz()
      setExams(exam)
    }
    fetchQuiz()
  }, [])
  console.log('exams :>> ', exam);

  const handleGeneratePins = async () => {
    if (!selectedExam) {
      toast({
        title: "Error",
        description: "Please select an exam",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate API call to generate pins
    setTimeout(async () => {
      const examTitle = exam?.find((exam) => exam.examId === (selectedExam))?.subject || ""
      const newPins = Array.from({ length: pinCount }, (_, i) => ({
        id: `new-${Date.now()}-${i}`,
        pin: generateRandomPin(),
        exam: examTitle,
        status: "unused",
        createdAt: new Date().toISOString().split("T")[0],
        examId: selectedExam
      }))

      console.log(newPins)
      await addPins(newPins)
      console.log('submitting new pins  :>> ', newPins);
      setGeneratedPins([...newPins, ...generatedPins])
      
      setIsGenerating(false)

      toast({
        title: "Success",
        description: `Generated ${pinCount} new pins for ${examTitle}`,
      })
    }, 1000)
  }

  const generateRandomPin = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const copyPin = (pin: string) => {
    navigator.clipboard.writeText(pin)
    toast({
      title: "Copied",
      description: `Pin ${pin} copied to clipboard`,
    })
  }

  const generateCSVData = () => {
    return generatedPins
      .filter(pin => pin.examId === selectedExam)
      .map(pin => ({
      Pin: pin.pin,
      Exam: pin.exam,
      Status: pin.status,
      Created: new Date(pin.createdAt).toLocaleDateString()
      }))
  }

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-800">
        <CardHeader>
          <CardTitle>Generate Access Pins</CardTitle>
          <CardDescription>Create one-time use pins for students to access exams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam">Select Exam</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger id="exam">
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exam.map((exam) => (
                    <SelectItem key={exam.examId} value={exam.examId.toString()}>
                      {exam.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin-count">Number of Pins</Label>
              <Select value={pinCount.toString()} onValueChange={(value) => setPinCount(Number(value))}>
                <SelectTrigger id="pin-count">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 pins</SelectItem>
                  <SelectItem value="10">10 pins</SelectItem>
                  <SelectItem value="20">20 pins</SelectItem>
                  <SelectItem value="50">50 pins</SelectItem>
                  <SelectItem value="100">100 pins</SelectItem>
                  <SelectItem value="200">200 pins</SelectItem>
                  <SelectItem value="300">300 pins</SelectItem>
                  <SelectItem value="400">400 pins</SelectItem>
                  <SelectItem value="500">500 pins</SelectItem>
                  <SelectItem value="600">600 pins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGeneratePins}
            disabled={isGenerating}
            className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Pins"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border border-slate-200 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-800">
        <CardHeader>
          <CardTitle>Access Pins</CardTitle>
          <CardDescription>Manage one-time use pins for student exam access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pin</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedPins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No pins generated yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  generatedPins.map((pin) => (
                    <TableRow key={pin.id}>
                      <TableCell className="font-mono font-medium">{pin.pin}</TableCell>
                      <TableCell>{pin.exam}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            pin.status === "unused"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {pin.status === "unused" ? "Unused" : "Used"}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(pin.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyPin(pin.pin)}
                          disabled={pin.status !== "unused"}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy pin</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <Select value={selectedExam} onValueChange={setSelectedExam} >
            <SelectTrigger id="exam-download">
              <SelectValue placeholder="Select an exam to download pins" />
            </SelectTrigger>
            <SelectContent>
              {exam.map((exam) => (
              <SelectItem key={exam.examId} value={exam.examId.toString()}>
                {exam.subject}
              </SelectItem>
              ))}
            </SelectContent>
            </Select>
            <CSVLink
            data={generateCSVData()}
            filename={`pins-${new Date().toISOString().split("T")[0]}.csv`}
            className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-2 px-4 rounded-md text-center"
            >
            Download Pins as CSV
            </CSVLink>
        </CardFooter>
      </Card>
    </div>
  )
}

