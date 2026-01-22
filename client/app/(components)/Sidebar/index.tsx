"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setIsSidebarCollapsed } from "@/lib/store/slices/globalSlice";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Settings,
  ChevronRight,
  ChevronLeft,
  CircleUser,
  LogOut,
  Search
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, isCollapsed, isActive }: SidebarLinkProps) => {
  return (
    <Link href={href} className="block group">
      <div
        className={`relative flex items-center gap-3 px-4 py-3.5 mx-3 rounded-xl 
          transition-all duration-300 ${isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)]"
            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
          } ${isCollapsed ? "justify-center px-2" : ""}`}
      >
        <Icon
          size={22}
          className={`shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"
            }`}
        />
        {!isCollapsed && (
          <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
            {label}
          </span>
        )}

        {/* Active Indicator Glow */}
        {isActive && !isCollapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        )}

        {/* Tooltip for collapsed mode */}
        {isCollapsed && (
          <div className="absolute right-full mr-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </div>
    </Link>
  );
};



const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const pathname = usePathname();

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isCollapsed));
  };

  const menuItems = [
    { href: "/", icon: LayoutDashboard, label: "الرئيسية" },
    { href: "/department", icon: BookOpen, label: "الأقسام" },
    { href: "/student", icon: Users, label: "الطلاب" },
    { href: "/course", icon: GraduationCap, label: "الدورات" },
    { href: "/enrollment", icon: ClipboardList, label: "التسجيل" },
    { href: "/setting", icon: Settings, label: "ضبط" }
  ];

  const bottomItems = [
    { href: "/settings", icon: Settings, label: "الإعدادات" },
  ];

  return (
    <aside
      className={`fixed right-0 top-0 h-screen bg-[#0f172a] text-white transition-all duration-500 ease-in-out z-50 border-l border-slate-800 shadow-2xl ${isCollapsed ? "w-20" : "w-72"
        }`}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-48 -left-24 w-48 h-48 bg-indigo-600 rounded-full blur-[80px]" />
      </div>

      <div className="relative h-full flex flex-col z-10">
        {/* Logo Section */}
        <div className="p-6 mb-4">
          <div className={`flex items-center gap-3 transition-all duration-500 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="relative group" onClick={toggleSidebar}>
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-50" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center border border-white/20 shadow-xl cursor-pointer">
                <GraduationCap size={24} className="text-white" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">
                  نظام الطلاب
                </span>

              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -left-3 top-24 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[#0f172a] hover:bg-blue-500 transition-colors cursor-pointer shadow-lg z-20"
        >
          {isCollapsed ? (
            <ChevronRight size={14} className="text-white" />
          ) : (
            <ChevronLeft size={14} className="text-white" />
          )}
        </button>

        {/* Search Bar - hidden when collapsed */}
        {!isCollapsed && (
          <div className="px-6 mb-8">
            <div className="relative group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-1 custom-scrollbar">
          {!isCollapsed && (
            <p className="px-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              القائمة الرئيسية
            </p>
          )}
          {menuItems.map((item) => (
            <SidebarLink
              key={item.href}
              {...item}
              isCollapsed={isCollapsed}
              isActive={pathname === item.href}
            />
          ))}

          {!isCollapsed && (
            <p className="px-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-3">
              أدوات النظام
            </p>
          )}
          {bottomItems.map((item) => (
            <SidebarLink
              key={item.href}
              {...item}
              isCollapsed={isCollapsed}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* User Profile / Footer Section */}
        <div className="p-4 mt-auto">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 ${isCollapsed ? "justify-center px-2" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 shrink-0">
              <CircleUser size={24} className="text-slate-400" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">مستخدم افتراضي</p>
                <p className="text-xs text-slate-500 truncate">مسؤول النظام</p>
              </div>
            )}
            {!isCollapsed && (
              <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex justify-between items-center mt-4 px-2">
              <span className="text-[10px] text-slate-600 font-medium uppercase">MTT © 2026</span>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-600">نشط</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;