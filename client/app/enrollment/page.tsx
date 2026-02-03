"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { usePermission } from "@/lib/hooks/usePermission";
import { PERMISSIONS } from "@/lib/constants/permissions";
import {
    fetchEnrollment,
    createEnrollment,
    UpdateEnrollment,
    deleteEnrollment,
    clearError,
} from "@/lib/store/slices/enrollmentSlice";
import { fetchStudents } from "@/lib/store/slices/studentSlice";
import { fetchCourses } from "@/lib/store/slices/courseSlice";

import { Enrollment } from "@/types/enrollment.types";

export default function EnrollmentPage() {
    const dispatch = useAppDispatch();
    const { enrollment, loading, error } = useAppSelector((state) => state.enrollments);
    const { students } = useAppSelector((state) => state.students);
    const { Courses } = useAppSelector((state) => state.courses);
    const canView = usePermission(PERMISSIONS.ENROLLMENTS_VIEW);
    const canCreate = usePermission(PERMISSIONS.ENROLLMENTS_CREATE);
    const canUpdate = usePermission(PERMISSIONS.ENROLLMENTS_UPDATE);
    const canDelete = usePermission(PERMISSIONS.ENROLLMENTS_DELETE);

    // Local UI State
    const [newStudentId, setNewStudentId] = useState<number | "">("");
    const [newCourseId, setNewCourseId] = useState<number | "">("");
    const [newGrade, setNewGrade] = useState<number | "">("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [EditStudentId, setEditStudentId] = useState<number | "">("");
    const [EditCourseId, setEditCourseId] = useState<number | "">("");
    const [editGrade, setEditGrade] = useState<number | "">("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Fetch students and departments on mount
  

useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchStudents());
        dispatch(fetchEnrollment());
        }, [dispatch]);

   
    // Handlers
    const handleAddEnrollment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newGrade==="") {
            alert("الرجاء إدخال الدرجة");
            return;
        }
        if (newStudentId==="") {
            alert("الرجاء اختيار الطالب");
            return;
        }
        if (newCourseId === "") {
            alert("الرجاء اختيار الكورس");
            return;
        }

        try {
            await dispatch(
                createEnrollment({ 
                    studentId: newStudentId as number, 
                    courseId: newCourseId as number, 
                    grade: newGrade as number 
                })
            ).unwrap();
            setNewCourseId("");
            setNewGrade("");
            setNewStudentId("");
            alert("تم إضافة تسجيل بنجاح!");
        } catch (err: any) {
            alert("فشل إضافة تسجيل: " + err);
        }
    };

    const handleUpdateEnrollment = async (id: number) => {
        if (EditCourseId === "") {
            alert("الرجاء اختيار الكورس");
            return;
        }
        if (EditStudentId==="") {
            alert("الرجاء اختيار الطالب");
            return;
        }
        if (editGrade === "") {
            alert("الرجاء إدخال الدرجة");
            return;
        }

        try {
            await dispatch(
                UpdateEnrollment({ 
                    id, 
                    data: { 
                        studentId: EditStudentId as number, 
                    courseId: EditCourseId as number, 
                    grade: editGrade as number 
                    } 
                })
            ).unwrap();
            setEditingId(null);
            setEditCourseId("");
            setEditGrade("");
            setEditStudentId("");
            alert("تم تحديث التسجيل بنجاح!");
        } catch (err: any) {
            alert("فشل تحديث التسجيل: " + err);
        }
    };

    const handleDeleteEnrollment = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا التسجيل؟")) return;

        try {
            await dispatch(deleteEnrollment(id)).unwrap();
            alert("تم حذف التسجيل بنجاح!");
        } catch (err: any) {
            alert("فشل حذف التسجيل: " + err);
        }
    };

    const startEdit = (enrollment: Enrollment) => {
        setEditingId(enrollment.id);
        setEditStudentId(enrollment.studentId);
        setEditCourseId(enrollment.courseId);
        setEditGrade(enrollment.grade ?? "");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditStudentId("");
        setEditCourseId("");
        setEditGrade("");
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    const getStudentName = (studentid: number) => {
        const student = students.find((s) => s.id === studentid);
        return student ? student.name : `الطالب ${studentid}`;
    };
    const getCourseName = (courseid: number) => {
        const course = Courses.find((s) => s.id === courseid);
        return course ? course.title : `القسم ${courseid}`;
    };

    if (!canView) {
        return (
            <div className="min-h-[calc(100vh-64px)] p-6 flex items-center justify-center">
                <div className="text-center p-8 bg-slate-800/60 border border-slate-700 rounded-xl">
                    <p className="text-red-300 text-lg">ليس لديك صلاحية لعرض هذه الصفحة.</p>
                    <Link href="/" className="mt-4 inline-block px-4 py-2 rounded-xl bg-slate-600 text-white hover:bg-slate-500">
                        الرجوع للرئيسية
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-slate-800/60 border border-slate-700 p-6 rounded-xl shadow-xl">
                    <h1 className="text-2xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">إدارة التسجيل</h1>
                    <Link 
                        href="/" 
                        className="px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-200 border border-slate-600 font-medium transition-all"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {canCreate && (
                <form onSubmit={handleAddEnrollment} className="p-8 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-slate-200">إضافة تسجيل جديد</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                            value={newStudentId}
                            onChange={(e) => setNewStudentId(e.target.value ? parseInt(e.target.value) : "")}
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                        >
                            <option value="">اختر الطالب</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={newCourseId}
                            onChange={(e) => setNewCourseId(e.target.value ? parseInt(e.target.value) : "")}
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                        >
                            <option value="">اختر الكورس</option>
                            {Courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value ? parseInt(e.target.value) : "")}
                            placeholder="الدرجة"
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                    >
                        إضافة
                    </button>
                </form>
                )}

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
                                onClick={() => dispatch(fetchEnrollment())}
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
                                <span className="font-bold text-blue-400">عدد التسجيلات:</span> {enrollment.length}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {enrollment.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all"
                                >
                                    <div className="p-6">
                                        {editingId === item.id ? (
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                                                        ID: {item.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <select
                                                        value={EditStudentId}
                                                        onChange={(e) => setEditStudentId(e.target.value ? parseInt(e.target.value) : "")}
                                                        className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                    >
                                                        <option value="">اختر الطالب</option>
                                                        {students.map((student) => (
                                                            <option key={student.id} value={student.id}>
                                                                {student.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={EditCourseId}
                                                        onChange={(e) => setEditCourseId(e.target.value ? parseInt(e.target.value) : "")}
                                                        className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                    >
                                                        <option value="">اختر الكورس</option>
                                                        {Courses.map((course) => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={editGrade}
                                                        onChange={(e) => setEditGrade(e.target.value ? parseInt(e.target.value) : "")}
                                                        placeholder="الدرجة"
                                                        className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                    />
                                                </div>
                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => handleUpdateEnrollment(item.id)}
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
                                                        ID: {item.id}
                                                    </span>
                                                    <span className="text-sm bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                                                        {getStudentName(item.studentId)}
                                                    </span>
                                                    <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                                                        {getCourseName(item.courseId)}
                                                    </span>
                                                    <span className="text-sm bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">
                                                        {item.grade}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    {canUpdate && (
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    )}
                                                    {canDelete && (
                                                    <button
                                                        onClick={() => handleDeleteEnrollment(item.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {expandedId === item.id && item.course && item.course.length > 0 && (
                                        <div className="border-t border-slate-700 bg-slate-900/40 p-6">
                                            <h4 className="text-lg font-bold text-slate-200 mb-3">البيانات</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {item.course.map((c) => (
                                                    <div key={c.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                                                        <p className="text-sm text-slate-300">اسم الكورس: {c.title ?? "لم تحدد بعد"}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {enrollment.length === 0 && (
                                <div className="text-center p-12 bg-slate-800/60 border border-slate-700 rounded-xl">
                                    <p className="text-slate-400 text-lg">لا توجد تسجيلات بعد. قم بإضافة تسجيل جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
