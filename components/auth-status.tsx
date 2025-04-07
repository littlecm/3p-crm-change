"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  if (status === "unauthenticated") {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">
          <User className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <span className="text-muted-foreground">Signed in as </span>
        <span className="font-medium">{session?.user?.name || session?.user?.email}</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}

