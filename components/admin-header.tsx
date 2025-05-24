"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut } from "lucide-react"

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-gradient-to-r from-slate-50 to-white shadow-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              ExamAdmin
            </span>
          </Link>

          <nav className="ml-8 hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link href="/admin/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/exams" className="text-sm font-medium transition-colors hover:text-primary">
                  Exams
                </Link>
              </li>
              <li>
                <Link href="/admin/pins" className="text-sm font-medium transition-colors hover:text-primary">
                  Access Pins
                </Link>
              </li>
              <li>
                <Link href="/admin/results" className="text-sm font-medium transition-colors hover:text-primary">
                  Results
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin/profile" className="flex w-full items-center">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/settings" className="flex w-full items-center">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-b bg-white p-4 md:hidden">
          <nav>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="block text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/exams"
                  className="block text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Exams
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/pins"
                  className="block text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Access Pins
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/results"
                  className="block text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Results
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

