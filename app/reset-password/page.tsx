"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleReset = async () => {
    if (password !== confirm) {
      setMessage("كلمات المرور غير متطابقة")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage("حدث خطأ: " + error.message)
    } else {
      setMessage("تم تغيير كلمة المرور بنجاح!")
      setTimeout(() => router.push("/login"), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">تغيير كلمة المرور</h1>
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4 text-right"
        />
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4 text-right"
        />
        {message && <p className="text-center mb-4 text-yellow-400">{message}</p>}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full p-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
        >
          {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
        </button>
      </div>
    </div>
  )
}