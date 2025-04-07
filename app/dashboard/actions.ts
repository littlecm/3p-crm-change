"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function addCompany(name: string) {
  await requireAuth()

  if (!name || name.trim() === "") {
    throw new Error("Company name is required")
  }

  try {
    await db.company.create({
      data: {
        name: name.trim(),
        crmConfirmed: false,
        testLeadConfirmed: false,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error adding company:", error)
    throw new Error("Failed to add company")
  }
}

export async function deleteCompany(id: string) {
  await requireAuth()

  try {
    await db.company.delete({
      where: { id },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting company:", error)
    throw new Error("Failed to delete company")
  }
}

export async function resetConfirmation(id: string, type: "crm" | "testLead") {
  await requireAuth()

  try {
    if (type === "crm") {
      await db.company.update({
        where: { id },
        data: {
          crmConfirmed: false,
          crmConfirmedAt: null,
          crmConfirmedBy: null,
        },
      })
    } else {
      await db.company.update({
        where: { id },
        data: {
          testLeadConfirmed: false,
          testLeadConfirmedAt: null,
          testLeadConfirmedBy: null,
        },
      })
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error resetting confirmation:", error)
    throw new Error("Failed to reset confirmation")
  }
}

