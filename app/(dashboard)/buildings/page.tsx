'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<any[]>([])
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [totalUnits, setTotalUnits] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchBuildings = async () => {
    const { data } = await supabase
      .from("buildings")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setBuildings(data)
  }

  useEffect(() => { fetchBuildings() }, [])

  const addBuilding = async () => {
    if (!name) return alert("أدخل اسم العمارة")
    setLoading(true)
    await supabase.from("buildings").insert([{ name, location, total_units: Number(totalUnits) }])
    setName(""); setLocation(""); setTotalUnits("")
    setShowForm(false); setLoading(false)
    fetchBuildings()
  }

  return (
    <div dir="rtl" style={{ background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h1 className="text-xl font-bold text-white">العمائر</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>إدارة جميع العمائر</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          إضافة عمارة
        </button>
      </header>

      <div className="p-8">
        {/* Form */}
        {showForm && (
          <div className="rounded-xl p-6 mb-6 max-w-lg"
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-semibold text-white mb-4">إضافة عمارة جديدة</h2>
            <div className="space-y-3">
              <input type="text" placeholder="اسم العمارة" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Tajawal', sans-serif" }} />
              <input type="text" placeholder="الموقع" value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Tajawal', sans-serif" }} />
              <input type="number" placeholder="عدد الوحدات" value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Tajawal', sans-serif" }} />
              <div className="flex gap-3 pt-1">
                <button onClick={addBuilding} disabled={loading}
                  className="flex-1 py-3 rounded-lg text-white font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)" }}>
                  {loading ? "جارٍ الإضافة..." : "إضافة"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buildings Grid */}
        {buildings.length === 0 ? (
          <div className="rounded-xl p-12 flex flex-col items-center justify-center"
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 mb-3"
              style={{ color: "rgba(255,255,255,0.1)" }}>
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
            </svg>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد عمائر بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {buildings.map((building) => (
              <a href={`/buildings/${building.id}`} key={building.id}
                className="rounded-xl p-5 block transition-all duration-150 hover:border-yellow-800"
                style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "rgba(201,169,110,0.1)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth={1.5} className="w-5 h-5">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2">{building.name}</h3>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  📍 {building.location || "—"}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {building.total_units} وحدة
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
