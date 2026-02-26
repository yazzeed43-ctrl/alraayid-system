'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    buildings: 0,
    units: 0,
    tenants: 0,
    occupied: 0,
    monthlyIncome: 0,
  })
  const [recentTenants, setRecentTenants] = useState<any[]>([])
  const [expiringContracts, setExpiringContracts] = useState<any[]>([])
  const [buildingIncome, setBuildingIncome] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    // Buildings
    const { data: buildings } = await supabase.from("buildings").select("*")

    // Units
    const { data: units } = await supabase.from("units").select("*")

    // Tenants
    const { data: tenants } = await supabase
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    // All tenants count
    const { count: tenantCount } = await supabase
      .from("tenants")
      .select("*", { count: "exact", head: true })

    // Contracts expiring in 30 days
    const today = new Date()
    const in30Days = new Date()
    in30Days.setDate(today.getDate() + 30)

    const { data: contracts } = await supabase
      .from("contracts")
      .select("*, tenants(name), units(unit_number)")
      .lte("end_date", in30Days.toISOString().split("T")[0])
      .gte("end_date", today.toISOString().split("T")[0])
      .order("end_date", { ascending: true })
      .limit(5)

    // Income by building
    const { data: incomeData } = await supabase
      .from("units")
      .select("building_id, rent_price, status, buildings(name)")
      .eq("status", "occupied")

    // Calculate building income
    const incomeMap: Record<string, { name: string; total: number }> = {}
    incomeData?.forEach((u: any) => {
      const bid = u.building_id
      if (!incomeMap[bid]) incomeMap[bid] = { name: u.buildings?.name || "—", total: 0 }
      incomeMap[bid].total += u.rent_price || 0
    })

    const occupiedUnits = units?.filter(u => u.status === "occupied").length || 0
    const monthlyIncome = incomeData?.reduce((sum, u) => sum + (u.rent_price || 0), 0) || 0

    setStats({
      buildings: buildings?.length || 0,
      units: units?.length || 0,
      tenants: tenantCount || 0,
      occupied: occupiedUnits,
      monthlyIncome,
    })
    setRecentTenants(tenants || [])
    setExpiringContracts(contracts || [])
    setBuildingIncome(Object.values(incomeMap))
    setLoading(false)
  }

  const occupancyRate = stats.units > 0 ? Math.round((stats.occupied / stats.units) * 100) : 0

  const daysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div dir="rtl" style={{ background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => router.push("/buildings")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)", color: "white" }}
        >
          + إضافة عمارة
        </button>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "إجمالي العمائر", value: stats.buildings, sub: "عمارة مسجلة", icon: "🏢" },
            { label: "إجمالي الوحدات", value: stats.units, sub: `${stats.occupied} مؤجرة`, icon: "🚪" },
            { label: "المستأجرون", value: stats.tenants, sub: `نسبة إشغال ${occupancyRate}%`, icon: "👤" },
            { label: "الدخل الشهري", value: stats.monthlyIncome.toLocaleString() + " ر.س", sub: "من الوحدات المؤجرة", icon: "💰" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-2xl mb-4">{s.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{loading ? "..." : s.value}</div>
              <div className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Recent Tenants */}
          <div className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">آخر المستأجرين</h2>
              <button onClick={() => router.push("/tenants")} className="text-xs" style={{ color: "#C9A96E" }}>عرض الكل</button>
            </div>
            {loading ? (
              <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>جاري التحميل...</p>
            ) : recentTenants.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>لا يوجد مستأجرون بعد</p>
            ) : (
              <div className="space-y-3">
                {recentTenants.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
                        {t.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-white">{t.name}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{t.phone || "—"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring Contracts */}
          <div className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">عقود قاربت على الانتهاء</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                {expiringContracts.length} عقود
              </span>
            </div>
            {loading ? (
              <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>جاري التحميل...</p>
            ) : expiringContracts.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد عقود قاربت على الانتهاء</p>
            ) : (
              <div className="space-y-3">
                {expiringContracts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <p className="text-sm text-white">{c.tenants?.name || "—"}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>وحدة {c.units?.unit_number || "—"}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                      {daysLeft(c.end_date)} يوم
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Income by Building */}
        <div className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">الدخل حسب العمارة</h2>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>ريال سعودي</span>
          </div>
          {loading ? (
            <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>جاري التحميل...</p>
          ) : buildingIncome.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد بيانات دخل بعد</p>
          ) : (
            <div className="space-y-3">
              {buildingIncome.map((b, i) => {
                const maxIncome = Math.max(...buildingIncome.map(x => x.total))
                const pct = maxIncome > 0 ? (b.total / maxIncome) * 100 : 0
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white">{b.name}</span>
                      <span style={{ color: "#C9A96E" }}>{b.total.toLocaleString()} ر.س</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #C9A96E, #8B6914)" }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
