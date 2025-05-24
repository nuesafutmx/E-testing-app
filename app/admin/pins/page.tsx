import AdminHeader from "@/components/admin-header"
import PinGenerator from "@/components/pin-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PinsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Access Pins</h1>
          <p className="text-muted-foreground">Generate and manage one-time use pins for student exam access</p>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>Pin Management</CardTitle>
            <CardDescription>Create and track access pins for your exams</CardDescription>
          </CardHeader>
          <CardContent>
            <PinGenerator />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

