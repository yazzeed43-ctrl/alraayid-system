'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'income' | 'tenants' | 'late'>('income')

  const [buildings, setBuildings] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    const [{ data: b }, { data: c }, { data: p }] = await Promise.all([
      supabase.from("buildings").select("*, units(id, status, rent_price)"),
      supabase.from("contracts").select(`id, rent_amount, start_date, end_date, created_at, tenants(id, full_name, phone), units(id, unit_number, buildings(id, name))`).order("created_at", { ascending: false }),
      supabase.from("payments").select(`id, amount, payment_date, contract_id, contracts(id, rent_amount, start_date, end_date, tenants(id, full_name, phone), units(id, unit_number, buildings(id, name)))`).order("payment_date", { ascending: false }),
    ])
    if (b) setBuildings(b)
    if (c) setContracts(c)
    if (p) setPayments(p)
    setLoading(false)
  }

  const buildingIncomeReport = buildings.map(b => {
    const bp = payments.filter(p => p.contracts?.units?.buildings?.id === b.id)
    const totalPaid = bp.reduce((sum, p) => sum + (p.amount || 0), 0)
    const occupied = b.units?.filter((u: any) => u.status === "مؤجرة") || []
    const vacant = b.units?.filter((u: any) => u.status !== "مؤجرة") || []
    const monthlyExpected = occupied.reduce((sum: number, u: any) => sum + (u.rent_price || 0), 0)
    return { name: b.name, totalUnits: b.units?.length || 0, occupied: occupied.length, vacant: vacant.length, monthlyExpected, totalPaid }
  })

  const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const contractStatus = (endDate: string) => {
    const days = daysLeft(endDate)
    if (days < 0) return { label: "منتهي", color: "#ef4444" }
    if (days <= 30) return { label: `ينتهي بعد ${days} يوم`, color: "#f59e0b" }
    return { label: "ساري", color: "#34d399" }
  }

  const lateContracts = contracts.filter(c => {
    if (!c.end_date) return false
    const cp = payments.filter(p => p.contract_id === c.id)
    const totalPaid = cp.reduce((sum, p) => sum + (p.amount || 0), 0)
    const months = Math.ceil((new Date(c.end_date).getTime() - new Date(c.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
    return totalPaid < (c.rent_amount || 0) * months && daysLeft(c.end_date) > -365
  }).map(c => {
    const cp = payments.filter(p => p.contract_id === c.id)
    const totalPaid = cp.reduce((sum, p) => sum + (p.amount || 0), 0)
    const months = Math.ceil((new Date(c.end_date).getTime() - new Date(c.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
    const totalExpected = (c.rent_amount || 0) * months
    return { ...c, totalPaid, totalExpected, remaining: totalExpected - totalPaid }
  })

  const printReport = () => {
    const titles: Record<string, string> = { income: 'تقرير دخل العمائر', tenants: 'تقرير المستأجرين والعقود', late: 'تقرير الدفعات المتأخرة' }
    let tableHTML = ''

    if (activeTab === 'income') {
      tableHTML = `<table><thead><tr><th>العمارة</th><th>الوحدات</th><th>مؤجرة</th><th>شاغرة</th><th>الإيجار الشهري</th><th>إجمالي المدفوع</th></tr></thead><tbody>
        ${buildingIncomeReport.map(b => `<tr><td>${b.name}</td><td>${b.totalUnits}</td><td>${b.occupied}</td><td>${b.vacant}</td><td>${b.monthlyExpected.toLocaleString()} ر.س</td><td>${b.totalPaid.toLocaleString()} ر.س</td></tr>`).join('')}
      </tbody></table>`
    } else if (activeTab === 'tenants') {
      tableHTML = `<table><thead><tr><th>المستأجر</th><th>الجوال</th><th>العمارة</th><th>الوحدة</th><th>الإيجار</th><th>الانتهاء</th><th>الحالة</th></tr></thead><tbody>
        ${contracts.map(c => { const { label } = contractStatus(c.end_date); return `<tr><td>${c.tenants?.full_name||'—'}</td><td>${c.tenants?.phone||'—'}</td><td>${c.units?.buildings?.name||'—'}</td><td>${c.units?.unit_number||'—'}</td><td>${c.rent_amount?.toLocaleString()} ر.س</td><td>${c.end_date}</td><td>${label}</td></tr>` }).join('')}
      </tbody></table>`
    } else {
      tableHTML = `<table><thead><tr><th>المستأجر</th><th>الجوال</th><th>العمارة</th><th>الوحدة</th><th>المدفوع</th><th>المتوقع</th><th>المتبقي</th></tr></thead><tbody>
        ${lateContracts.map(c => `<tr><td>${c.tenants?.full_name||'—'}</td><td>${c.tenants?.phone||'—'}</td><td>${c.units?.buildings?.name||'—'}</td><td>${c.units?.unit_number||'—'}</td><td>${c.totalPaid.toLocaleString()} ر.س</td><td>${c.totalExpected.toLocaleString()} ر.س</td><td style="color:red;font-weight:bold">${c.remaining.toLocaleString()} ر.س</td></tr>`).join('')}
      </tbody></table>`
    }

    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>${titles[activeTab]}</title>
      <style>body{font-family:Arial,sans-serif;padding:30px;direction:rtl}h1{color:#8B6914}p{color:#888;font-size:13px;margin-bottom:20px}table{width:100%;border-collapse:collapse}th{background:#f5f0e8;padding:10px;text-align:right;border:1px solid #ddd;font-size:13px}td{padding:9px 10px;border:1px solid #eee;font-size:13px}tr:nth-child(even){background:#fafafa}</style>
    </head><body>
      <h1>الرائد للعقار</h1>
      <p>${titles[activeTab]} — ${new Date().toLocaleDateString('ar-SA')}</p>
      ${tableHTML}
    </body></html>`)
    w.document.close()
    w.print()
  }

  const tabs = [
    { id: 'income', label: '📊 دخل العمائر' },
    { id: 'tenants', label: '👤 المستأجرون والعقود' },
    { id: 'late', label: '⚠️ الدفعات المتأخرة' },
  ]

  return (
    <main dir="rtl" className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>التقارير</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>تقارير شاملة عن النظام</p>
        </div>
        <button onClick={printReport} className="px-5 py-2.5 rounded-lg font-medium"
          style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}>
          🖨️ طباعة / PDF
        </button>
      </header>

      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: activeTab === tab.id ? '#C9A96E' : '#111', color: activeTab === tab.id ? '#0a0a0a' : '#888', border: `1px solid ${activeTab === tab.id ? '#C9A96E' : '#2a2a2a'}` }}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div> : (
          <>
            {activeTab === 'income' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: '💰', val: payments.reduce((s,p) => s+(p.amount||0),0).toLocaleString()+' ر.س', label: 'إجمالي المدفوع', color: '#C9A96E' },
                    { icon: '🏢', val: buildings.reduce((s,b) => s+(b.units?.filter((u:any)=>u.status==="مؤجرة").length||0),0), label: 'وحدات مؤجرة', color: '#34d399' },
                    { icon: '🔓', val: buildings.reduce((s,b) => s+(b.units?.filter((u:any)=>u.status!=="مؤجرة").length||0),0), label: 'وحدات شاغرة', color: '#f59e0b' },
                  ].map((s,i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-xs mt-1" style={{ color: '#888' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                  <div className="grid grid-cols-6 px-5 py-3 text-xs font-bold" style={{ backgroundColor: '#161616', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
                    <span>العمارة</span><span>الوحدات</span><span>مؤجرة</span><span>شاغرة</span><span>الإيجار الشهري</span><span>إجمالي المدفوع</span>
                  </div>
                  {buildingIncomeReport.map((b,i) => (
                    <div key={i} className="grid grid-cols-6 px-5 py-4 text-sm" style={{ borderBottom: '1px solid #1a1a1a' }}>
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

            {activeTab === 'tenants' && (
              <div>
                <p className="text-sm mb-4" style={{ color: '#888' }}>إجمالي العقود: {contracts.length}</p>
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                  <div className="grid grid-cols-5 px-5 py-3 text-xs font-bold" style={{ backgroundColor: '#161616', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
                    <span>المستأجر</span><span>العمارة / الوحدة</span><span>الإيجار الشهري</span><span>تاريخ الانتهاء</span><span>الحالة</span>
                  </div>
                  {contracts.map(c => {
                    const { label, color } = contractStatus(c.end_date)
                    return (
                      <div key={c.id} className="grid grid-cols-5 px-5 py-4 text-sm" style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <div><p style={{ color: '#f5f0e8' }}>{c.tenants?.full_name}</p><p className="text-xs" style={{ color: '#666' }}>{c.tenants?.phone||'—'}</p></div>
                        <div><p style={{ color: '#f5f0e8' }}>{c.units?.buildings?.name}</p><p className="text-xs" style={{ color: '#666' }}>وحدة {c.units?.unit_number}</p></div>
                        <span style={{ color: '#C9A96E' }}>{c.rent_amount?.toLocaleString()} ر.س</span>
                        <span style={{ color: '#aaa' }}>{c.end_date}</span>
                        <span className="text-xs px-2 py-1 rounded-full w-fit" style={{ backgroundColor: color+'22', color, border: `1px solid ${color}33` }}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'late' && (
              <div>
                <p className="text-sm mb-4" style={{ color: '#ef4444' }}>{lateContracts.length} عقود فيها دفعات متأخرة</p>
                {lateContracts.length === 0 ? (
                  <div className="text-center py-20 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                    <div className="text-5xl mb-4">✅</div>
                    <p style={{ color: '#34d399' }}>لا توجد دفعات متأخرة</p>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                    <div className="grid grid-cols-5 px-5 py-3 text-xs font-bold" style={{ backgroundColor: '#161616', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
                      <span>المستأجر</span><span>العمارة / الوحدة</span><span>المدفوع</span><span>المتوقع</span><span>المتبقي</span>
                    </div>
                    {lateContracts.map(c => (
                      <div key={c.id} className="grid grid-cols-5 px-5 py-4 text-sm" style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <div><p style={{ color: '#f5f0e8' }}>{c.tenants?.full_name}</p><p className="text-xs" style={{ color: '#666' }}>{c.tenants?.phone||'—'}</p></div>
                        <div><p style={{ color: '#f5f0e8' }}>{c.units?.buildings?.name}</p><p className="text-xs" style={{ color: '#666' }}>وحدة {c.units?.unit_number}</p></div>
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
