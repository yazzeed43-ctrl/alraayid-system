'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ContractsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])

  const [tenantId, setTenantId] = useState("")
  const [unitId, setUnitId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [rentAmount, setRentAmount] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchTenants()
    fetchUnits()
    fetchContracts()
  }, [])

  const fetchTenants = async () => {
    const { data } = await supabase.from("tenants").select("*")
    if (data) setTenants(data)
  }

  const fetchUnits = async () => {
    const { data } = await supabase.from("units").select("*")
    if (data) setUnits(data)
  }

  const fetchContracts = async () => {
    const { data } = await supabase
      .from("contracts")
      .select("*, tenants(full_name), units(unit_number)")
      .order("created_at", { ascending: false })

    if (data) setContracts(data)
  }

  const uploadFile = async () => {
    if (!file) return null

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("contracts")
      .upload(fileName, file)

    if (error) {
      console.error("خطأ الرفع:", error)
      alert("فشل رفع الملف")
      return null
    }

    const publicUrl = supabase.storage
      .from("contracts")
      .getPublicUrl(fileName).data.publicUrl

    return publicUrl
  }

  const addContract = async () => {
    if (!tenantId || !unitId) return alert("اختر المستأجر والوحدة")

    const fileUrl = await uploadFile()

    await supabase.from("contracts").insert([
      {
        tenant_id: tenantId,
        unit_id: unitId,
        start_date: startDate,
        end_date: endDate,
        rent_amount: Number(rentAmount),
        contract_file: fileUrl
      }
    ])

    setTenantId("")
    setUnitId("")
    setStartDate("")
    setEndDate("")
    setRentAmount("")
    setFile(null)

    fetchContracts()

    alert("تم إنشاء العقد بنجاح")
  }

  return (
    <main className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">إدارة العقود</h1>

      {/* نموذج إنشاء عقد */}
      <div className="bg-white p-6 rounded-xl shadow max-w-md mb-10">

        <select
          className="w-full mb-3 p-2 border rounded"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
        >
          <option value="">اختر المستأجر</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.full_name}
            </option>
          ))}
        </select>

        <select
          className="w-full mb-3 p-2 border rounded"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
        >
          <option value="">اختر الوحدة</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              وحدة {unit.unit_number}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <input
          type="number"
          placeholder="قيمة الإيجار"
          className="w-full mb-3 p-2 border rounded"
          value={rentAmount}
          onChange={(e) => setRentAmount(e.target.value)}
        />

        <input
          type="file"
          accept="application/pdf"
          className="w-full mb-3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={addContract}
          className="w-full bg-amber-800 text-white py-2 rounded"
        >
          إنشاء عقد
        </button>
      </div>

      {/* عرض العقود كرابط */}
      <div className="grid gap-4">
        {contracts.map((contract) => (
          <Link
            href={`/contracts/${contract.id}`}
            key={contract.id}
            className="bg-white p-4 rounded-lg shadow block hover:shadow-lg transition"
          >
            <h3 className="font-bold">
              {contract.tenants?.full_name}
            </h3>
            <p>الوحدة: {contract.units?.unit_number}</p>
            <p>من: {contract.start_date}</p>
            <p>إلى: {contract.end_date}</p>
            <p>الإيجار: {contract.rent_amount}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}