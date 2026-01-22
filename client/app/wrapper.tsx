"use client";

import Navbar from "@/app/(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import { useAppSelector } from "@/lib/store/hooks";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  return (
    <div
      dir="rtl"
      className={`bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 w-full min-h-screen flex transition-colors duration-300`}
    >
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-500 ease-in-out min-h-screen 
          ${isSidebarCollapsed ? "mr-20" : "mr-72"}`}
      >
        <Navbar />
        <main className="p-4 sm:p-6 bg-transparent min-h-[calc(100vh-64px)] transition-all duration-300">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

export default Wrapper;
