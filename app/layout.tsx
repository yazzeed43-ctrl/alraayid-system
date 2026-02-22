import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-amber-900 text-white p-6 space-y-6">
            <h1 className="text-2xl font-bold">نظام الرائد</h1>

            <nav className="space-y-3">
              <Link href="/dashboard" className="block hover:text-yellow-300">
                لوحة التحكم
              </Link>

              <Link href="/buildings" className="block hover:text-yellow-300">
                العمائر
              </Link>

              <Link href="/tenants" className="block hover:text-yellow-300">
                المستأجرين
              </Link>

              <Link href="/contracts" className="block hover:text-yellow-300">
                العقود
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-10">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}