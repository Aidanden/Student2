import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col justify-center p-4">
      <div className="max-w-6xl mx-auto w-full text-center space-y-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-10 shadow-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            نظام إدارة الطلاب
          </h1>
          <p className="text-lg text-slate-400 mt-4">
            مرحباً بك في لوحة التحكم. يمكنك إدارة الأقسام والطلاب والدورات التدريبية من هنا.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/department"
            className="group block p-6 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-indigo-600/20 transition-all duration-300 shadow-lg"
          >
            <span className="text-xl font-bold text-white">إدارة الأقسام</span>
            <p className="text-slate-400 text-sm mt-2">إضافة، حذف، وتعديل أقسام الكلية</p>
          </Link>

          <Link
            href="/student"
            className="group block p-6 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-indigo-600/20 transition-all duration-300 shadow-lg"
          >
            <span className="text-xl font-bold text-white">إدارة الطلاب</span>
            <p className="text-slate-400 text-sm mt-2">إضافة، حذف، وتعديل الطلاب</p>
          </Link>

          <Link
            href="/course"
            className="group block p-6 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-indigo-600/20 transition-all duration-300 shadow-lg"
          >
            <span className="text-xl font-bold text-white">إدارة الكورسات</span>
            <p className="text-slate-400 text-sm mt-2">إضافة، حذف، وتعديل الكورسات</p>
          </Link>

          <Link
            href="/enrollment"
            className="group block p-6 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-indigo-600/20 transition-all duration-300 shadow-lg"
          >
            <span className="text-xl font-bold text-white">إدارة التسجيل</span>
            <p className="text-slate-400 text-sm mt-2">إضافة، حذف، وتعديل التسجيل</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
