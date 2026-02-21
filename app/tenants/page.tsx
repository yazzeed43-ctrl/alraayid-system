'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [unitId, setUnitId] = useState("")
  const [rentAmount, setRentAmount] = useState("")
  const [startDate, setStartDate] = useState("")

  const fetchTenants = async () => {
    const { data } = await supabase
      .from("tenants")
      .select("*, units(unit_number)")
      .order("created_at", { ascending: false })

    if (data) setTenants(data)
  }

  const fetchUnits = async () => {
    const { data } = await supabase
      .from("units")
      .select("*")
      .eq("status", "شاغرة")

    if (data) setUnits(data)
  }

  useEffect(() => {
    fetchTenants()
    fetchUnits()
  }, [])

  const addTenant = async () => {
    if (!fullName || !unitId) return alert("أدخل الاسم واختر الوحدة")

    await supabase.from("tenants").insert([
      {
        full_name: fullName,
        phone,
        unit_id: unitId,
        rent_amount: Number(rentAmount),
        start_date: startDate
      }
    ])

    // تحديث حالة الوحدة إلى مؤجرة
    await supabase
      .from("units")
      .update({ status: "مؤجرة" })
      .eq("id", unitId)

    setFullName("")
    setPhone("")
    setUnitId("")
    setRentAmount("")
    setStartDate("")

    fetchTenants()
    fetchUnits()
  }

  return (
    <main className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">إدارة المستأجرين</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">إضافة مستأجر</h2>

        <input
          type="text"
          placeholder="اسم المستأجر"
          className="w-full mb-3 p-2 border rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="text"
          placeholder="رقم الجوال"
          className="w-full mb-3 p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="w-full mb-3 p-2 border rounded"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
        >
          <option value="">اختر وحدة شاغرة</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              وحدة {unit.unit_number}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="قيمة الإيجار"
          className="w-full mb-3 p-2 border rounded"
          value={rentAmount}
          onChange={(e) => setRentAmount(e.target.value)}
        />

        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <button
          onClick={addTenant}
          className="w-full bg-amber-800 text-white py-2 rounded"
        >
          إضافة
        </button>
      </div>

      <div className="grid gap-4">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{tenant.full_name}</h3>
            <p>الجوال: {tenant.phone}</p>
            <p>الوحدة: {tenant.units?.unit_number}</p>
            <p>الإيجار: {tenant.rent_amount}</p>
          </div>
        ))}
      </div>
    </main>
  )
}