export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">
        لوحة تحكم نظام الرائد
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <a
          href="/buildings"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">إدارة العمائر</h2>
          <p className="text-gray-600">
            إضافة وعرض جميع العمائر
          </p>
        </a>

        <div className="bg-white p-6 rounded-xl shadow opacity-50">
          <h2 className="text-xl font-bold mb-2">المستأجرين</h2>
          <p className="text-gray-600">
            قريبًا
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow opacity-50">
          <h2 className="text-xl font-bold mb-2">التقارير</h2>
          <p className="text-gray-600">
            قريبًا
          </p>
        </div>

      </div>
    </main>
  )
}