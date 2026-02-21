'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<any[]>([])
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [totalUnits, setTotalUnits] = useState("")

  const fetchBuildings = async () => {
    const { data } = await supabase
      .from("buildings")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setBuildings(data)
  }

  useEffect(() => {
    fetchBuildings()
  }, [])

  const addBuilding = async () => {
    if (!name) return alert("أدخل اسم العمارة")

    await supabase.from("buildings").insert([
      {
        name,
        location,
        total_units: Number(totalUnits)
      }
    ])

    setName("")
    setLocation("")
    setTotalUnits("")
    fetchBuildings()
  }

  return (
    <main className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">إدارة العمائر</h1>

      {/* إضافة عمارة */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">إضافة عمارة جديدة</h2>

        <input
          type="text"
          placeholder="اسم العمارة"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="الموقع"
          className="w-full mb-3 p-2 border rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="عدد الوحدات"
          className="w-full mb-3 p-2 border rounded"
          value={totalUnits}
          onChange={(e) => setTotalUnits(e.target.value)}
        />

        <button
          onClick={addBuilding}
          className="w-full bg-amber-800 text-white py-2 rounded"
        >
          إضافة
        </button>
      </div>

      {/* عرض العمائر */}
      <div className="grid gap-4">
        {buildings.map((building) => (
          <a
            href={`/buildings/${building.id}`}
            key={building.id}
            className="bg-white p-4 rounded-lg shadow block"
          >
            <h3 className="text-lg font-bold">{building.name}</h3>
            <p className="text-gray-600">الموقع: {building.location}</p>
            <p className="text-gray-600">
              عدد الوحدات: {building.total_units}
            </p>
          </a>
        ))}
      </div>
    </main>
  )
}