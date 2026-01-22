"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
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
import { setuid } from "process";

export default function EnrollmentPage() {
    // Redux State
    const dispatch = useAppDispatch();
    const { enrollment, loading, error } = useAppSelector((state) => state.enrollments);
    const { students } = useAppSelector((state) => state.students);
    const { Courses } = useAppSelector((state) => state.courses);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
                    <div>
                        <h1 className="text-4xl font-bold text-teal-900 mb-2">إدارة التسجيل</h1>
                    </div>
                    <Link 
                        href="/" 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-1 shadow-md"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Add Form */}
                <form onSubmit={handleAddEnrollment} className="mb-8 p-8 bg-white rounded-xl shadow-lg border-2 border-teal-100">
                    <h2 className="text-2xl font-bold mb-6 text-teal-800 flex items-center gap-2">
                        إضافة
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">


                         <select
                            value={newStudentId}
                            onChange={(e) => setNewStudentId(e.target.value ? parseInt(e.target.value) : "")}
                            className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
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
                            className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
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
                            className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                        />
                       
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
                                onClick={() => dispatch(fetchEnrollment())}
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
                                <span className="font-bold text-teal-600">عدد التسجيلات</span> {Courses.length}
                            </p>
                        </div>

                        
                        <div className="space-y-4">
                            {enrollment.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Student Header */}
                                    <div className="p-6">
                                        {editingId ===enrollment.id? (
                                            // Edit Mode
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-sm font-mono bg-teal-100 text-teal-800 px-3 py-1 rounded">
                                                        ID: {enrollment.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <select
                                                         value={EditStudentId}
                                                         onChange={(e) => setEditStudentId(e.target.value ? parseInt(e.target.value) : "")}
                                                         className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
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
                                                         className="p-4 border-2 text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                                                     >
                                                            <option value="">اختر الكورس</option>
                                                            { Courses.map((course) => (
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
                                                        className="p-3 border-2 text-gray-900 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                                                    />
                                                   
                                                </div>
                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => handleUpdateEnrollment(enrollment.id)}
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
                                                        ID: {enrollment.id}
                                                    </span>
                                                   
                                                    <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                                        {getStudentName(enrollment.studentId)}
                                                    </span>
                                                       <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                                        {getCourseName(enrollment.courseId)}
                                                    </span>
                                                     <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                                        {enrollment.grade}
                                                    </span>
                                                 
                                                </div>
                                                <div className="flex gap-2">
                                                 
                                                    <button
                                                        onClick={() => startEdit(enrollment)}
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEnrollment(enrollment.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedId === enrollment.id && (
                                        <div className="border-t-2 border-gray-200 bg-gray-50 p-6">
                                            <h4 className="text-xl font-bold text-gray-800 mb-3">
                                                البيانات 
                                            </h4>
                                            {enrollment.course && enrollment.course.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {enrollment.course.map((c) => (
                                                        <div key={c.id} className="bg-white p-4 rounded-lg border border-gray-300">
                                                            <p className="text-sm text-gray-600">
                                                                اسم الكورس : {c.title !== null ? c.title : "لم تحدد بعد"}
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
                                    <p className="text-gray-600 text-lg"></p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
