export default function DashboardPage() {
  const stats = [
    {
      label: "إجمالي العمائر",
      value: "0",
      sub: "لا توجد عمائر بعد",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
        </svg>
      ),
    },
    {
      label: "إجمالي الوحدات",
      value: "0",
      sub: "لا توجد وحدات بعد",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      ),
    },
    {
      label: "المستأجرون النشطون",
      value: "0",
      sub: "نسبة إشغال 0%",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      ),
    },
    {
      label: "الدخل الشهري",
      value: "0 ر",
      sub: "لا توجد مدفوعات بعد",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div dir="rtl" style={{ background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Topbar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{
          background: "#0A0A0A",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, #C9A96E, #8B6914)",
              color: "white",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            إضافة جديد
          </button>
        </div>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "rgba(201,169,110,0.1)", color: "#C9A96E" }}
              >
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Tenants */}
          <div className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">آخر المستأجرين</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10 mb-3" style={{ color: "rgba(255,255,255,0.1)" }}>
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
              </svg>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>لا يوجد مستأجرون بعد</p>
            </div>
          </div>

          {/* Contracts */}
          <div className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">عقود قاربت على الانتهاء</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10 mb-3" style={{ color: "rgba(255,255,255,0.1)" }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد عقود منتهية</p>
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">الدخل حسب العمارة</h2>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>ريال سعودي</span>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10 mb-3" style={{ color: "rgba(255,255,255,0.1)" }}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد بيانات دخل بعد</p>
          </div>
        </div>
      </div>
    </div>
  );
}
