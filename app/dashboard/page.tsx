'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const [stats, setStats] = useState({
    buildings: 0,
    units: 0,
    tenants: 0,
    payments: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {

    // عدد العمائر
    const { count: buildings } = await supabase
      .from("buildings")
      .select("*", { count: "exact", head: true })

    // عدد الوحدات
    const { count: units } = await supabase
      .from("units")
      .select("*", { count: "exact", head: true })

    // عدد المستأجرين
    const { count: tenants } = await supabase
      .from("tenants")
      .select("*", { count: "exact", head: true })

    // جلب الدفعات
    const { data: paymentsData, error } = await supabase
      .from("payments")
      .select("amount")

    if (error) {
      console.error("خطأ في جلب الدفعات:", error)
    }

    // حساب إجمالي الدخل
    const totalPayments =
      paymentsData?.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      ) || 0

    setStats({
      buildings: buildings || 0,
      units: units || 0,
      tenants: tenants || 0,
      payments: totalPayments,
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        لوحة تحكم نظام الرائد
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">عدد العمائر</p>
          <h2 className="text-2xl font-bold">
            {stats.buildings}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">عدد الوحدات</p>
          <h2 className="text-2xl font-bold">
            {stats.units}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">عدد المستأجرين</p>
          <h2 className="text-2xl font-bold">
            {stats.tenants}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">إجمالي الدخل</p>
          <h2 className="text-2xl font-bold text-green-600">
            {stats.payments} ريال
          </h2>
        </div>

      </div>
    </div>
  )
}