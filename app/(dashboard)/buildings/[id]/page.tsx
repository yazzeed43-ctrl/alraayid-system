'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useRole } from "@/hooks/useRole"

export default function BuildingDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { isAdmin, loading: roleLoading } = useRole()
  const [units, setUnits] = useState<any[]>([])
  const [building, setBuilding] = useState<any>(null)
  const [unitNumber, setUnitNumber] = useState("")
  const [floor, setFloor] = useState("")
  const [rentPrice, setRentPrice] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  // Tenant form
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [tenantName, setTenantName] = useState("")
  const [tenantPhone, setTenantPhone] = useState("")
  const [addingTenant, setAddingTenant] = useState(false)

  // Edit unit
  const [editUnit, setEditUnit] = useState<any>(null)
  const [editUnitNumber, setEditUnitNumber] = useState("")
  const [editFloor, setEditFloor] = useState("")
  const [editRentPrice, setEditRentPrice] = useState("")

  // Edit tenant
  const [editTenant, setEditTenant] = useState<any>(null)
  const [editTenantName, setEditTenantName] = useState("")
  const [editTenantPhone, setEditTenantPhone] = useState("")

  const fetchBuilding = async () => {
    const { data } = await supabase.from("buildings").select("*").eq("id", id).single()
    if (data) setBuilding(data)
  }

  const fetchUnits = async () => {
    const { data } = await supabase
      .from("units")
      .select("*, tenants(id, full_name, phone)")
      .eq("building_id", id)
      .order("created_at", { ascending: false })
    if (data) setUnits(data)
    setLoading(false)
  }

  useEffect(() => {
    if (id) { fetchBuilding(); fetchUnits() }
  }, [id])

  const addUnit = async () => {
    if (!unitNumber) return alert("أدخل رقم الوحدة")
    setAdding(true)
    await supabase.from("units").insert([{
      building_id: id, unit_number: unitNumber,
      floor: Number(floor), rent_price: Number(rentPrice), status: "vacant",
    }])
    setUnitNumber(""); setFloor(""); setRentPrice("")
    setShowForm(false); setAdding(false); fetchUnits()
  }

  const addTenant = async () => {
    if (!tenantName) return alert("أدخل اسم المستأجر")
    setAddingTenant(true)
    await supabase.from("tenants").insert([{ full_name: tenantName, phone: tenantPhone, unit_id: selectedUnit.id }])
    await supabase.from("units").update({ status: "occupied" }).eq("id", selectedUnit.id)
    setTenantName(""); setTenantPhone(""); setSelectedUnit(null); setAddingTenant(false); fetchUnits()
  }

  const deleteUnit = async (unitId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوحدة؟")) return
    await supabase.from("tenants").delete().eq("unit_id", unitId)
    await supabase.from("units").delete().eq("id", unitId)
    fetchUnits()
  }

  const deleteTenant = async (tenantId: string, unitId: string) => {
    if (!confirm("هل أنت متأكد من حذف المستأجر؟")) return
    await supabase.from("tenants").delete().eq("id", tenantId)
    await supabase.from("units").update({ status: "vacant" }).eq("id", unitId)
    fetchUnits()
  }

  const saveEditUnit = async () => {
    await supabase.from("units").update({
      unit_number: editUnitNumber,
      floor: Number(editFloor),
      rent_price: Number(editRentPrice),
    }).eq("id", editUnit.id)
    setEditUnit(null); fetchUnits()
  }

  const saveEditTenant = async () => {
    await supabase.from("tenants").update({
      full_name: editTenantName,
      phone: editTenantPhone,
    }).eq("id", editTenant.id)
    setEditTenant(null); fetchUnits()
  }

  const openEditUnit = (unit: any) => {
    setEditUnit(unit)
    setEditUnitNumber(unit.unit_number)
    setEditFloor(unit.floor || "")
    setEditRentPrice(unit.rent_price || "")
  }

  const openEditTenant = (tenant: any) => {
    setEditTenant(tenant)
    setEditTenantName(tenant.full_name)
    setEditTenantPhone(tenant.phone || "")
  }

  const totalUnits = units.length
  const occupiedUnits = units.filter(u => u.status === "occupied").length
  const vacantUnits = units.filter(u => u.status !== "occupied").length
  const totalRevenue = units.filter(u => u.status === "occupied").reduce((sum, u) => sum + (u.rent_price || 0), 0)

  const statusLabel = (status: string) => {
    if (status === "occupied") return { label: "مؤجرة", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }
    return { label: "شاغرة", color: "bg-amber-500/20 text-amber-400 border border-amber-500/30" }
  }

  const inputStyle = { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f5f0e8' }

  if (roleLoading) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div style={{ color: '#C9A96E' }}>جاري التحقق من الصلاحيات...</div>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a', color: '#f5f0e8' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-sm px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#1a1a1a', color: '#C9A96E', border: '1px solid #2a2a2a' }}>
            ← رجوع
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#C9A96E' }}>{building?.name || 'تفاصيل المبنى'}</h1>
            <p className="text-sm mt-1" style={{ color: '#888' }}>{building?.location || ''}</p>
          </div>
        </div>
        {/* زر إضافة وحدة للأدمن فقط */}
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-lg font-medium"
            style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}>
            {showForm ? '✕ إغلاق' : '+ إضافة وحدة'}
          </button>
        )}
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

      {/* Add Unit Form - للأدمن فقط */}
      {isAdmin && showForm && (
        <div className="rounded-xl p-6 mb-8 max-w-lg" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: '#C9A96E' }}>إضافة وحدة جديدة</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>رقم الوحدة *</label>
              <input type="text" placeholder="مثال: A101" className="w-full p-3 rounded-lg outline-none"
                style={inputStyle} value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الدور</label>
                <input type="number" placeholder="1" className="w-full p-3 rounded-lg outline-none"
                  style={inputStyle} value={floor} onChange={(e) => setFloor(e.target.value)} />
              </div>
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>قيمة الإيجار (ر.س)</label>
                <input type="number" placeholder="0" className="w-full p-3 rounded-lg outline-none"
                  style={inputStyle} value={rentPrice} onChange={(e) => setRentPrice(e.target.value)} />
              </div>
            </div>
            <button onClick={addUnit} disabled={adding} className="w-full py-3 rounded-lg font-bold"
              style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: adding ? 0.7 : 1 }}>
              {adding ? 'جاري الإضافة...' : 'إضافة الوحدة'}
            </button>
          </div>
        </div>
      )}

      {/* Add Tenant Modal - للأدمن فقط */}
      {isAdmin && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-xl p-6 w-full max-w-md mx-4" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#C9A96E' }}>إضافة مستأجر</h2>
            <p className="text-sm mb-5" style={{ color: '#888' }}>وحدة {selectedUnit.unit_number}</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>اسم المستأجر *</label>
                <input type="text" placeholder="الاسم الكامل" className="w-full p-3 rounded-lg outline-none"
                  style={inputStyle} value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>رقم الجوال</label>
                <input type="text" placeholder="05xxxxxxxx" className="w-full p-3 rounded-lg outline-none"
                  style={inputStyle} value={tenantPhone} onChange={(e) => setTenantPhone(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setSelectedUnit(null); setTenantName(""); setTenantPhone("") }}
                  className="flex-1 py-3 rounded-lg font-medium"
                  style={{ backgroundColor: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}>إلغاء</button>
                <button onClick={addTenant} disabled={addingTenant} className="flex-1 py-3 rounded-lg font-bold"
                  style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: addingTenant ? 0.7 : 1 }}>
                  {addingTenant ? 'جاري الإضافة...' : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Unit Modal - للأدمن فقط */}
      {isAdmin && editUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-xl p-6 w-full max-w-md mx-4" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
            <h2 className="text-lg font-bold mb-5" style={{ color: '#C9A96E' }}>تعديل الوحدة</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>رقم الوحدة</label>
                <input type="text" className="w-full p-3 rounded-lg outline-none"
                  style={inputStyle} value={editUnitNumber} onChange={(e) => setEditUnitNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الدور</label>
                  <input type="number" className="w-full p-3 rounded-lg outline-none"
                    style={inputStyle} value={editFloor} onChange={(e) => setEditFloor(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الإيجار (ر.س)</label>
                  <input type="number" className="w-full p-3 rounded-lg outline-none"
                    style={inputStyle} value={editRentPrice} onChange={(e) => setEditRentPrice(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditUnit(null)} className="flex-1 py-3 rounded-lg font-medium"
                  style={{ backgroundColor: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}>إلغاء</button>
                <button onClick={saveEditUnit} className="flex-1 py-3 rounded-lg font-bold"
                  style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}>حفظ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal - للأدمن فقط */}
      {isAdmin && editTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-xl p-6 w-full max-w-md mx-4" style={{ backgroundColor: '#111', border: '1px solid #C9A96E33' }}>
            <h2 className="text-lg font-bold mb-5" style={{ color: '#C9A96E' }}>تعديل المستأجر</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الاسم</label>
                <input type="text" className="w-full p-3 rounded-lg outline-none"
                  style={inputStyle} value={editTenantName} onChange={(e) => setEditTenantName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: '#aaa' }}>الجوال</label>
                <input type="text" className="w-full p-3 rounded-lg outline-none"
                  style={inputStyle} value={editTenantPhone} onChange={(e) => setEditTenantPhone(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditTenant(null)} className="flex-1 py-3 rounded-lg font-medium"
                  style={{ backgroundColor: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}>إلغاء</button>
                <button onClick={saveEditTenant} className="flex-1 py-3 rounded-lg font-bold"
                  style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}>حفظ</button>
              </div>
            </div>
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
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#C9A96E' }}>الوحدات ({totalUnits})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => {
              const { label, color } = statusLabel(unit.status)
              const tenant = unit.tenants?.[0]
              return (
                <div key={unit.id} className="p-5 rounded-xl" style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold" style={{ color: '#f5f0e8' }}>وحدة {unit.unit_number}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${color}`}>{label}</span>
                      {/* أزرار التعديل والحذف للأدمن فقط */}
                      {isAdmin && (
                        <>
                          <button onClick={() => openEditUnit(unit)} className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: '#1a1a1a', color: '#C9A96E', border: '1px solid #2a2a2a' }}>✏️</button>
                          <button onClick={() => deleteUnit(unit.id)} className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: '#1a1a1a', color: '#ef4444', border: '1px solid #2a2a2a' }}>🗑️</button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
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
                    {tenant && (
                      <div className="pt-2 mt-2" style={{ borderTop: '1px solid #1e1e1e' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm" style={{ color: '#34d399' }}>{tenant.full_name}</p>
                            <p className="text-xs" style={{ color: '#666' }}>{tenant.phone || '—'}</p>
                          </div>
                          {/* أزرار تعديل وحذف المستأجر للأدمن فقط */}
                          {isAdmin && (
                            <div className="flex gap-2">
                              <button onClick={() => openEditTenant(tenant)} className="text-xs px-2 py-1 rounded"
                                style={{ backgroundColor: '#1a1a1a', color: '#C9A96E', border: '1px solid #2a2a2a' }}>✏️</button>
                              <button onClick={() => deleteTenant(tenant.id, unit.id)} className="text-xs px-2 py-1 rounded"
                                style={{ backgroundColor: '#1a1a1a', color: '#ef4444', border: '1px solid #2a2a2a' }}>🗑️</button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* زر إضافة مستأجر للأدمن فقط */}
                  {isAdmin && unit.status !== "occupied" && (
                    <button onClick={() => setSelectedUnit(unit)} className="w-full py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: '#1a1a1a', color: '#C9A96E', border: '1px solid #C9A96E33' }}>
                      + إضافة مستأجر
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
