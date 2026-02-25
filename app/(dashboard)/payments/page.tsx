export default function PaymentsPage() {
  return (
    <div dir="rtl">
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: "white", borderBottom: "1px solid #F0E8DC", boxShadow: "0 2px 8px rgba(61,35,20,0.08)" }}
      >
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#3D2314" }}>الإيجارات</h1>
          <p className="text-sm mt-0.5" style={{ color: "#A08070" }}>متابعة المدفوعات والإيجارات</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6B3A2A, #3D2314)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          إضافة دفعة
        </button>
      </header>
      <div className="p-8">
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center"
          style={{ background: "white", border: "1px solid #F0E8DC" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 mb-4" style={{ color: "#C9A96E", opacity: 0.5 }}>
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          <p className="text-lg font-bold mb-2" style={{ color: "#3D2314" }}>لا توجد مدفوعات بعد</p>
          <p className="text-sm" style={{ color: "#A08070" }}>ابدأ بتسجيل دفعات الإيجار</p>
        </div>
      </div>
    </div>
  );
}
