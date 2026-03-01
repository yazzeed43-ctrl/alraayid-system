"use client"
import { useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
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
      <p className="text-white text-xl">Loading...</p>
    </div>
  )
}
