'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [buildings, setBuildings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)

  // Filters
  const [filterBuilding, setFilterBuilding] = useState("")
  const [filterTenant, setFilterTenant] = useState("")

  // Form
  const [contractId, setContractId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState("")

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const [{ data: p }, { data: c }, { data: b }] = await Promise.all([
      supabase
        .from("payments")
        .select(`
          *,
          contracts(
            id, rent_amount, start_date, end_date,
            tenants(id, full_name, phone),
            units(id, unit_number, buildings(id, name))
          )
        `)
        .order("payment_date", { ascending: false }),
      supabase
        .from("contracts")
        .select(`
          id, rent_amount, start_date, end_date,
          tenants(id, full_name),
          units(id, unit_number, buildings(id, name))
        `)
        .order("created_at", { ascending: false }),
      supabase.from("buildings").select("*"),
    ])
    if (p) setPayments(p)
    if (c) setContracts(c)
    if (b) setBuildings(b)
    setLoading(false)
  }

  const addPayment = async () => {
    if (!contractId || !amount) return alert("اختر العقد وأدخل المبلغ")
    setAdding(true)
    await supabase.from("payments").insert([{
      contract_id: contractId,
      amount: Number(amount),
      payment_date: paymentDate || new Date().toISOString().split("T")[0],
    }])
    setContractId(""); setAmount(""); setPaymentDate("")
    setShowForm(false); setAdding(false)
    fetchAll()
  }

  // فلترة الدفعات
  const filtered = payments.filter(p => {
    const buildingName = p.contracts?.units?.buildings?.name || ""
    const tenantName = p.contracts?.tenants?.full_name || ""
    const matchBuilding = filterBuilding ? buildingName === filterBuilding : true
    const matchTenant = filterTenant ? tenantName.includes(filterTenant) : true
    return matchBuilding && matchTenant
  })

  // إجماليات
  const totalPaid = filtered.reduce((sum, p) => sum + (p.amount || 0), 0)

  // حساب المتبقي: مجموع الإيجارات السنوية - المدفوع
  const totalExpected = contracts.reduce((sum, c) => {
    const months = Math.ceil(
      (new Date(c.end_date).getTime() - new Date(c.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    return sum + (c.rent_amount || 0) * months
  }, 0)
  const totalRemaining = Math.max(0, totalExpected - payments.reduce((sum, p) => sum + (p.amount || 0), 0))

  return (
    <main dir="rtl" className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>الإيجارات</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>متابعة المدفوعات والإيجارات</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
        >
          {showForm ? '✕ إغلاق' : '+ إضافة دفعة'}
        </button>
      </header>

      <div className="p-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            <div className="text-2xl mb-2">💰</div>
            <div className="text-2xl font-bold" style={{ color: '#C9A96E' }}>
              {loading ? "..." : totalPaid.toLocaleString()} ر.س
            </div>
            <div className="text-xs mt-1" style={{ color: '#888' }}>إجمالي المدفوع</div>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            <div className="text-2xl mb-2">⏳</div>
            <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>
              {loading ? "..." : totalRemaining.toLocaleString()} ر.س
            </div>
            <div className="text-xs mt-1" style={{ color: '#888' }}>إجمالي المتبقي</div>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            <div className="text-2xl mb-2">📋</div>
            <div className="text-2xl font-bold" style={{ color: '#34d399' }}>
              {loading ? "..." : filtered.length}
            </div>
            <div className="text-xs mt-1" style={{ color: '#888' }}>عدد الدفعات</div>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="rounded-xl p-6 mb-6 max-w-lg" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
            <h2 className="text-lg font-bold mb-5" style={{ color: '#C9A96E' }}>إضافة دفعة جديدة</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>العقد / المستأجر *</label>
                <select className="w-full p-3 rounded-lg outline-none"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                  value={contractId} onChange={(e) => setContractId(e.target.value)}>
                  <option value="">اختر العقد</option>
                  {contracts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.tenants?.full_name} — وحدة {c.units?.unit_number} ({c.units?.buildings?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>المبلغ (ر.س) *</label>
                  <input type="number" placeholder="0" className="w-full p-3 rounded-lg outline-none"
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                    value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>تاريخ الدفع</label>
                  <input type="date" className="w-full p-3 rounded-lg outline-none"
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                    value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                </div>
              </div>
              <button onClick={addPayment} disabled={adding} className="w-full py-3 rounded-lg font-bold"
                style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: adding ? 0.7 : 1 }}>
                {adding ? 'جاري الإضافة...' : 'تسجيل الدفعة'}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            className="px-4 py-2.5 rounded-lg outline-none text-sm"
            style={{ backgroundColor: '#111', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
          >
            <option value="">كل العمائر</option>
            {buildings.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
          <input
            type="text"
            placeholder="ابحث باسم المستأجر..."
            className="px-4 py-2.5 rounded-lg outline-none text-sm flex-1"
            style={{ backgroundColor: '#111', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
            value={filterTenant}
            onChange={(e) => setFilterTenant(e.target.value)}
          />
          {(filterBuilding || filterTenant) && (
            <button
              onClick={() => { setFilterBuilding(""); setFilterTenant("") }}
              className="px-4 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}
            >
              مسح الفلتر
            </button>
          )}
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            <div className="text-5xl mb-4">💰</div>
            <p className="text-lg mb-2" style={{ color: '#888' }}>لا توجد دفعات</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            {/* Table Header */}
            <div className="grid grid-cols-5 px-5 py-3 text-xs font-bold"
              style={{ backgroundColor: '#161616', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
              <span>المستأجر</span>
              <span>العمارة / الوحدة</span>
              <span>المبلغ</span>
              <span>تاريخ الدفع</span>
              <span>العقد</span>
            </div>
            {/* Rows */}
            {filtered.map((p) => (
              <div key={p.id} className="grid grid-cols-5 px-5 py-4 text-sm items-center"
                style={{ borderBottom: '1px solid #1a1a1a' }}>
                <div>
                  <p className="font-medium" style={{ color: '#f5f0e8' }}>
                    {p.contracts?.tenants?.full_name || '—'}
                  </p>
                  <p className="text-xs" style={{ color: '#666' }}>
                    {p.contracts?.tenants?.phone || ''}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#f5f0e8' }}>{p.contracts?.units?.buildings?.name || '—'}</p>
                  <p className="text-xs" style={{ color: '#666' }}>وحدة {p.contracts?.units?.unit_number || '—'}</p>
                </div>
                <span className="font-bold text-base" style={{ color: '#34d399' }}>
                  {p.amount?.toLocaleString()} ر.س
                </span>
                <span style={{ color: '#aaa' }}>{p.payment_date || '—'}</span>
                <span className="text-xs px-2 py-1 rounded-full w-fit"
                  style={{ backgroundColor: '#C9A96E22', color: '#C9A96E', border: '1px solid #C9A96E33' }}>
                  {p.contracts?.rent_amount?.toLocaleString()} ر.س/شهر
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
