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
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
                    <div>
                        <h1 className="text-4xl font-bold text-teal-900 mb-2">إدارة الطلاب</h1>
                    </div>
                    <Link 
                        href="/" 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-1 shadow-md"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Add Form */}
                <form onSubmit={handleAddStudent} className="mb-8 p-8 bg-white rounded-xl shadow-lg border-2 border-teal-100">
                    <h2 className="text-2xl font-bold mb-6 text-teal-800 flex items-center gap-2">
                        إضافة طالب جديد
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="اسم الطالب"
                            className="p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                        />
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="البريد الإلكتروني"
                            className="p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                        />
                        <select
                            value={newDeptId}
                            onChange={(e) => setNewDeptId(e.target.value ? parseInt(e.target.value) : "")}
                            className="p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
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
                        className="w-full bg-teal-600 text-white px-8 py-4 rounded-lg hover:bg-teal-700 transition-all transform hover:-translate-y-1 shadow-md font-bold text-lg"
                    >
                        إضافة
                    </button>
                </form>

                {/* Loading/Error States */}
                {loading ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mb-4"></div>
                        <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 bg-red-50 rounded-xl shadow-lg border-2 border-red-200">
                        <p className="text-red-600 text-lg font-semibold">خطأ: {error}</p>
                        <div className="flex gap-4 justify-center mt-4">
                            <button 
                                onClick={() => dispatch(fetchStudents())}
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
                                <span className="font-bold text-teal-600">عدد الطلاب:</span> {students.length}
                            </p>
                        </div>

                        {/* Students List */}
                        <div className="space-y-4">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Student Header */}
                                    <div className="p-6">
                                        {editingId === student.id ? (
                                            // Edit Mode
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-sm font-mono bg-teal-100 text-teal-800 px-3 py-1 rounded">
                                                        ID: {student.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        placeholder="اسم الطالب"
                                                        className="p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="email"
                                                        value={editEmail}
                                                        onChange={(e) => setEditEmail(e.target.value)}
                                                        placeholder="البريد الإلكتروني"
                                                        className="p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                                                    />
                                                    <select
                                                        value={editDeptId}
                                                        onChange={(e) => setEditDeptId(e.target.value ? parseInt(e.target.value) : "")}
                                                        className="p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
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
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-mono bg-teal-100 text-teal-800 px-3 py-1 rounded">
                                                        ID: {student.id}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
                                                        <p className="text-gray-600">{student.email}</p>
                                                    </div>
                                                    <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                                        {getDepartmentName(student.deptId)}
                                                    </span>
                                                    {student.enrollments && student.enrollments.length > 0 && (
                                                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                            {student.enrollments.length} مادة مسجلة
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(student.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                                                    >
                                                        {expandedId === student.id ? "▲ إخفاء التفاصيل" : "▼ عرض التفاصيل"}
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(student)}
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedId === student.id && (
                                        <div className="border-t-2 border-gray-200 bg-gray-50 p-6">
                                            <h4 className="text-xl font-bold text-gray-800 mb-3">
                                                المواد المسجلة
                                            </h4>
                                            {student.enrollments && student.enrollments.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {student.enrollments.map((enrollment) => (
                                                        <div key={enrollment.id} className="bg-white p-4 rounded-lg border border-gray-300">
                                                            <p className="font-semibold text-gray-800">
                                                                رقم المادة: {enrollment.courseId}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                الدرجة: {enrollment.grade !== null ? enrollment.grade : "لم تحدد بعد"}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic">لا توجد مواد مسجلة لهذا الطالب</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {students.length === 0 && (
                                <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                                    <div className="text-6xl mb-4">🎓</div>
                                    <p className="text-gray-600 text-lg">لا يوجد طلاب بعد. قم بإضافة طالب جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
