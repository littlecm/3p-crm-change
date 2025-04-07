"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, MoreHorizontal, RefreshCw, Trash, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteCompany, resetConfirmation } from "./actions"

type Company = {
  id: string
  name: string
  crmConfirmed: boolean
  crmConfirmedAt: Date | null
  crmConfirmedBy: string | null
  testLeadConfirmed: boolean
  testLeadConfirmedAt: Date | null
  testLeadConfirmedBy: string | null
}

export default function CompanyTable({ companies }: { companies: Company[] }) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string
    name: string
    type?: "crm" | "testLead"
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedCompany) return

    setIsLoading(true)
    try {
      await deleteCompany(selectedCompany.id)
      router.refresh()
    } catch (error) {
      console.error("Error deleting company:", error)
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleReset = async () => {
    if (!selectedCompany || !selectedCompany.type) return

    setIsLoading(true)
    try {
      await resetConfirmation(selectedCompany.id, selectedCompany.type)
      router.refresh()
    } catch (error) {
      console.error("Error resetting confirmation:", error)
    } finally {
      setIsLoading(false)
      setResetDialogOpen(false)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>CRM Email Confirmed</TableHead>
            <TableHead>Test Lead Confirmed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No companies found. Add a company to get started.
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {company.crmConfirmed ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Confirmed</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                    {company.crmConfirmed && company.crmConfirmedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(company.crmConfirmedAt).toLocaleString()} by {company.crmConfirmedBy}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {company.testLeadConfirmed ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Confirmed</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                    {company.testLeadConfirmed && company.testLeadConfirmedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(company.testLeadConfirmedAt).toLocaleString()} by {company.testLeadConfirmedBy}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/confirmation?company=${encodeURIComponent(company.name)}`} target="_blank">
                        CRM Form
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link
                        href={`/confirmation?company=${encodeURIComponent(company.name)}&testLead=true`}
                        target="_blank"
                      >
                        Test Lead Form
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {company.crmConfirmed && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCompany({ id: company.id, name: company.name, type: "crm" })
                              setResetDialogOpen(true)
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset CRM Confirmation
                          </DropdownMenuItem>
                        )}
                        {company.testLeadConfirmed && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCompany({ id: company.id, name: company.name, type: "testLead" })
                              setResetDialogOpen(true)
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset Test Lead Confirmation
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCompany({ id: company.id, name: company.name })
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Company
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCompany?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the {selectedCompany?.type === "crm" ? "CRM" : "Test Lead"} confirmation
              for {selectedCompany?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

