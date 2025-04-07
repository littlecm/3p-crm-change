import type { Metadata } from "next"
import DashboardClient from "./DashboardClient"
import CompanyTable from "./CompanyTable"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "View all CRM email update and test lead confirmations",
}

async function getCompanies(search: string, filter: string) {
  return await db.company.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(filter === "crm-confirmed" ? { crmConfirmed: true } : {}),
      ...(filter === "crm-pending" ? { crmConfirmed: false } : {}),
      ...(filter === "test-lead-confirmed" ? { testLeadConfirmed: true } : {}),
      ...(filter === "test-lead-pending" ? { testLeadConfirmed: false } : {}),
      ...(filter === "all-confirmed" ? { crmConfirmed: true, testLeadConfirmed: true } : {}),
    },
    orderBy: { name: "asc" },
  })
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Require authentication
  await requireAuth()

  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const filter = typeof searchParams.filter === "string" ? searchParams.filter : "all"

  // Fetch companies from the database
  const companies = await getCompanies(search, filter)

  return (
    <>
      <DashboardClient searchParams={searchParams} />
      <div className="container mx-auto mt-4">
        <CompanyTable companies={companies} />
      </div>
    </>
  )
}

