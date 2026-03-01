"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        router.push("/reset-password")
      } else if (session) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white text-xl">جاري التحقق...</p>
    </div>
  )
}