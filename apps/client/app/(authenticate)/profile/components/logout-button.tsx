"use client"

import { signOut } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setLoading(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in")
          },
        },
      })
    } catch (error) {
      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} variant="ghost">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Out"}
    </Button>
  )
}
