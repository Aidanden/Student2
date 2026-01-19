"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    clearError,
} from "@/lib/store/slices/courseSlice";
import { fetchDepartments } from "@/lib/store/slices/departmentSlice";
import { Course } from "@/types/course.types";

export default function CoursePage() {
    // Redux State
    const dispatch = useAppDispatch();
    const { Courses, loading, error } = useAppSelector((state) => state.courses);
    const { departments } = useAppSelector((state) => state.departments);

    // Local UI State
    const [newTitle, setnewTitle] = useState("");
    const [newCredit, setnewCredit] = useState<number | "">("");
    const [newDeptId, setNewDeptId] = useState<number | "">("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [EditTitle, setEditTitle] = useState("");
    const [EditCredit, setEditCredit] = useState<number | "">("");
    const [editDeptId, setEditDeptId] = useState<number | "">("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Fetch students and departments on mount
  

useEffect(() => {
   dispatch(fetchCourses());
        dispatch(fetchDepartments());
        }, [dispatch]);

   
    // Handlers
    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            alert("الرجاء إدخال اسم الكورس");
            return;
        }
        if (newCredit==="") {
            alert("الرجاء إدخال  عدد الساعات ");
            return;
        }
        if (newDeptId === "") {
            alert("الرجاء اختيار القسم");
            return;
        }

        try {
            await dispatch(
                createCourse({ 
                    title: newTitle, 
                    credits: newCredit as number, 
                    deptId: newDeptId as number 
                })
            ).unwrap();
            setnewTitle("");
            setnewCredit("");
            setNewDeptId("");
            alert("تم إضافة كورس بنجاح!");
        } catch (err: any) {
            alert("فشل إضافة كورس: " + err);
        }
    };

    const handleUpdateCourse = async (id: number) => {
        if (!EditTitle.trim()) {
            alert("الرجاء إدخال اسم الكورس");
            return;
        }
        if (EditCredit==="") {
            alert("الرجاء إدخال عدد الساعات");
            return;
        }
        if (editDeptId === "") {
            alert("الرجاء اختيار القسم");
            return;
        }

        try {
            await dispatch(
                updateCourse({ 
                    id, 
                    data: { 
                        title: EditTitle, 
                        credits: EditCredit as number, 
                        deptId: editDeptId as number 
                    } 
                })
            ).unwrap();
            setEditingId(null);
            setEditTitle("");
            setEditCredit("");
            setEditDeptId("");
            alert("تم تحديث  بنجاح!");
        } catch (err: any) {
            alert("فشل تحديث كورس: " + err);
        }
    };

    const handleDeleteCourse = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا كورس؟")) return;

        try {
            await dispatch(deleteCourse(id)).unwrap();
            alert("تم حذف كورس بنجاح!");
        } catch (err: any) {
            alert("فشل حذف كورس: " + err);
        }
    };

    const startEdit = (course: Course) => {
        setEditingId(course.id);
        setEditTitle(course.title);
        setEditCredit(course.credits);
        setEditDeptId(course.deptId);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditCredit("");
        setEditDeptId("");
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    const getDepartmentName = (deptId: number) => {
        const dept = departments.find((dept) => dept.id === deptId);
        return dept ? dept.name : `القسم ${deptId}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-teal-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
                    <div>
                        <h1 className="text-4xl font-bold text-teal-900 mb-2">إدارة الكورسات</h1>
                    </div>
                    <Link 
                        href="/" 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-1 shadow-md"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Add Form */}
                <form onSubmit={handleAddCourse} className="mb-8 p-8 bg-white rounded-xl shadow-lg border-2 border-teal-100">
                    <h2 className="text-2xl font-bold mb-6 text-teal-800 flex items-center gap-2">
                        إضافة طالب جديد
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setnewTitle(e.target.value)}
                            placeholder="اسم كورس"
                            className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                        />
                        <input
                            type="text"
                            value={newCredit}
                            onChange={(e) => setnewCredit(e.target.value ? parseInt(e.target.value) : "")}
                            placeholder="عدد الساعات"
                            className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                        />
                        <select
                            value={newDeptId}
                            onChange={(e) => setNewDeptId(e.target.value ? parseInt(e.target.value) : "")}
                            className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
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
                                onClick={() => dispatch(fetchCourses())}
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
                                <span className="font-bold text-teal-600">عدد الكورسات:</span> {Courses.length}
                            </p>
                        </div>

                        {/* Students List */}
                        <div className="space-y-4">
                            {Courses.map((Courses) => (
                                <div
                                    key={Courses.id}
                                    className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Student Header */}
                                    <div className="p-6">
                                        {editingId === Courses.id ? (
                                            // Edit Mode
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-sm font-mono bg-teal-100 text-teal-800 px-3 py-1 rounded">
                                                        ID: {Courses.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <input
                                                        type="text"
                                                        value={EditTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        placeholder="اسم كورس"
                                                        className="p-3 border-2 text-gray-900 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="text"
                                                        value={EditCredit}
                                                        onChange={(e) => setEditCredit(e.target.value ? parseInt(e.target.value) : "")}
                                                        placeholder="عدد الساعات"
                                                        className="p-3 border-2 text-gray-900 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                                                    />
                                                    <select
                                                        value={editDeptId}
                                                        onChange={(e) => setEditDeptId(e.target.value ? parseInt(e.target.value) : "")}
                                                        className="p-3 border-2 text-gray-900 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
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
                                                        onClick={() => handleUpdateCourse(Courses.id)}
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
                                                        ID: {Courses.id}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-800">{Courses.title}</h3>
                                                        <p className="text-gray-600">{Courses.credits}</p>
                                                    </div>
                                                    <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                                        {getDepartmentName(Courses.deptId)}
                                                    </span>
                                                    {Courses.enrollments && Courses.enrollments.length > 0 && (
                                                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                            {Courses.enrollments.length} مادة مسجلة
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(Courses.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                                                    >
                                                        {expandedId === Courses.id ? "▲ إخفاء التفاصيل" : "▼ عرض التفاصيل"}
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(Courses)}
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCourse(Courses.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedId === Courses.id && (
                                        <div className="border-t-2 border-gray-200 bg-gray-50 p-6">
                                            <h4 className="text-xl font-bold text-gray-800 mb-3">
                                                المواد المسجلة
                                            </h4>
                                            {Courses.enrollments && Courses.enrollments.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {Courses.enrollments.map((enrollment) => (
                                                        <div key={enrollment.id} className="bg-white p-4 rounded-lg border border-gray-300">
                                                            <p className="font-semibold text-gray-800">
                                                                رقم المادة: {enrollment.courseId}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                عدد الساعات: {enrollment.grade !== null ? enrollment.grade : "لم تحدد بعد"}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic">لا توجد مواد مسجلة لهذا كورس</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {Courses.length === 0 && (
                                <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                                    <div className="text-6xl mb-4">🎓</div>
                                    <p className="text-gray-600 text-lg">لا يوجد الكورسات بعد. قم بإضافة كورس جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
