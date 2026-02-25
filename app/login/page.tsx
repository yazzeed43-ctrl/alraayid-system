"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      router.push("/dashboard");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#FAF6F0" }}
      dir="rtl"
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-lg"
        style={{ background: "white" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #C9A96E, #A0654A)" }}
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#3D2314" }}>
            نظام الرائد
          </h1>
          <p className="text-sm mt-1" style={{ color: "#A0654A" }}>
            إدارة الأملاك العقارية
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3D2314" }}>
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
              style={{ borderColor: "#E5D5C0", fontFamily: "'Tajawal', sans-serif" }}
              placeholder="أدخل اسم المستخدم"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3D2314" }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
              style={{ borderColor: "#E5D5C0", fontFamily: "'Tajawal', sans-serif" }}
              placeholder="أدخل كلمة المرور"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-bold text-sm mt-2"
            style={{ background: "linear-gradient(135deg, #C9A96E, #A0654A)" }}
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}
