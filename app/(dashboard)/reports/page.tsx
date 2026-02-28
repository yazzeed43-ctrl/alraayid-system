'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'income' | 'tenants' | 'late'>('income')

  // البيانات
  const [buildings, setBuildings] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const [{ data: b }, { data: c }, { data: p }] = await Promise.all([
      supabase.from("buildings").select("*, units(id, status, rent_price)"),
      supabase.from("contracts").select(`
        id, rent_amount, start_date, end_date, created_at,
        tenants(id, full_name, phone),
        units(id, unit_number, buildings(id, name))
      `).order("created_at", { ascending: false }),
      supabase.from("payments").select(`
        id, amount, payment_date, contract_id,
        contracts(
          id, rent_amount, start_date, end_date,
          tenants(id, full_name, phone),
          units(id, unit_number, buildings(id, name))
        )
      `).order("payment_date", { ascending: false }),
    ])
    if (b) setBuildings(b)
    if (c) setContracts(c)
    if (p) setPayments(p)
    setLoading(false)
  }

  // تقرير دخل كل عمارة
  const buildingIncomeReport = buildings.map(b => {
    const buildingPayments = payments.filter(
      p => p.contracts?.units?.buildings?.id === b.id
    )
    const totalPaid = buildingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const occupiedUnits = b.units?.filter((u: any) => u.status === "occupied") || []
    const vacantUnits = b.units?.filter((u: any) => u.status !== "occupied") || []
    const monthlyExpected = occupiedUnits.reduce((sum: number, u: any) => sum + (u.rent_price || 0), 0)
    return {
      name: b.name,
      totalUnits: b.units?.length || 0,
      occupied: occupiedUnits.length,
      vacant: vacantUnits.length,
      monthlyExpected,
      totalPaid,
    }
  })

  // تقرير المستأجرين والعقود
  const daysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const contractStatus = (endDate: string) => {
    const days = daysLeft(endDate)
    if (days < 0) return { label: "منتهي", color: "#ef4444" }
    if (days <= 30) return { label: `ينتهي بعد ${days} يوم`, color: "#f59e0b" }
    return { label: "ساري", color: "#34d399" }
  }

  // تقرير الدفعات المتأخرة
  const lateContracts = contracts.filter(c => {
    if (!c.end_date) return false
    const contractPayments = payments.filter(p => p.contract_id === c.id)
    const totalPaid = contractPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const months = Math.ceil(
      (new Date(c.end_date).getTime() - new Date(c.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    const totalExpected = (c.rent_amount || 0) * months
    return totalPaid < totalExpected && daysLeft(c.end_date) > -365
  }).map(c => {
    const contractPayments = payments.filter(p => p.contract_id === c.id)
    const totalPaid = contractPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const months = Math.ceil(
      (new Date(c.end_date).getTime() - new Date(c.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    const totalExpected = (c.rent_amount || 0) * months
    return { ...c, totalPaid, totalExpected, remaining: totalExpected - totalPaid }
  })

  const tabs = [
    { id: 'income', label: '📊 دخل العمائر' },
    { id: 'tenants', label: '👤 المستأجرون والعقود' },
    { id: 'late', label: '⚠️ الدفعات المتأخرة' },
  ]

  return (
    <main dir="rtl" className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>

      {/* Header */}
      <header className="sticky top-0 z-40 px-8 py-4"
        style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>التقارير</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>تقارير شاملة عن النظام</p>
      </header>

      <div className="p-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? '#C9A96E' : '#111',
                color: activeTab === tab.id ? '#0a0a0a' : '#888',
                border: `1px solid ${activeTab === tab.id ? '#C9A96E' : '#2a2a2a'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div>
        ) : (
          <>
            {/* تقرير دخل العمائر */}
            {activeTab === 'income' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                    <div className="text-2xl mb-2">💰</div>
                    <div className="text-2xl font-bold" style={{ color: '#C9A96E' }}>
                      {payments.reduce((s, p) => s + (p.amount || 0), 0).toLocaleString()} ر.س
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#888' }}>إجمالي المدفوع</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="text-2xl font-bold" style={{ color: '#34d399' }}>
                      {buildings.reduce((s, b) => s + (b.units?.filter((u: any) => u.status === "occupied").length || 0), 0)}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#888' }}>وحدات مؤجرة</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                    <div className="text-2xl mb-2">🔓</div>
                    <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                      {buildings.reduce((s, b) => s + (b.units?.filter((u: any) => u.status !== "occupied").length || 0), 0)}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#888' }}>وحدات شاغرة</div>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                  <div className="grid grid-cols-6 px-5 py-3 text-xs font-bold"
                    style={{ backgroundColor: '#161616', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
                    <span>العمارة</span>
                    <span>الوحدات</span>
                    <span>مؤجرة</span>
                    <span>شاغرة</span>
                    <span>الإيجار الشهري</span>
                    <span>إجمالي المدفوع</span>
                  </div>
                  {buildingIncomeReport.map((b, i) => (
                    <div key={i} className="grid grid-cols-6 px-5 py-4 text-sm items-center"
                      style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <span className="font-bold" style={{ color: '#f5f0e8' }}>{b.name}</span>
                      <span style={{ color: '#aaa' }}>{b.totalUnits}</span>
                      <span style={{ color: '#34d399' }}>{b.occupied}</span>
                      <span style={{ color: '#f59e0b' }}>{b.vacant}</span>
                      <span style={{ color: '#C9A96E' }}>{b.monthlyExpected.toLocaleString()} ر.س</span>
                      <span className="font-bold" style={{ color: '#34d399' }}>{b.totalPaid.toLocaleString()} ر.س</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* تقرير المستأجرين والعقود */}
            {activeTab === 'tenants' && (
              <div>
                <p className="text-sm mb-4" style={{ color: '#888' }}>إجمالي العقود: {contracts.length}</p>
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                  <div className="grid grid-cols-5 px-5 py-3 text-xs font-bold"
                    style={{ backgroundColor: '#161616', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
                    <span>المستأجر</span>
                    <span>العمارة / الوحدة</span>
                    <span>الإيجار الشهري</span>
                    <span>تاريخ الانتهاء</span>
                    <span>الحالة</span>
                  </div>
                  {contracts.map((c) => {
                    const { label, color } = contractStatus(c.end_date)
                    return (
                      <div key={c.id} className="grid grid-cols-5 px-5 py-4 text-sm items-center"
                        style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <div>
                          <p className="font-medium" style={{ color: '#f5f0e8' }}>{c.tenants?.full_name}</p>
                          <p className="text-xs" style={{ color: '#666' }}>{c.tenants?.phone || '—'}</p>
                        </div>
                        <div>
                          <p style={{ color: '#f5f0e8' }}>{c.units?.buildings?.name}</p>
                          <p className="text-xs" style={{ color: '#666' }}>وحدة {c.units?.unit_number}</p>
                        </div>
                        <span style={{ color: '#C9A96E' }}>{c.rent_amount?.toLocaleString()} ر.س</span>
                        <span style={{ color: '#aaa' }}>{c.end_date}</span>
                        <span className="text-xs px-2 py-1 rounded-full w-fit"
                          style={{ backgroundColor: color + '22', color, border: `1px solid ${color}33` }}>
                          {label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* تقرير الدفعات المتأخرة */}
            {activeTab === 'late' && (
              <div>
                <p className="text-sm mb-4" style={{ color: '#ef4444' }}>
                  {lateContracts.length} عقود فيها دفعات متأخرة
                </p>
                {lateContracts.length === 0 ? (
                  <div className="text-center py-20 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                    <div className="text-5xl mb-4">✅</div>
                    <p style={{ color: '#34d399' }}>لا توجد دفعات متأخرة</p>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                    <div className="grid grid-cols-5 px-5 py-3 text-xs font-bold"
                      style={{ backgroundColor: '#161616', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
                      <span>المستأجر</span>
                      <span>العمارة / الوحدة</span>
                      <span>المدفوع</span>
                      <span>المتوقع</span>
                      <span>المتبقي</span>
                    </div>
                    {lateContracts.map((c) => (
                      <div key={c.id} className="grid grid-cols-5 px-5 py-4 text-sm items-center"
                        style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <div>
                          <p className="font-medium" style={{ color: '#f5f0e8' }}>{c.tenants?.full_name}</p>
                          <p className="text-xs" style={{ color: '#666' }}>{c.tenants?.phone || '—'}</p>
                        </div>
                        <div>
                          <p style={{ color: '#f5f0e8' }}>{c.units?.buildings?.name}</p>
                          <p className="text-xs" style={{ color: '#666' }}>وحدة {c.units?.unit_number}</p>
                        </div>
                        <span style={{ color: '#34d399' }}>{c.totalPaid.toLocaleString()} ر.س</span>
                        <span style={{ color: '#aaa' }}>{c.totalExpected.toLocaleString()} ر.س</span>
                        <span className="font-bold" style={{ color: '#ef4444' }}>{c.remaining.toLocaleString()} ر.س</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
