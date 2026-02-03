"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/authApi";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await authApi.login({ username, password });
            dispatch(
                setCredentials({
                    user: {
                        id: data.user.id,
                        username: data.user.username,
                        permissions: data.user.permissions || [],
                    },
                    token: data.token,
                })
            );
            router.push("/");
        } catch (err: unknown) {
            setError((err as { message?: string })?.message || "فشل في تسجيل الدخول");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a] p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
                <div className="absolute bottom-48 -left-24 w-48 h-48 bg-indigo-600 rounded-full blur-[80px]" />
            </div>

            <div className="relative w-full max-w-md p-8 space-y-6 bg-slate-800/60 border border-slate-700 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">
                    تسجيل الدخول
                </h2>
                {error && (
                    <div className="p-3 text-sm text-red-300 bg-red-900/30 border border-red-700/50 rounded-xl">
                        {error}
                    </div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300">
                            اسم المستخدم
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                            placeholder="أدخل اسم المستخدم"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300">
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                            placeholder="أدخل كلمة المرور"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
