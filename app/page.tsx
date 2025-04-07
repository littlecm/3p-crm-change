import Link from "next/link"
import { ArrowRight, CheckCircle, ClipboardCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            CRM Email Update & Test Lead Confirmation System
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Track CRM email updates and test lead submissions for 3rd-party vendors
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard">
              View Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
        <Card>
          <CardHeader>
            <CheckCircle className="h-6 w-6 text-primary mb-2" />
            <CardTitle>CRM Email Confirmations</CardTitle>
            <CardDescription>Allow vendors to confirm CRM email updates with a simple form</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Each vendor has a unique URL to confirm their CRM email has been updated. All confirmations are logged
              with timestamps.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/confirmation?company=Example">View Example Form</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <ClipboardCheck className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Test Lead Submissions</CardTitle>
            <CardDescription>Internal team members can confirm test lead submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Internal staff can access an additional form to confirm test leads have been submitted and received for
              each vendor.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/confirmation?company=Example&testLead=true">View Internal Form</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <ArrowRight className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Centralized Dashboard</CardTitle>
            <CardDescription>View all confirmations in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The admin dashboard displays all vendors with their confirmation status. Filter and sort to quickly find
              the information you need.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

