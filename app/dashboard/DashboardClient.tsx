"use client"

import type React from "react"

import { useState } from "react"
import { Filter, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { addCompany } from "./actions"

export default function DashboardClient({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const filter = typeof searchParams.filter === "string" ? searchParams.filter : "all"

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addCompany(newCompanyName)
      setNewCompanyName("")
      setIsAddDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding company:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>View and manage all CRM email update and test lead confirmations</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
                <DialogDescription>
                  Add a new company to track CRM email updates and test lead submissions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCompany}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Company"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="w-[250px]"
                defaultValue={search}
                onChange={(e) => {
                  const params = new URLSearchParams(window.location.search)
                  if (e.target.value) {
                    params.set("search", e.target.value)
                  } else {
                    params.delete("search")
                  }
                  router.push(`/dashboard?${params.toString()}`)
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="border rounded p-2 text-sm"
                defaultValue={filter}
                onChange={(e) => {
                  const params = new URLSearchParams(window.location.search)
                  if (e.target.value !== "all") {
                    params.set("filter", e.target.value)
                  } else {
                    params.delete("filter")
                  }
                  router.push(`/dashboard?${params.toString()}`)
                }}
              >
                <option value="all">All Companies</option>
                <option value="crm-confirmed">CRM Confirmed</option>
                <option value="crm-pending">CRM Pending</option>
                <option value="test-lead-confirmed">Test Lead Confirmed</option>
                <option value="test-lead-pending">Test Lead Pending</option>
                <option value="all-confirmed">All Confirmed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

