"use client"
import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReset = async () => {
    if (password !== confirm) {
      setMessage("Passwords do not match")
      return
    }
    setLoading(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage("Error: " + error.message)
    } else {
      setMessage("Password changed successfully!")
      setTimeout(() => router.push("/login"), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
        />
        {message && <p className="text-center mb-4 text-yellow-400">{message}</p>}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full p-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
        >
          {loading ? "Saving..." : "Save Password"}
        </button>
      </div>
    </div>
  )
}
