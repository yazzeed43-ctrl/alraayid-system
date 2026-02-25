'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [unitId, setUnitId] = useState("")
  const [rentAmount, setRentAmount] = useState("")
  const [startDate, setStartDate] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchTenants = async () => {
    const { data } = await supabase
      .from("tenants")
      .select("*, units(unit_number)")
      .order("created_at", { ascending: false })
    if (data) setTenants(data)
  }

  const fetchUnits = async () => {
    const { data } = await supabase.from("units").select("*").eq("status", "شاغرة")
    if (data) setUnits(data)
  }

  useEffect(() => { fetchTenants(); fetchUnits() }, [])

  const addTenant = async () => {
    if (!fullName || !unitId) return alert("أدخل الاسم واختر الوحدة")
    setLoading(true)
    await supabase.from("tenants").insert([{
      full_name: fullName, phone, unit_id: unitId,
      rent_amount: Number(rentAmount), start_date: startDate
    }])
    await supabase.from("units").update({ status: "مؤجرة" }).eq("id", unitId)
    setFullName(""); setPhone(""); setUnitId(""); setRentAmount(""); setStartDate("")
    setShowForm(false); setLoading(false)
    fetchTenants(); fetchUnits()
  }

  return (
    <div dir="rtl" style={{ background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h1 className="text-xl font-bold text-white">المستأجرين</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {tenants.length} مستأجر نشط
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          إضافة مستأجر
        </button>
      </header>

      <div className="p-8">
        {/* Form */}
        {showForm && (
          <div className="rounded-xl p-6 mb-6 max-w-lg"
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-sm font-semibold text-white mb-4">إضافة مستأجر جديد</h2>
            <div className="space-y-3">
              <input type="text" placeholder="اسم المستأجر" value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Tajawal', sans-serif" }} />
              <input type="text" placeholder="رقم الجوال" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Tajawal', sans-serif" }} />
              <select value={unitId} onChange={(e) => setUnitId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: unitId ? "white" : "rgba(255,255,255,0.3)", fontFamily: "'Tajawal', sans-serif" }}>
                <option value="">اختر وحدة شاغرة</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>وحدة {unit.unit_number}</option>
                ))}
              </select>
              <input type="number" placeholder="قيمة الإيجار" value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Tajawal', sans-serif" }} />
              <input type="date" value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Tajawal', sans-serif" }} />
              <div className="flex gap-3 pt-1">
                <button onClick={addTenant} disabled={loading}
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

        {/* Tenants List */}
        {tenants.length === 0 ? (
          <div className="rounded-xl p-12 flex flex-col items-center justify-center"
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 mb-3"
              style={{ color: "rgba(255,255,255,0.1)" }}>
              <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>لا يوجد مستأجرون بعد</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Table Header */}
            <div className="grid grid-cols-4 px-6 py-3 text-xs font-medium"
              style={{ background: "#141414", color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span>الاسم</span>
              <span>الجوال</span>
              <span>الوحدة</span>
              <span>الإيجار</span>
            </div>
            {tenants.map((tenant, i) => (
              <div key={tenant.id}
                className="grid grid-cols-4 px-6 py-4 items-center"
                style={{
                  background: i % 2 === 0 ? "#111111" : "#0E0E0E",
                  borderBottom: i < tenants.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none"
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)" }}>
                    {tenant.full_name?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{tenant.full_name}</span>
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{tenant.phone}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {tenant.units?.unit_number || "—"}
                </span>
                <span className="text-sm font-semibold" style={{ color: "#C9A96E" }}>
                  {tenant.rent_amount?.toLocaleString()} ر
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
