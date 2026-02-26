'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function BuildingsPage() {
  const router = useRouter()
  const [buildings, setBuildings] = useState<any[]>([])
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [totalUnits, setTotalUnits] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const fetchBuildings = async () => {
    const { data } = await supabase
      .from("buildings")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setBuildings(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchBuildings()
  }, [])

  const addBuilding = async () => {
    if (!name) return alert("أدخل اسم العمارة")
    setAdding(true)
    await supabase.from("buildings").insert([
      {
        name,
        address,
        total_units: Number(totalUnits),
      }
    ])
    setName("")
    setAddress("")
    setTotalUnits("")
    setShowForm(false)
    setAdding(false)
    fetchBuildings()
  }

  return (
    <main dir="rtl" className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>إدارة العمائر</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>جميع العمائر المسجلة في النظام</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
        >
          {showForm ? '✕ إغلاق' : '+ إضافة عمارة'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-2xl mb-2">🏢</div>
          <div className="text-2xl font-bold" style={{ color: '#C9A96E' }}>{buildings.length}</div>
          <div className="text-xs mt-1" style={{ color: '#888' }}>إجمالي العمائر</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-2xl mb-2">🚪</div>
          <div className="text-2xl font-bold" style={{ color: '#C9A96E' }}>
            {buildings.reduce((sum, b) => sum + (b.total_units || 0), 0)}
          </div>
          <div className="text-xs mt-1" style={{ color: '#888' }}>إجمالي الوحدات</div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-8 max-w-lg" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: '#C9A96E' }}>إضافة عمارة جديدة</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>اسم العمارة *</label>
              <input
                type="text"
                placeholder="مثال: عمارة الرائد"
                className="w-full p-3 rounded-lg outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الموقع</label>
              <input
                type="text"
                placeholder="مثال: حي النزهة، جدة"
                className="w-full p-3 rounded-lg outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>عدد الوحدات</label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-3 rounded-lg outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }}
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
              />
            </div>
            <button
              onClick={addBuilding}
              disabled={adding}
              className="w-full py-3 rounded-lg font-bold transition-all"
              style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: adding ? 0.7 : 1 }}
            >
              {adding ? 'جاري الإضافة...' : 'إضافة العمارة'}
            </button>
          </div>
        </div>
      )}

      {/* Buildings List */}
      {loading ? (
        <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div>
      ) : buildings.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <div className="text-5xl mb-4">🏢</div>
          <p className="text-lg mb-2" style={{ color: '#888' }}>لا توجد عمائر بعد</p>
          <p className="text-sm" style={{ color: '#555' }}>ابدأ بإضافة أول عمارة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildings.map((building) => (
            <div
              key={building.id}
              onClick={() => router.push(`/buildings/${building.id}`)}
              className="p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">🏢</div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#C9A96E22', color: '#C9A96E', border: '1px solid #C9A96E33' }}>
                  {building.total_units || 0} وحدة
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#f5f0e8' }}>{building.name}</h3>
              <p className="text-sm mb-4" style={{ color: '#888' }}>{building.address || 'لم يحدد الموقع'}</p>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1e1e1e' }}>
                <span className="text-xs" style={{ color: '#555' }}>اضغط للتفاصيل</span>
                <span style={{ color: '#C9A96E' }}>←</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
