export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          نظام الرائد لإدارة الأملاك
        </h1>
        <p className="mt-4 text-gray-600">
          منصة متكاملة لإدارة العمائر والمستأجرين والدخل والتقارير
        </p>

        <a
          href="/login"
          className="mt-6 inline-block px-6 py-2 bg-amber-800 text-white rounded-lg"
        >
          تسجيل الدخول
        </a>
      </div>
    </main>
  );
}