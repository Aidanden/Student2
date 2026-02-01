"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    clearError,
} from "@/lib/store/slices/studentSlice";
import { fetchDepartments } from "@/lib/store/slices/departmentSlice";
import { Student } from "@/types/student.types";

export default function StudentPage() {
    // Redux State
    const dispatch = useAppDispatch();
    const { students, loading, error } = useAppSelector((state) => state.students);
    const { departments } = useAppSelector((state) => state.departments);

    // Local UI State
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newDeptId, setNewDeptId] = useState<number | "">("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editDeptId, setEditDeptId] = useState<number | "">("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Fetch students and departments on mount
  

useEffect(() => {
   dispatch(fetchStudents());
        dispatch(fetchDepartments());
        }, [dispatch]);

   
    // Handlers
    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) {
            alert("الرجاء إدخال اسم الطالب");
            return;
        }
        if (!newEmail.trim()) {
            alert("الرجاء إدخال البريد الإلكتروني");
            return;
        }
        if (newDeptId === "") {
            alert("الرجاء اختيار القسم");
            return;
        }

        try {
            await dispatch(
                createStudent({ 
                    name: newName, 
                    email: newEmail, 
                    deptId: newDeptId as number 
                })
            ).unwrap();
            setNewName("");
            setNewEmail("");
            setNewDeptId("");
            alert("تم إضافة الطالب بنجاح!");
        } catch (err: any) {
            alert("فشل إضافة الطالب: " + err);
        }
    };

    const handleUpdateStudent = async (id: number) => {
        if (!editName.trim()) {
            alert("الرجاء إدخال اسم الطالب");
            return;
        }
        if (!editEmail.trim()) {
            alert("الرجاء إدخال البريد الإلكتروني");
            return;
        }
        if (editDeptId === "") {
            alert("الرجاء اختيار القسم");
            return;
        }

        try {
            await dispatch(
                updateStudent({ 
                    id, 
                    data: { 
                        name: editName, 
                        email: editEmail, 
                        deptId: editDeptId as number 
                    } 
                })
            ).unwrap();
            setEditingId(null);
            setEditName("");
            setEditEmail("");
            setEditDeptId("");
            alert("تم تحديث الطالب بنجاح!");
        } catch (err: any) {
            alert("فشل تحديث الطالب: " + err);
        }
    };

    const handleDeleteStudent = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا الطالب؟")) return;

        try {
            await dispatch(deleteStudent(id)).unwrap();
            alert("تم حذف الطالب بنجاح!");
        } catch (err: any) {
            alert("فشل حذف الطالب: " + err);
        }
    };

    const startEdit = (student: Student) => {
        setEditingId(student.id);
        setEditName(student.name);
        setEditEmail(student.email);
        setEditDeptId(student.deptId);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditEmail("");
        setEditDeptId("");
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    const getDepartmentName = (deptId: number) => {
        const dept = departments.find((d) => d.id === deptId);
        return dept ? dept.name : `القسم ${deptId}`;
    };

    return (
        <div className="min-h-[calc(100vh-64px)] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-slate-800/60 border border-slate-700 p-6 rounded-xl shadow-xl">
                    <h1 className="text-2xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">إدارة الطلاب</h1>
                    <Link 
                        href="/" 
                        className="px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-200 border border-slate-600 font-medium transition-all"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                <form onSubmit={handleAddStudent} className="p-8 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-slate-200">إضافة طالب جديد</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="اسم الطالب"
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="البريد الإلكتروني"
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                        <select
                            value={newDeptId}
                            onChange={(e) => setNewDeptId(e.target.value ? parseInt(e.target.value) : "")}
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                        >
                            <option value="">اختر القسم</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                    >
                        إضافة
                    </button>
                </form>

                {/* Loading/Error States */}
                {loading ? (
                    <div className="text-center p-12 bg-slate-800/60 border border-slate-700 rounded-xl">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-blue-500 mb-4"></div>
                        <p className="text-slate-400 text-lg">جاري تحميل البيانات...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 bg-red-900/20 border border-red-700/50 rounded-xl">
                        <p className="text-red-300 text-lg font-semibold">خطأ: {error}</p>
                        <div className="flex gap-4 justify-center mt-4">
                            <button 
                                onClick={() => dispatch(fetchStudents())}
                                className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-500 transition"
                            >
                                إعادة المحاولة
                            </button>
                            <button 
                                onClick={handleClearError}
                                className="bg-slate-600 text-white px-6 py-2 rounded-xl hover:bg-slate-500 transition"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
                            <p className="text-slate-300 text-lg">
                                <span className="font-bold text-blue-400">عدد الطلاب:</span> {students.length}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all"
                                >
                                    <div className="p-6">
                                        {editingId === student.id ? (
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                                                        ID: {student.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        placeholder="اسم الطالب"
                                                        className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="email"
                                                        value={editEmail}
                                                        onChange={(e) => setEditEmail(e.target.value)}
                                                        placeholder="البريد الإلكتروني"
                                                        className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                    />
                                                    <select
                                                        value={editDeptId}
                                                        onChange={(e) => setEditDeptId(e.target.value ? parseInt(e.target.value) : "")}
                                                        className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                    >
                                                        <option value="">اختر القسم</option>
                                                        {departments.map((dept) => (
                                                            <option key={dept.id} value={dept.id}>
                                                                {dept.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => handleUpdateStudent(student.id)}
                                                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-500 transition font-semibold"
                                                    >
                                                        ✓ حفظ
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-500 transition font-semibold"
                                                    >
                                                        ✕ إلغاء
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                                                        ID: {student.id}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">{student.name}</h3>
                                                        <p className="text-slate-400">{student.email}</p>
                                                    </div>
                                                    <span className="text-sm bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                                                        {getDepartmentName(student.deptId)}
                                                    </span>
                                                    {student.enrollments && student.enrollments.length > 0 && (
                                                        <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                                                            {student.enrollments.length} مادة مسجلة
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(student.id)}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition font-semibold"
                                                    >
                                                        {expandedId === student.id ? "▲ إخفاء" : "▼ تفاصيل"}
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(student)}
                                                        className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {expandedId === student.id && (
                                        <div className="border-t border-slate-700 bg-slate-900/40 p-6">
                                            <h4 className="text-lg font-bold text-slate-200 mb-3">المواد المسجلة</h4>
                                            {student.enrollments && student.enrollments.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {student.enrollments.map((enrollment) => (
                                                        <div key={enrollment.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                                                            <p className="font-semibold text-white">رقم المادة: {enrollment.courseId}</p>
                                                            <p className="text-sm text-slate-400">الدرجة: {enrollment.grade !== null ? enrollment.grade : "لم تحدد بعد"}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 italic">لا توجد مواد مسجلة لهذا الطالب</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {students.length === 0 && (
                                <div className="text-center p-12 bg-slate-800/60 border border-slate-700 rounded-xl">
                                    <p className="text-slate-400 text-lg">لا يوجد طلاب بعد. قم بإضافة طالب جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
