"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import fetchValidPins from "@/components/validPins"

// Mock API for pin validation


export default function StudentLogin() {
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [Pins, setPins] = useState<any[]>([])

  useEffect(() => {
    const fetchPins = async () => {
      const pins = await fetchValidPins()
      setPins(pins)
    }
    fetchPins()
  }, [])

  const validatePin = async (pin: string) => {
    // In a real app, this would be an API call to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // Mock data for valid pins
   
  
    const foundPin = Pins.find((p) => p.pin === pin)
    if (foundPin) {
      return { valid: true, examId: foundPin.examId, examTitle: foundPin.exam }
    }
    console.log('foundPin :>> ', foundPin);
    return { valid: false }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await validatePin(pin)

      if (result.valid) {
        toast({
          title: "Success",
          description: `Pin accepted. Starting ${result.examTitle}...`,
        })
        router.push(`/student/exam?pin=${pin}&examId=${result.examId}`)
      } else {
        toast({
          title: "Invalid pin",
          description: "Please enter a valid access pin",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while validating your pin",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1 bg-gradient-to-r from-blue-200 to-purple-400">
          <CardTitle className="text-2xl font-bold">Enter Exam</CardTitle>
          <CardDescription>Enter your pin to access your exam</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-10">
            <div className="space-y-8">
            
              <Input
                id="pin"
                placeholder="Enter your 6-character pin"
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase())}
                className="text-center font-mono text-lg uppercase"
                maxLength={6}
                required
              />
              <p className="text-center text-sm text-muted-foreground mb-6">Your pin was provided by your instructor</p>
              <p className="text-center text-sm text-red-600 font-bold">
                Warning: Closing or minimizing the tab will lead to automatic submission of the exam.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading || pin.length !== 6}
            >
              {isLoading ? "Verifying..." : "Start Exam"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Having trouble?{" "}
              <Link href="/help" className="text-blue-600 hover:text-blue-500">
                Get help
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

