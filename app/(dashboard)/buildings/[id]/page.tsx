'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function BuildingDetails() {
  const { id } = useParams()
  const [units, setUnits] = useState<any[]>([])
  const [unitNumber, setUnitNumber] = useState("")
  const [floor, setFloor] = useState("")
  const [rentPrice, setRentPrice] = useState("")

  const fetchUnits = async () => {
    const { data } = await supabase
      .from("units")
      .select("*")
      .eq("building_id", id)
      .order("created_at", { ascending: false })

    if (data) setUnits(data)
  }

  useEffect(() => {
    if (id) fetchUnits()
  }, [id])

  const addUnit = async () => {
    if (!unitNumber) return alert("أدخل رقم الوحدة")

    await supabase.from("units").insert([
      {
        building_id: id,
        unit_number: unitNumber,
        floor: Number(floor),
        rent_price: Number(rentPrice),
      }
    ])

    setUnitNumber("")
    setFloor("")
    setRentPrice("")
    fetchUnits()
  }

  return (
    <main className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">وحدات العمارة</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">إضافة وحدة</h2>

        <input
          type="text"
          placeholder="رقم الوحدة"
          className="w-full mb-3 p-2 border rounded"
          value={unitNumber}
          onChange={(e) => setUnitNumber(e.target.value)}
        />

        <input
          type="number"
          placeholder="الدور"
          className="w-full mb-3 p-2 border rounded"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        />

        <input
          type="number"
          placeholder="قيمة الإيجار"
          className="w-full mb-3 p-2 border rounded"
          value={rentPrice}
          onChange={(e) => setRentPrice(e.target.value)}
        />

        <button
          onClick={addUnit}
          className="w-full bg-amber-800 text-white py-2 rounded"
        >
          إضافة
        </button>
      </div>

      <div className="grid gap-4">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">الوحدة رقم {unit.unit_number}</h3>
            <p>الدور: {unit.floor}</p>
            <p>الإيجار: {unit.rent_price}</p>
            <p>الحالة: {unit.status}</p>
          </div>
        ))}
      </div>
    </main>
  )
}