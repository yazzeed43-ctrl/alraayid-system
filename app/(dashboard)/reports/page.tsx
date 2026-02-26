'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ReportsPage() {
  const [stats, setStats] = useState<any>({})
  const [buildingIncome, setBuildingIncome] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [{ data: buildings }, { data: units }, { data: tenants }, { data: payments }] = await Promise.all([
      supabase.from("buildings").select("*"),
      supabase.from("units").select("*, buildings(name)"),
      supabase.from("tenants").select("*"),
      supabase.from("payments").select("*, contracts(rent_amount)"),
    ])

    const occupied = units?.filter(u => u.status === "occupied") || []
    const monthlyIncome = occupied.reduce((sum, u) => sum + (u.rent_price || 0), 0)
    const totalPayments = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const occupancyRate = units?.length ? Math.round((occupied.length / units.length) * 100) : 0

    // Income by building
    const incomeMap: Record<string, { name: string; total: number; units: number }> = {}
    occupied.forEach((u: any) => {
      const bid = u.building_id
      if (!incomeMap[bid]) incomeMap[bid] = { name: u.buildings?.name || "—", total: 0, units: 0 }
      incomeMap[bid].total += u.rent_price || 0
      incomeMap[bid].units++
    })

    setStats({
      buildings: buildings?.length || 0,
      units: units?.length || 0,
      occupied: occupied.length,
      tenants: tenants?.length || 0,
      monthlyIncome,
      totalPayments,
      occupancyRate,
    })
    setBuildingIncome(Object.values(incomeMap))
    setLoading(false)
  }

  const maxIncome = Math.max(...buildingIncome.map(b => b.total), 1)

  return (
    <main dir="rtl" className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>

      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>التقارير</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>تقارير الأداء المالي والإشغال</p>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'إجمالي العمائر', value: stats.buildings, icon: '🏢', color: '#C9A96E' },
              { label: 'إجمالي الوحدات', value: stats.units, icon: '🚪', color: '#C9A96E' },
              { label: 'المستأجرون', value: stats.tenants, icon: '👤', color: '#34d399' },
              { label: 'نسبة الإشغال', value: stats.occupancyRate + '%', icon: '📊', color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: '#888' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Financial */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
              <p className="text-sm mb-1" style={{ color: '#888' }}>الدخل الشهري المتوقع</p>
              <p className="text-3xl font-bold" style={{ color: '#C9A96E' }}>{stats.monthlyIncome?.toLocaleString()} ر.س</p>
              <p className="text-xs mt-2" style={{ color: '#555' }}>من {stats.occupied} وحدة مؤجرة</p>
            </div>
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
              <p className="text-sm mb-1" style={{ color: '#888' }}>إجمالي المدفوعات المسجلة</p>
              <p className="text-3xl font-bold" style={{ color: '#34d399' }}>{stats.totalPayments?.toLocaleString()} ر.س</p>
              <p className="text-xs mt-2" style={{ color: '#555' }}>من سجلات الدفعات</p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#C9A96E' }}>نسبة الإشغال</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: '#1e1e1e' }}>
                <div className="h-4 rounded-full transition-all"
                  style={{ width: `${stats.occupancyRate}%`, background: 'linear-gradient(90deg, #C9A96E, #8B6914)' }} />
              </div>
              <span className="text-lg font-bold" style={{ color: '#C9A96E' }}>{stats.occupancyRate}%</span>
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: '#555' }}>
              <span>{stats.occupied} مؤجرة</span>
              <span>{stats.units - stats.occupied} شاغرة</span>
            </div>
          </div>

          {/* Income by Building */}
          {buildingIncome.length > 0 && (
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
              <h2 className="text-sm font-bold mb-4" style={{ color: '#C9A96E' }}>الدخل حسب العمارة</h2>
              <div className="space-y-4">
                {buildingIncome.map((b, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span style={{ color: '#f5f0e8' }}>{b.name}</span>
                      <span style={{ color: '#C9A96E' }}>{b.total.toLocaleString()} ر.س</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: '#1e1e1e' }}>
                      <div className="h-2 rounded-full"
                        style={{ width: `${(b.total / maxIncome) * 100}%`, background: 'linear-gradient(90deg, #C9A96E, #8B6914)' }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#555' }}>{b.units} وحدة مؤجرة</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
