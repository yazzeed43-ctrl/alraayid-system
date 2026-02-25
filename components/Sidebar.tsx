"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    section: "الرئيسية",
    items: [
      {
        label: "لوحة التحكم",
        href: "/dashboard",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "إدارة الأصول",
    items: [
      {
        label: "العمائر",
        href: "/buildings",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        label: "الوحدات",
        href: "/units",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "المستأجرون",
    items: [
      {
        label: "المستأجرين",
        href: "/tenants",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        label: "العقود",
        href: "/contracts",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "المالية",
    items: [
      {
        label: "الإيجارات",
        href: "/payments",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        ),
      },
      {
        label: "التقارير",
        href: "/reports",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      dir="rtl"
      className="fixed right-0 top-0 bottom-0 w-64 flex flex-col z-50"
      style={{ background: "#3D2314", boxShadow: "-4px 0 20px rgba(61,35,20,0.22)" }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ background: "linear-gradient(135deg, #C9A96E, #A0654A)" }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="text-white text-xl font-extrabold">نظام الرائد</div>
        <div className="text-xs mt-1" style={{ color: "#C9A96E" }}>إدارة الأملاك العقارية</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section}>
            <p
              className="text-xs font-bold px-3 mb-2 mt-5 tracking-widest uppercase"
              style={{ color: "rgba(201,169,110,0.55)" }}
            >
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-200"
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, #C9A96E, #A0654A)",
                          color: "white",
                          boxShadow: "0 4px 14px rgba(201,169,110,0.35)",
                        }
                      : { color: "rgba(255,255,255,0.65)" }
                  }
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(201,169,110,0.15)" }}>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #C9A96E, #A0654A)" }}
          >
            ر
          </div>
          <div>
            <div className="text-white text-sm font-semibold">مكتب الرائد</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>مدير النظام</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
