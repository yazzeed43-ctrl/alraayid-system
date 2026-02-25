export default function UnitsPage() {
  return (
    <div dir="rtl">
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "white", borderBottom: "1px solid #F0E8DC", boxShadow: "0 2px 8px rgba(61,35,20,0.08)" }}
      >
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#3D2314" }}>الوحدات</h1>
          <p className="text-sm mt-0.5" style={{ color: "#A08070" }}>إدارة جميع الوحدات السكنية</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6B3A2A, #3D2314)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          إضافة وحدة
        </button>
      </header>
      <div className="p-8">
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center"
          style={{ background: "white", border: "1px solid #F0E8DC" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 mb-4" style={{ color: "#C9A96E", opacity: 0.5 }}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
          </svg>
          <p className="text-lg font-bold mb-2" style={{ color: "#3D2314" }}>لا توجد وحدات بعد</p>
          <p className="text-sm" style={{ color: "#A08070" }}>ابدأ بإضافة وحداتك السكنية</p>
        </div>
      </div>
    </div>
  );
}
