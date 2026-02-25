export default function ReportsPage() {
  return (
    <div dir="rtl">
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "white", borderBottom: "1px solid #F0E8DC", boxShadow: "0 2px 8px rgba(61,35,20,0.08)" }}
      >
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#3D2314" }}>التقارير</h1>
          <p className="text-sm mt-0.5" style={{ color: "#A08070" }}>تقارير الأداء المالي والإشغال</p>
        </div>
      </header>
      <div className="p-8">
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center"
          style={{ background: "white", border: "1px solid #F0E8DC" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 mb-4" style={{ color: "#C9A96E", opacity: 0.5 }}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <p className="text-lg font-bold mb-2" style={{ color: "#3D2314" }}>لا توجد تقارير بعد</p>
          <p className="text-sm" style={{ color: "#A08070" }}>التقارير ستظهر بعد إضافة البيانات</p>
        </div>
      </div>
    </div>
  );
}
