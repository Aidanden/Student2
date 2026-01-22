import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

      <div className="max-w-6xl text-center space-y-8 bg-white p-10 rounded-4xl shadow-xl">
        <h1 className="text-5xl font-extrabold 
        text-indigo-900 tracking-tight">
          نظام إدارة الطلاب
        </h1>
        <p className="text-xl text-gray-600">
          مرحباً بك في لوحة التحكم. يمكنك إدارة الأقسام والطلاب والدورات التدريبية من هنا.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2
         gap-4 mt-8">
          <Link
            href="/department"
            className="group block p-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all transform 
            hover:-translate-y-1 shadow-lg"
          >
            <span className="text-xl font-bold">إدارة الأقسام</span>
            <p className="text-indigo-200 text-sm mt-2">إضافة، حذف، وتعديل أقسام الكلية</p>
          </Link>

          <Link
            href="/student"
            className="group block p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all transform 
            hover:-translate-y-1 shadow-lg"
          >
            <span className="text-xl font-bold">إدارة الطلاب</span>
            <p className="text-green-200 text-sm mt-2">إضافة، حذف، وتعديل الطلاب</p>
          </Link>
          <Link
            href="/course"
            className="group block p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all transform 
            hover:-translate-y-1 shadow-lg"
          >
            <span className="text-xl font-bold">إدارة الكورسات</span>
            <p className="text-white text-sm mt-2">إضافة، حذف، وتعديل الكورسات</p>
          </Link>
           <Link
            href="/enrollment"
            className="group block p-6 bg-yallow-700 text-black rounded-xl hover:bg-yallow-900 transition-all transform 
            hover:-translate-y-1 shadow-lg"
          >
            <span className="text-xl font-bold">إدارة التسجيل</span>
            <p className="text-black text-sm mt-2">إضافة، حذف، وتعديل التسجيل</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
