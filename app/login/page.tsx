"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (username === "admin" && password === "admin123") {
      // حفظ الجلسة في cookie
      document.cookie = "auth=true; path=/; max-age=86400";
      router.push("/dashboard");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0A0A0A" }}
      dir="rtl"
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="w-7 h-7">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">نظام الرائد</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>إدارة الأملاك العقارية</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "'Tajawal', sans-serif",
              }}
              placeholder="أدخل اسم المستخدم"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "'Tajawal', sans-serif",
              }}
              placeholder="أدخل كلمة المرور"
            />
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold text-sm mt-2"
            style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
