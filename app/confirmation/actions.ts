"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

type CrmConfirmationData = {
  company: string
  submitterName: string
  timestamp: string
}

type TestLeadConfirmationData = {
  company: string
  submitterName: string
  timestamp: string
}

export async function submitCrmConfirmation(data: CrmConfirmationData) {
  try {
    // Validate input
    if (!data.company || data.company.trim() === "") {
      return { success: false, error: "Company name is required" }
    }

    // Check if company exists
    const existingCompany = await db.company.findUnique({
      where: { name: data.company },
    })

    if (!existingCompany) {
      return { success: false, error: "Company not found" }
    }

    // Store in database
    await db.company.update({
      where: { name: data.company },
      data: {
        crmConfirmed: true,
        crmConfirmedAt: new Date(data.timestamp),
        crmConfirmedBy: data.submitterName,
      },
    })

    // Revalidate the dashboard page
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error submitting CRM confirmation:", error)
    return { success: false, error: "Failed to submit confirmation" }
  }
}

export async function submitTestLeadConfirmation(data: TestLeadConfirmationData) {
  try {
    // Validate input
    if (!data.company || data.company.trim() === "") {
      return { success: false, error: "Company name is required" }
    }

    // Check if company exists
    const existingCompany = await db.company.findUnique({
      where: { name: data.company },
    })

    if (!existingCompany) {
      return { success: false, error: "Company not found" }
    }

    // Store in database
    await db.company.update({
      where: { name: data.company },
      data: {
        testLeadConfirmed: true,
        testLeadConfirmedAt: new Date(data.timestamp),
        testLeadConfirmedBy: data.submitterName,
      },
    })

    // Revalidate the dashboard page
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error submitting test lead confirmation:", error)
    return { success: false, error: "Failed to submit confirmation" }
  }
}

