'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function BuildingDetails() {
  const { id } = useParams()
  const router = useRouter()
  const [units, setUnits] = useState<any[]>([])
  const [building, setBuilding] = useState<any>(null)
  const [unitNumber, setUnitNumber] = useState("")
  const [floor, setFloor] = useState("")
  const [rentPrice, setRentPrice] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const fetchBuilding = async () => {
    const { data } = await supabase
      .from("buildings")
      .select("*")
      .eq("id", id)
      .single()
    if (data) setBuilding(data)
  }

  const fetchUnits = async () => {
    const { data } = await supabase
      .from("units")
      .select("*")
      .eq("building_id", id)
      .order("created_at", { ascending: false })
    if (data) setUnits(data)
    setLoading(false)
  }

  useEffect(() => {
    if (id) {
      fetchBuilding()
      fetchUnits()
    }
  }, [id])

  const addUnit = async () => {
    if (!unitNumber) return alert("أدخل رقم الوحدة")
    setAdding(true)
    await supabase.from("units").insert([
      {
        building_id: id,
        unit_number: unitNumber,
        floor: Number(floor),
        rent_price: Number(rentPrice),
        status: "vacant",
      }
    ])
    setUnitNumber("")
    setFloor("")
    setRentPrice("")
    setShowForm(false)
    setAdding(false)
    fetchUnits()
  }

  const totalUnits = units.length
  const occupiedUnits = units.filter(u => u.status === "occupied").length
  const vacantUnits = units.filter(u => u.status !== "occupied").length
  const totalRevenue = units
    .filter(u => u.status === "occupied")
    .reduce((sum, u) => sum + (u.rent_price || 0), 0)

  const statusLabel = (status: string) => {
    if (status === "occupied") return { label: "مؤجرة", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }
    return { label: "شاغرة", color: "bg-amber-500/20 text-amber-400 border border-amber-500/30" }
  }

  return (
    <main dir="rtl" className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all"
            style={{ backgroundColor: '#1a1a1a', color: '#C9A96E', border: '1px solid #2a2a2a' }}
          >
            ← رجوع
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>
              {building?.name || 'تفاصيل المبنى'}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#888' }}>
              {building?.address || ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
        >
          {showForm ? '✕ إغلاق' : '+ إضافة وحدة'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'إجمالي الوحدات', value: totalUnits, icon: '🏢', color: '#C9A96E' },
          { label: 'مؤجرة', value: occupiedUnits, icon: '✅', color: '#34d399' },
          { label: 'شاغرة', value: vacantUnits, icon: '🔓', color: '#f59e0b' },
          { label: 'الإيرادات الشهرية', value: totalRevenue.toLocaleString() + ' ر.س', icon: '💰', color: '#C9A96E' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs mt-1" style={{ color: '#888' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Unit Form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-8 max-w-lg" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: '#C9A96E' }}>إضافة وحدة جديدة</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>رقم الوحدة *</label>
              <input
                type="text"
                placeholder="مثال: A101"
                className="w-full p-3 rounded-lg outline-none transition-all"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الدور</label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full p-3 rounded-lg outline-none"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>قيمة الإيجار (ر.س)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full p-3 rounded-lg outline-none"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={addUnit}
              disabled={adding}
              className="w-full py-3 rounded-lg font-bold transition-all mt-1"
              style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: adding ? 0.7 : 1 }}
            >
              {adding ? 'جاري الإضافة...' : 'إضافة الوحدة'}
            </button>
          </div>
        </div>
      )}

      {/* Units List */}
      {loading ? (
        <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div>
      ) : units.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-5xl mb-4">🏢</div>
          <p className="text-lg mb-2" style={{ color: '#888' }}>لا توجد وحدات بعد</p>
          <p className="text-sm" style={{ color: '#555' }}>ابدأ بإضافة وحدات لهذا المبنى</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#C9A96E' }}>
            الوحدات ({totalUnits})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => {
              const { label, color } = statusLabel(unit.status)
              return (
                <div
                  key={unit.id}
                  className="p-5 rounded-xl transition-all cursor-pointer hover:scale-[1.02]"
                  style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold" style={{ color: '#f5f0e8' }}>
                      وحدة {unit.unit_number}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${color}`}>
                      {label}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#888' }}>الدور</span>
                      <span style={{ color: '#f5f0e8' }}>{unit.floor || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#888' }}>الإيجار الشهري</span>
                      <span style={{ color: '#C9A96E', fontWeight: 'bold' }}>
                        {unit.rent_price ? unit.rent_price.toLocaleString() + ' ر.س' : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
