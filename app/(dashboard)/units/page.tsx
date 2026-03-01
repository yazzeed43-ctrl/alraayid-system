'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function UnitsPage() {
  const router = useRouter()
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    const { data } = await supabase
      .from("units")
      .select("*, buildings(name), tenants(full_name, phone)")
      .order("created_at", { ascending: false })
    if (data) setUnits(data)
    setLoading(false)
  }

  const filtered = units.filter(u => {
    const matchSearch = u.unit_number?.includes(search) || u.buildings?.name?.includes(search)
    const matchFilter =
      filter === "all" ||
      (filter === "مؤجرة" && u.status === "مؤجرة") ||
      (filter === "شاغرة" && u.status !== "مؤجرة")
    return matchSearch && matchFilter
  })

  const statusLabel = (status: string) => {
    if (status === "مؤجرة") return { label: "مؤجرة", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }
    return { label: "شاغرة", color: "bg-amber-500/20 text-amber-400 border border-amber-500/30" }
  }

  const deleteUnit = async (e: React.MouseEvent, unit: any) => {
    e.stopPropagation()
    if (unit.status === "مؤجرة") return alert("لا يمكن حذف وحدة مؤجرة، احذف المستأجر أولاً")
    const confirmed = window.confirm(`هل تريد حذف الوحدة ${unit.unit_number}؟`)
    if (!confirmed) return
    setDeletingId(unit.id)
    await supabase.from("units").delete().eq("id", unit.id)
    setDeletingId(null)
    fetchUnits()
  }

  return (
    <main dir="rtl" className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>الوحدات</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>جميع الوحدات السكنية</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'إجمالي الوحدات', value: units.length, icon: '🏢', color: '#C9A96E' },
          { label: 'مؤجرة', value: units.filter(u => u.status === "مؤجرة").length, icon: '✅', color: '#34d399' },
          { label: 'شاغرة', value: units.filter(u => u.status !== "مؤجرة").length, icon: '🔓', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: '#888' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="بحث..."
          className="flex-1 p-3 rounded-lg outline-none text-sm"
          style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', color: '#f5f0e8' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {["all", "مؤجرة", "شاغرة"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: filter === f ? '#C9A96E' : '#111',
              color: filter === f ? '#0a0a0a' : '#888',
              border: '1px solid #1e1e1e'
            }}>
            {f === "all" ? "الكل" : f}
          </button>
        ))}
      </div>

      {/* Units Table */}
      {loading ? (
        <div className="text-center py-20" style={{ color: '#555' }}>جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
          <p style={{ color: '#888' }}>لا توجد وحدات</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e1e' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#111', borderBottom: '1px solid #1e1e1e' }}>
                {['رقم الوحدة', 'العمارة', 'الدور', 'الإيجار', 'المستأجر', 'الحالة', ''].map(h => (
                  <th key={h} className="text-right p-4 text-sm font-medium" style={{ color: '#888' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((unit, i) => {
                const { label, color } = statusLabel(unit.status)
                const tenant = unit.tenants?.[0]
                return (
                  <tr key={unit.id}
                    onClick={() => router.push(`/buildings/${unit.building_id}`)}
                    className="cursor-pointer transition-all hover:bg-white/5"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #1a1a1a' : 'none', backgroundColor: '#0d0d0d' }}>
                    <td className="p-4 font-bold" style={{ color: '#f5f0e8' }}>وحدة {unit.unit_number}</td>
                    <td className="p-4 text-sm" style={{ color: '#aaa' }}>{unit.buildings?.name || '—'}</td>
                    <td className="p-4 text-sm" style={{ color: '#aaa' }}>{unit.floor || '—'}</td>
                    <td className="p-4 text-sm font-bold" style={{ color: '#C9A96E' }}>{unit.rent_price?.toLocaleString()} ر.س</td>
                    <td className="p-4 text-sm" style={{ color: tenant ? '#34d399' : '#555' }}>{tenant?.full_name || '—'}</td>
                    <td className="p-4"><span className={`text-xs px-3 py-1 rounded-full ${color}`}>{label}</span></td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => deleteUnit(e, unit)}
                        disabled={deletingId === unit.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: deletingId === unit.id ? "rgba(239,68,68,0.4)" : "#EF4444",
                          border: "1px solid rgba(239,68,68,0.2)"
                        }}>
                        {deletingId === unit.id ? "..." : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                            حذف
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
