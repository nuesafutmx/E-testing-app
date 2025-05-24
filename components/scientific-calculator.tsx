"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SkipBackIcon as Backspace,
  RotateCcw,
  Percent,
  DivideIcon,
  ImagePlusIcon as MultiplyIcon,
  Minus,
  Plus,
  Equal,
  ArrowLeftRight,
} from "lucide-react"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [degreeMode, setDegreeMode] = useState(true) // true for degrees, false for radians
  const [lastResult, setLastResult] = useState<number | null>(null)

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(Number.parseInt(e.key))
      } else if (e.key === ".") {
        inputDot()
      } else if (e.key === "+") {
        performOperation("+")
      } else if (e.key === "-") {
        performOperation("-")
      } else if (e.key === "*") {
        performOperation("×")
      } else if (e.key === "/") {
        performOperation("÷")
      } else if (e.key === "%") {
        performOperation("%")
      } else if (e.key === "Enter" || e.key === "=") {
        performOperation("=")
      } else if (e.key === "Backspace") {
        clearLastChar()
      } else if (e.key === "Escape") {
        clearAll()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [display, operation, memory, waitingForOperand])

  const clearAll = () => {
    setDisplay("0")
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(false)
    setLastResult(null)
  }

  const clearLastChar = () => {
    if (waitingForOperand) return

    setDisplay((prev) => {
      if (prev.length === 1 || (prev.length === 2 && prev.startsWith("-"))) {
        return "0"
      }
      return prev.slice(0, -1)
    })
  }

  const toggleSign = () => {
    const value = Number.parseFloat(display)
    setDisplay(value === 0 ? "0" : String(-value))
  }

  const inputDigit = (digit: number) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit)
    }
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (memory === null) {
      setMemory(inputValue)
    } else if (operation) {
      const result = calculate(memory, inputValue, operation)
      setMemory(nextOperation === "=" ? null : result)
      setDisplay(String(result))
      setLastResult(result)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation === "=" ? null : nextOperation)
  }

  const calculate = (firstOperand: number, secondOperand: number, op: string): number => {
    let result: number

    switch (op) {
      case "+":
        result = firstOperand + secondOperand
        break
      case "-":
        result = firstOperand - secondOperand
        break
      case "×":
        result = firstOperand * secondOperand
        break
      case "÷":
        result = firstOperand / secondOperand
        break
      case "%":
        result = firstOperand % secondOperand
        break
      default:
        result = secondOperand
    }

    // Round to avoid floating point precision issues
    return Math.round(result * 1000000000) / 1000000000
  }

  const calculateSpecialFunction = (func: string) => {
    const inputValue = Number.parseFloat(display)
    let result: number

    try {
      switch (func) {
        case "square":
          result = inputValue * inputValue
          break
        case "sqrt":
          if (inputValue < 0) throw new Error("Cannot calculate square root of negative number")
          result = Math.sqrt(inputValue)
          break
        case "sin":
          result = degreeMode ? Math.sin((inputValue * Math.PI) / 180) : Math.sin(inputValue)
          break
        case "cos":
          result = degreeMode ? Math.cos((inputValue * Math.PI) / 180) : Math.cos(inputValue)
          break
        case "tan":
          result = degreeMode ? Math.tan((inputValue * Math.PI) / 180) : Math.tan(inputValue)
          break
        case "log":
          if (inputValue <= 0) throw new Error("Cannot calculate log of non-positive number")
          result = Math.log10(inputValue)
          break
        case "ln":
          if (inputValue <= 0) throw new Error("Cannot calculate ln of non-positive number")
          result = Math.log(inputValue)
          break
        case "exp":
          result = Math.exp(inputValue)
          break
        case "pi":
          result = Math.PI
          break
        case "e":
          result = Math.E
          break
        case "1/x":
          if (inputValue === 0) throw new Error("Cannot divide by zero")
          result = 1 / inputValue
          break
        default:
          result = inputValue
      }

      // Round to avoid floating point precision issues
      result = Math.round(result * 1000000000) / 1000000000

      setDisplay(String(result))
      setWaitingForOperand(true)
      setLastResult(result)
    } catch (error) {
      setDisplay("Error")
      setWaitingForOperand(true)
    }
  }

  const toggleDegreeMode = () => {
    setDegreeMode(!degreeMode)
  }

  const formatDisplay = (value: string) => {
    // If the value is too long, use scientific notation
    const num = Number.parseFloat(value)
    if (!isNaN(num)) {
      if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-7 && num !== 0)) {
        return num.toExponential(6)
      }
    }

    // Limit the length to prevent overflow
    if (value.length > 12) {
      return value.substring(0, 12)
    }

    return value
  }

  return (
    <Card className="border-blue-100 shadow-md dark:border-blue-900/30">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2 dark:from-blue-950/50 dark:to-indigo-950/50">
        <CardTitle className="text-center text-sm">Scientific Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="mb-2">
          <Input value={formatDisplay(display)} readOnly className="font-mono text-right text-lg" />
        </div>

        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="scientific">Scientific</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-2">
            <div className="grid grid-cols-4 gap-1">
              <Button variant="outline" size="sm" onClick={clearAll}>
                AC
              </Button>
              <Button variant="outline" size="sm" onClick={clearLastChar}>
                <Backspace className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("%")}>
                <Percent className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("÷")}>
                <DivideIcon className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => inputDigit(7)}>
                7
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(8)}>
                8
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(9)}>
                9
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("×")}>
                <MultiplyIcon className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => inputDigit(4)}>
                4
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(5)}>
                5
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(6)}>
                6
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("-")}>
                <Minus className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => inputDigit(1)}>
                1
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(2)}>
                2
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(3)}>
                3
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("+")}>
                <Plus className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleSign}>
                +/-
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(0)}>
                0
              </Button>
              <Button variant="ghost" size="sm" onClick={inputDot}>
                .
              </Button>
              <Button variant="default" size="sm" onClick={() => performOperation("=")}>
                <Equal className="h-3 w-3" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scientific" className="mt-2">
            <div className="mb-1 flex justify-between">
              <Button variant="outline" size="sm" className="text-xs" onClick={toggleDegreeMode}>
                {degreeMode ? "DEG" : "RAD"}
                <ArrowLeftRight className="ml-1 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-1">
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("square")}>
                x²
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("sqrt")}>
                √x
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("log")}>
                log
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("ln")}>
                ln
              </Button>

              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("sin")}>
                sin
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("cos")}>
                cos
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("tan")}>
                tan
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("exp")}>
                exp
              </Button>

              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("pi")}>
                π
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("1/x")}>
                1/x
              </Button>
              <Button variant="outline" size="sm" onClick={() => calculateSpecialFunction("e")}>
                e
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("%")}>
                mod
              </Button>

              <Button variant="ghost" size="sm" onClick={() => inputDigit(7)}>
                7
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(8)}>
                8
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(9)}>
                9
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("÷")}>
                <DivideIcon className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => inputDigit(4)}>
                4
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(5)}>
                5
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(6)}>
                6
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("×")}>
                <MultiplyIcon className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => inputDigit(1)}>
                1
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(2)}>
                2
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(3)}>
                3
              </Button>
              <Button variant="outline" size="sm" onClick={() => performOperation("-")}>
                <Minus className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleSign}>
                +/-
              </Button>
              <Button variant="ghost" size="sm" onClick={() => inputDigit(0)}>
                0
              </Button>
              <Button variant="ghost" size="sm" onClick={inputDot}>
                .
              </Button>
              <Button variant="default" size="sm" onClick={() => performOperation("=")}>
                <Equal className="h-3 w-3" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

