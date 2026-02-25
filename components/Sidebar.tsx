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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
          </svg>
        ),
      },
      {
        label: "الوحدات",
        href: "/units",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
            <circle cx="9" cy="7" r="4" />
            <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" />
          </svg>
        ),
      },
      {
        label: "العقود",
        href: "/contracts",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="12" y2="17" />
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        ),
      },
      {
        label: "التقارير",
        href: "/reports",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
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
      className="fixed right-0 top-0 bottom-0 w-60 flex flex-col z-50"
      style={{
        background: "#0A0A0A",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #C9A96E 0%, #8B6914 100%)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" strokeWidth={0} fillRule="evenodd"/>
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" stroke="white" strokeWidth={1.5} fill="none"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wide">الرائد</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>إدارة الأملاك</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section} className="mb-4">
            <p
              className="text-xs px-3 mb-1.5 font-medium tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-150"
                  style={
                    active
                      ? {
                          background: "rgba(201,169,110,0.12)",
                          color: "#C9A96E",
                        }
                      : {
                          color: "rgba(255,255,255,0.45)",
                        }
                  }
                >
                  <span style={{ color: active ? "#C9A96E" : "rgba(255,255,255,0.3)" }}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <span
                      className="mr-auto w-1 h-1 rounded-full"
                      style={{ background: "#C9A96E" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)" }}
          >
            ر
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">مكتب الرائد</div>
            <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>مدير النظام</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
