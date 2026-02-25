export default function DashboardPage() {
  const stats = [
    {
      label: "إجمالي العمائر",
      value: "0",
      change: "لا توجد بيانات",
      changeType: "neutral",
      color: "#6B3A2A",
      bg: "rgba(107,58,42,0.1)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "إجمالي الوحدات",
      value: "0",
      change: "لا توجد بيانات",
      changeType: "neutral",
      color: "#A0654A",
      bg: "rgba(201,169,110,0.15)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="16" y2="10" />
        </svg>
      ),
    },
    {
      label: "المستأجرون النشطون",
      value: "0",
      change: "نسبة إشغال 0%",
      changeType: "neutral",
      color: "#288C50",
      bg: "rgba(40,140,80,0.1)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: "الدخل الشهري (ريال)",
      value: "0",
      change: "لا توجد بيانات",
      changeType: "neutral",
      color: "#C83C28",
      bg: "rgba(200,60,40,0.1)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
  ];

  return (
    <div dir="rtl">
      {/* Topbar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{
          background: "white",
          borderBottom: "1px solid #F0E8DC",
          boxShadow: "0 2px 8px rgba(61,35,20,0.08)",
        }}
      >
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#3D2314" }}>لوحة التحكم</h1>
          <p className="text-sm mt-0.5" style={{ color: "#A08070" }}>
            {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ background: "#FAF6F0", border: "1px solid #F0E8DC", color: "#6B4C38" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6B3A2A, #3D2314)",
              boxShadow: "0 3px 10px rgba(61,35,20,0.2)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            إضافة جديد
          </button>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-7">
          {stats.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: "white",
                border: "1px solid #F0E8DC",
                boxShadow: "0 2px 12px rgba(61,35,20,0.08)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-1 h-full rounded-r-2xl"
                style={{ background: "linear-gradient(to bottom, #C9A96E, #A0654A)" }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="text-3xl font-extrabold mb-1" style={{ color: "#3D2314" }}>{s.value}</div>
              <div className="text-sm" style={{ color: "#A08070" }}>{s.label}</div>
              <div className="text-xs font-semibold mt-2" style={{ color: "#A08070" }}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Tenants */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "white", border: "1px solid #F0E8DC", boxShadow: "0 2px 12px rgba(61,35,20,0.08)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: "#3D2314" }}>آخر المستأجرين</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-10" style={{ color: "#A08070" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 mb-3 opacity-30">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <p className="text-sm">لا يوجد مستأجرون بعد</p>
            </div>
          </div>

          {/* Expiring Contracts */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "white", border: "1px solid #F0E8DC", boxShadow: "0 2px 12px rgba(61,35,20,0.08)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: "#3D2314" }}>عقود قاربت على الانتهاء</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-10" style={{ color: "#A08070" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 mb-3 opacity-30">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-sm">لا توجد عقود منتهية</p>
            </div>
          </div>
        </div>

        {/* Income by building */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "white", border: "1px solid #F0E8DC", boxShadow: "0 2px 12px rgba(61,35,20,0.08)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold" style={{ color: "#3D2314" }}>الدخل حسب العمارة</h2>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "#FAF6F0", color: "#6B4C38", border: "1px solid #F0E8DC" }}
            >
              ريال سعودي
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-10" style={{ color: "#A08070" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 mb-3 opacity-30">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="text-sm">لا توجد بيانات دخل بعد</p>
          </div>
        </div>
      </div>
    </div>
  );
}
