"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearError,
} from "@/lib/store/slices/departmentSlice";
import { Department } from "@/types/department.types";

export default function DepartmentPage() {
    // Redux State
    const dispatch = useAppDispatch();
    const { departments, loading, error } = useAppSelector((state) => state.departments);

    // Local UI State
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Fetch departments on mount
    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    // Handlers
    const handleAddDepartment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) {
            alert("الرجاء إدخال اسم القسم");
            return;
        }

        try {
            await dispatch(createDepartment({ name: newName })).unwrap();
            setNewName("");
            alert(" تم إضافة القسم بنجاح!");
        } catch (err: any) {
            alert(" فشل إضافة القسم " + err);
        }
    };

    const handleUpdateDepartment = async (id: number) => {
        if (!editName.trim()) {
            alert("الرجاء إدخال اسم القسم");
            return;
        }

        try {
            await dispatch(updateDepartment({ id, data: { name: editName } })).unwrap();
            setEditingId(null);
            setEditName("");
            alert(" تم تحديث القسم بنجاح!");
        } catch (err: any) {
            alert(" فشل تحديث القسم " + err);
        }
    };

    const handleDeleteDepartment = async (id: number) => {
        if (!confirm(" هل أنت متأكد من حذف هذا القسم؟")) return;

        try {
            await dispatch(deleteDepartment(id)).unwrap();
            alert(" تم حذف القسم بنجاح!");
        } catch (err: any) {
            alert(" " + err);
        }
    };

    const startEdit = (dept: Department) => {
        setEditingId(dept.id);
        setEditName(dept.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-100 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
                    <div>
                        <h1 className="text-4xl font-bold text-indigo-900 mb-2"> إدارة الأقسام</h1>
                    </div>
                    <Link 
                        href="/" 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-1 shadow-md"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Add Form */}
                <form onSubmit={handleAddDepartment} className="mb-8 p-8 bg-white rounded-xl shadow-lg border-2 border-indigo-100">
                    <h2 className="text-2xl font-bold mb-6 text-indigo-800 flex items-center gap-2">
                         إضافة قسم جديد
                    </h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="اسم القسم (مثال: علوم الحاسوب، الهندسة، الطب)"
                            className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-md font-bold text-lg"
                        >
                            إضافة
                        </button>
                    </div>
                </form>

                {/* Loading/Error States */}
                {loading ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 bg-red-50 rounded-xl shadow-lg border-2 border-red-200">
                        <p className="text-red-600 text-lg font-semibold"> خطأ: {error}</p>
                        <div className="flex gap-4 justify-center mt-4">
                            <button 
                                onClick={() => dispatch(fetchDepartments())}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                إعادة المحاولة
                            </button>
                            <button 
                                onClick={handleClearError}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Statistics */}
                        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                            <p className="text-gray-700 text-lg">
                                <span className="font-bold text-indigo-600">عدد الأقسام:</span> {departments.length}
                            </p>
                        </div>

                        {/* Departments List */}
                        <div className="space-y-4">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Department Header */}
                                    <div className="p-6">
                                        {editingId === dept.id ? (
                                            // Edit Mode
                                            <div className="flex gap-3 items-center">
                                                <span className="text-sm font-mono bg-indigo-100 text-indigo-800 px-3 py-1 rounded">
                                                    ID: {dept.id}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="flex-1 p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleUpdateDepartment(dept.id)}
                                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                                                >
                                                    ✓ حفظ
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                                                >
                                                    ✕ إلغاء
                                                </button>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-mono bg-indigo-100 text-indigo-800 px-3 py-1 rounded">
                                                        ID: {dept.id}
                                                    </span>
                                                    <h3 className="text-2xl font-bold text-gray-800">{dept.name}</h3>
                                                    <div className="flex gap-2">
                                                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                             {dept.students?.length || 0} طالب
                                                        </span>
                                                        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                                             {dept.courses?.length || 0} مادة
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(dept.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                                                    >
                                                        {expandedId === dept.id ? "▲ إخفاء التفاصيل" : "▼ عرض التفاصيل"}
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(dept)}
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDepartment(dept.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                                                    >
                                                         حذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedId === dept.id && (
                                        <div className="border-t-2 border-gray-200 bg-gray-50 p-6 space-y-6">
                                            {/* Students */}
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                     الطلاب المسجلون
                                                </h4>
                                                {dept.students && dept.students.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {dept.students.map((student) => (
                                                            <div key={student.id} className="bg-white p-4 rounded-lg border border-gray-300">
                                                                <p className="font-semibold text-gray-800">{student.name}</p>
                                                                <p className="text-sm text-gray-600">{student.email}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 italic">لا يوجد طلاب مسجلون في هذا القسم</p>
                                                )}
                                            </div>

                                            {/* Courses */}
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    المواد الدراسية
                                                </h4>
                                                {dept.courses && dept.courses.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {dept.courses.map((course) => (
                                                            <div key={course.id} className="bg-white p-4 rounded-lg border border-gray-300">
                                                                <p className="font-semibold text-gray-800">{course.title}</p>
                                                                <p className="text-sm text-gray-600">الساعات المعتمدة: {course.credits}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 italic">لا توجد مواد دراسية في هذا القسم</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {departments.length === 0 && (
                                <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                                    <div className="text-6xl mb-4"></div>
                                    <p className="text-gray-600 text-lg">لا توجد أقسام بعد. قم بإضافة قسم جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
