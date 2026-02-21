'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ContractDetails() {
  const { id } = useParams()

  const [contract, setContract] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [amount, setAmount] = useState("")

  useEffect(() => {
    if (id) {
      fetchContract()
      fetchPayments()
    }
  }, [id])

  const fetchContract = async () => {
    const { data } = await supabase
      .from("contracts")
      .select("*, tenants(full_name), units(unit_number)")
      .eq("id", id)
      .single()

    if (data) setContract(data)
  }

  const fetchPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("contract_id", id)
      .order("payment_date", { ascending: false })

    if (data) setPayments(data)
  }

  const addPayment = async () => {
    if (!amount) return alert("أدخل مبلغ الدفعة")

    await supabase.from("payments").insert([
      {
        contract_id: id,
        amount: Number(amount),
        payment_date: new Date().toISOString().split("T")[0]
      }
    ])

    setAmount("")
    fetchPayments()
  }

  if (!contract) return <div className="p-10">جاري التحميل...</div>

  const start = new Date(contract.start_date)
  const today = new Date()

  const months =
    (today.getFullYear() - start.getFullYear()) * 12 +
    (today.getMonth() - start.getMonth()) + 1

  const totalDue = months * contract.rent_amount

  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  )

  const remaining = totalDue - totalPaid

  return (
    <main className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">تفاصيل العقد</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p>المستأجر: {contract.tenants?.full_name}</p>
        <p>الوحدة: {contract.units?.unit_number}</p>
        <p>الإيجار الشهري: {contract.rent_amount}</p>
        <p>المستحق حتى اليوم: {totalDue}</p>
        <p>المدفوع: {totalPaid}</p>
        <p className={remaining > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
          المتبقي: {remaining}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-md">
        <h2 className="font-bold mb-4">إضافة دفعة</h2>
        <input
          type="number"
          placeholder="المبلغ"
          className="w-full mb-3 p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={addPayment}
          className="w-full bg-amber-800 text-white py-2 rounded"
        >
          تسجيل دفعة
        </button>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white p-4 rounded-lg shadow">
            <p>المبلغ: {payment.amount}</p>
            <p>التاريخ: {payment.payment_date}</p>
          </div>
        ))}
      </div>
    </main>
  )
}