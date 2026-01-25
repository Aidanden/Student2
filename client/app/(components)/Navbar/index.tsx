"use client";

import {
  Menu,
  Moon,
  Sun,
  Bell,
  Settings,
  User,
  ChevronDown
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };



  return (
    <nav className="sticky top-0 z-40 w-full transition-all duration-300 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">

          {/* Right Side: Toggle & Search */}
          <div className="flex items-center flex-1 gap-4">


            {/* Premium Search Bar */}
            <div className="relative items-center hidden max-w-md lg:flex group">


            </div>
          </div>

          {/* Left Side: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Quick Actions */}
            <div className="flex items-center gap-1 p-1 ">


              <button className="relative p-2 transition-all rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400">
                <Bell size={18} />
                <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-100 dark:border-slate-800" />
              </button>

              <button className="hidden p-2 transition-all rounded-lg sm:block text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400">
                <Settings size={18} />
              </button>
            </div>

            {/* Vertical Divider */}
            <div className="hidden w-px h-8 bg-slate-200 dark:bg-slate-700 sm:block" />

            {/* User Profile Hook */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 transition-opacity cursor-pointer group" onClick={handleLogout}>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{user?.username || "مستخدم"}</p>
                  <p className="text-[10px] text-red-500 dark:text-red-400">تسجيل الخروج</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px]">
                    <div className="flex items-center justify-center w-full h-full bg-white dark:bg-[#0f172a] rounded-[10px] overflow-hidden">
                      <User size={20} className="text-slate-400" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تسجيل الدخول
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;