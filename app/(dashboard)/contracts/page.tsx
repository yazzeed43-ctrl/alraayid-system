'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ContractsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  // Contract form
  const [tenantId, setTenantId] = useState("")
  const [unitId, setUnitId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [rentAmount, setRentAmount] = useState("")

  // Payment modal
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [payAmount, setPayAmount] = useState("")
  const [payDate, setPayDate] = useState("")
  const [addingPayment, setAddingPayment] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const [{ data: t }, { data: u }, { data: c }] = await Promise.all([
      supabase.from("tenants").select("*"),
      supabase.from("units").select("*"),
      supabase.from("contracts")
        .select("*, tenants(full_name), units(unit_number)")
        .order("created_at", { ascending: false }),
    ])
    if (t) setTenants(t)
    if (u) setUnits(u)
    if (c) setContracts(c)
    setLoading(false)
  }

  const addContract = async () => {
    if (!tenantId || !unitId) return alert("اختر المستأجر والوحدة")
    setAdding(true)
    await supabase.from("contracts").insert([{
      tenant_id: tenantId,
      unit_id: unitId,
      start_date: startDate,
      end_date: endDate,
      rent_amount: Number(rentAmount),
    }])
    setTenantId(""); setUnitId(""); setStartDate(""); setEndDate(""); setRentAmount("")
    setShowForm(false)
    setAdding(false)
    fetchAll()
  }

  const openPayments = async (contract: any) => {
    setSelectedContract(contract)
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("contract_id", contract.id)
      .order("payment_date", { ascending: false })
    setPayments(data || [])
  }

  const addPayment = async () => {
    if (!payAmount) return alert("أدخل المبلغ")
    setAddingPayment(true)
    await supabase.from("payments").insert([{
      contract_id: selectedContract.id,
      amount: Number(payAmount),
      payment_date: payDate || new Date().toISOString().split("T")[0],
    }])
    setPayAmount(""); setPayDate("")
    setAddingPayment(false)
    // Refresh payments
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("contract_id", selectedContract.id)
      .order("payment_date", { ascending: false })
    setPayments(data || [])
  }

  const totalPaid = (contractId: string) => {
    return payments
      .filter(p => p.contract_id === contractId)
      .reduce((sum, p) => sum + (p.amount || 0), 0)
  }

  const daysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const contractStatus = (endDate: string) => {
    const days = daysLeft(endDate)
    if (days < 0) return { label: "منتهي", color: "bg-red-500/20 text-red-400 border border-red-500/30" }
    if (days <= 30) return { label: `ينتهي بعد ${days} يوم`, color: "bg-amber-500/20 text-amber-400 border border-amber-500/30" }
    return { label: "ساري", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }
  }

  return (
    <main dir="rtl" className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>إدارة العقود</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>جميع العقود وتتبع الدفعات</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
        >
          {showForm ? '✕ إغلاق' : '+ إضافة عقد'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-2xl mb-2">📄</div>
          <div className="text-2xl font-bold" style={{ color: '#C9A96E' }}>{contracts.length}</div>
          <div className="text-xs mt-1" style={{ color: '#888' }}>إجمالي العقود</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold" style={{ color: '#34d399' }}>
            {contracts.filter(c => daysLeft(c.end_date) > 0).length}
          </div>
          <div className="text-xs mt-1" style={{ color: '#888' }}>عقود سارية</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
            {contracts.filter(c => daysLeft(c.end_date) <= 30 && daysLeft(c.end_date) > 0).length}
          </div>
          <div className="text-xs mt-1" style={{ color: '#888' }}>تنتهي قريباً</div>
        </div>
      </div>

      {/* Add Contract Form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-8 max-w-lg" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: '#C9A96E' }}>إضافة عقد جديد</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>المستأجر *</label>
              <select
                className="w-full p-3 rounded-lg outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
              >
                <option value="">اختر المستأجر</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الوحدة *</label>
              <select
                className="w-full p-3 rounded-lg outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
              >
                <option value="">اختر الوحدة</option>
                {units.map(u => <option key={u.id} value={u.id}>وحدة {u.unit_number}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>تاريخ البداية</label>
                <input type="date" className="w-full p-3 rounded-lg outline-none"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                  value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>تاريخ الانتهاء</label>
                <input type="date" className="w-full p-3 rounded-lg outline-none"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                  value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>قيمة الإيجار الشهري (ر.س)</label>
              <input type="number" placeholder="0" className="w-full p-3 rounded-lg outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} />
            </div>
            <button onClick={addContract} disabled={adding} className="w-full py-3 rounded-lg font-bold"
              style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: adding ? 0.7 : 1 }}>
              {adding ? 'جاري الإضافة...' : 'إنشاء العقد'}
            </button>
          </div>
        </div>
      )}

      {/* Payments Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold" style={{ color: '#C9A96E' }}>الدفعات</h2>
              <button onClick={() => setSelectedContract(null)} style={{ color: '#888' }}>✕</button>
            </div>
            <p className="text-sm mb-1" style={{ color: '#aaa' }}>
              {selectedContract.tenants?.full_name} — وحدة {selectedContract.units?.unit_number}
            </p>
            <p className="text-sm mb-5" style={{ color: '#888' }}>
              الإيجار السنوي: {(selectedContract.rent_amount * 12).toLocaleString()} ر.س
            </p>

            {/* Payment summary */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="text-xs mb-1" style={{ color: '#888' }}>المدفوع</div>
                <div className="font-bold" style={{ color: '#34d399' }}>
                  {payments.reduce((s, p) => s + p.amount, 0).toLocaleString()} ر.س
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="text-xs mb-1" style={{ color: '#888' }}>المتبقي</div>
                <div className="font-bold" style={{ color: '#ef4444' }}>
                  {Math.max(0, selectedContract.rent_amount * 12 - payments.reduce((s, p) => s + p.amount, 0)).toLocaleString()} ر.س
                </div>
              </div>
            </div>

            {/* Add payment */}
            <div className="rounded-lg p-4 mb-5" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#C9A96E' }}>إضافة دفعة</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#aaa' }}>المبلغ (ر.س)</label>
                  <input type="number" placeholder="0" className="w-full p-2.5 rounded-lg outline-none text-sm"
                    style={{ backgroundColor: '#111', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                    value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#aaa' }}>التاريخ</label>
                  <input type="date" className="w-full p-2.5 rounded-lg outline-none text-sm"
                    style={{ backgroundColor: '#111', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                    value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                </div>
              </div>
              <button onClick={addPayment} disabled={addingPayment} className="w-full py-2.5 rounded-lg font-bold text-sm"
                style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: addingPayment ? 0.7 : 1 }}>
                {addingPayment ? 'جاري الإضافة...' : '+ تسجيل دفعة'}
              </button>
            </div>

            {/* Payments list */}
            {payments.length === 0 ? (
              <p className="text-center text-sm py-4" style={{ color: '#555' }}>لا توجد دفعات مسجلة</p>
            ) : (
              <div className="space-y-2">
                <h3 className="text-sm font-bold mb-2" style={{ color: '#aaa' }}>سجل الدفعات</h3>
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-lg"
                    style={{ backgroundColor: '#1a1a1a' }}>
                    <span className="text-sm" style={{ color: '#888' }}>{p.payment_date}</span>
                    <span className="font-bold" style={{ color: '#34d399' }}>{p.amount.toLocaleString()} ر.س</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contracts List */}
      {loading ? (
        <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg mb-2" style={{ color: '#888' }}>لا توجد عقود بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts.map((contract) => {
            const { label, color } = contractStatus(contract.end_date)
            return (
              <div key={contract.id} className="p-5 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#f5f0e8' }}>{contract.tenants?.full_name}</h3>
                    <p className="text-sm" style={{ color: '#888' }}>وحدة {contract.units?.unit_number}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${color}`}>{label}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#888' }}>الإيجار الشهري</span>
                    <span style={{ color: '#C9A96E', fontWeight: 'bold' }}>{contract.rent_amount?.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#888' }}>من</span>
                    <span style={{ color: '#f5f0e8' }}>{contract.start_date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#888' }}>إلى</span>
                    <span style={{ color: '#f5f0e8' }}>{contract.end_date}</span>
                  </div>
                </div>
                <button
                  onClick={() => openPayments(contract)}
                  className="w-full py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: '#1a1a1a', color: '#C9A96E', border: '1px solid #C9A96E33' }}
                >
                  💰 الدفعات
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
