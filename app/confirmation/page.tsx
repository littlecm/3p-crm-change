"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitCrmConfirmation, submitTestLeadConfirmation } from "./actions"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const company = searchParams.get("company")
  const isTestLead = searchParams.get("testLead") === "true"

  const [crmSubmitted, setCrmSubmitted] = useState(false)
  const [testLeadSubmitted, setTestLeadSubmitted] = useState(false)
  const [submitterName, setSubmitterName] = useState("")
  const [internalName, setInternalName] = useState("")
  const [crmError, setCrmError] = useState("")
  const [testLeadError, setTestLeadError] = useState("")
  const [isSubmittingCrm, setIsSubmittingCrm] = useState(false)
  const [isSubmittingTestLead, setIsSubmittingTestLead] = useState(false)

  if (!company) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Missing Company Parameter</CardTitle>
            <CardDescription>Please include a company parameter in the URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Example: /confirmation?company=DealerSocket</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCrmSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingCrm(true)
    setCrmError("")

    try {
      const result = await submitCrmConfirmation({
        company,
        submitterName: submitterName.trim() || "Anonymous",
        timestamp: new Date().toISOString(),
      })

      if (result.success) {
        setCrmSubmitted(true)
      } else {
        setCrmError(result.error || "Failed to submit confirmation")
      }
    } catch (error) {
      console.error("Error submitting CRM confirmation:", error)
      setCrmError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmittingCrm(false)
    }
  }

  const handleTestLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingTestLead(true)
    setTestLeadError("")

    try {
      const result = await submitTestLeadConfirmation({
        company,
        submitterName: internalName.trim() || "Anonymous Team Member",
        timestamp: new Date().toISOString(),
      })

      if (result.success) {
        setTestLeadSubmitted(true)
      } else {
        setTestLeadError(result.error || "Failed to submit confirmation")
      }
    } catch (error) {
      console.error("Error submitting test lead confirmation:", error)
      setTestLeadError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmittingTestLead(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>CRM Email Update Confirmation</CardTitle>
            <CardDescription>Confirm that the CRM email address has been updated for {company}</CardDescription>
          </CardHeader>
          <CardContent>
            {crmSubmitted ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium">Confirmation Submitted</h3>
                <p className="text-center text-muted-foreground">Thank you for confirming the CRM email update.</p>
              </div>
            ) : (
              <form onSubmit={handleCrmSubmit} className="space-y-4">
                {crmError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{crmError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="submitter-name">Your Name (Optional)</Label>
                  <Input
                    id="submitter-name"
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={100}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmittingCrm}>
                  {isSubmittingCrm ? "Submitting..." : "Confirm CRM Email Update"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {isTestLead && (
          <Card>
            <CardHeader>
              <CardTitle>Internal Test Lead Confirmation</CardTitle>
              <CardDescription>Confirm that a test lead was submitted and received for {company}</CardDescription>
            </CardHeader>
            <CardContent>
              {testLeadSubmitted ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Test Lead Confirmed</h3>
                  <p className="text-center text-muted-foreground">
                    You have confirmed that a test lead was submitted.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTestLeadSubmit} className="space-y-4">
                  {testLeadError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{testLeadError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="internal-name">Your Name (Optional)</Label>
                    <Input
                      id="internal-name"
                      value={internalName}
                      onChange={(e) => setInternalName(e.target.value)}
                      placeholder="Enter your name"
                      maxLength={100}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmittingTestLead}>
                    {isSubmittingTestLead ? "Submitting..." : "Confirm Test Lead Submission"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

