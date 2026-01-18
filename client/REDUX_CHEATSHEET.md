# 🔄 Redux Toolkit - Cheat Sheet

## 📌 الاستيراد السريع

```typescript
// في أي Component
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { 
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearError 
} from "@/lib/store/slices/departmentSlice";
import { Department } from "@/types/department.types";
```

---

## 🎯 الاستخدام الأساسي

### 1. قراءة البيانات من Redux

```typescript
const { departments, loading, error } = useAppSelector(
    (state) => state.departments
);
```

### 2. إرسال Actions

```typescript
const dispatch = useAppDispatch();

// جلب البيانات
dispatch(fetchDepartments());

// إضافة
dispatch(createDepartment({ name: "قسم جديد" }));

// تحديث
dispatch(updateDepartment({ id: 1, data: { name: "اسم جديد" } }));

// حذف
dispatch(deleteDepartment(1));

// مسح الخطأ
dispatch(clearError());
```

---

## 🔥 أمثلة سريعة

### مثال 1: Component بسيط

```typescript
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDepartments } from "@/lib/store/slices/departmentSlice";

export default function DepartmentList() {
    const dispatch = useAppDispatch();
    const { departments, loading } = useAppSelector(state => state.departments);

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    return (
        <div>
            {loading ? "Loading..." : departments.map(d => <div key={d.id}>{d.name}</div>)}
        </div>
    );
}
```

### مثال 2: Form مع Redux

```typescript
const [name, setName] = useState("");
const dispatch = useAppDispatch();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await dispatch(createDepartment({ name })).unwrap();
        alert("نجح!");
        setName("");
    } catch (err) {
        alert("فشل: " + err);
    }
};
```

### مثال 3: تحديث مع Inline Editing

```typescript
const [editId, setEditId] = useState<number | null>(null);
const [editName, setEditName] = useState("");

const startEdit = (dept: Department) => {
    setEditId(dept.id);
    setEditName(dept.name);
};

const saveEdit = async () => {
    try {
        await dispatch(updateDepartment({ 
            id: editId!, 
            data: { name: editName } 
        })).unwrap();
        setEditId(null);
        alert("تم التحديث!");
    } catch (err) {
        alert("فشل!");
    }
};
```

---

## 📊 Redux State Structure

```typescript
{
  departments: {
    departments: Department[],           // البيانات
    loading: boolean,                    // حالة التحميل
    error: string | null,                // رسالة الخطأ
    selectedDepartment: Department | null // القسم المحدد
  }
}
```

---

## 🎨 UI Patterns

### Loading State

```typescript
{loading && <div>جاري التحميل...</div>}
```

### Error State

```typescript
{error && <div className="text-red-500">خطأ: {error}</div>}
```

### Empty State

```typescript
{!loading && departments.length === 0 && (
    <div>لا توجد بيانات</div>
)}
```

### Success State

```typescript
{!loading && !error && departments.map(dept => (
    <div key={dept.id}>{dept.name}</div>
))}
```

---

## ⚡ Async Operations

### مع .unwrap()

```typescript
try {
    const result = await dispatch(createDepartment({ name })).unwrap();
    console.log("Success:", result);
} catch (err) {
    console.error("Error:", err);
}
```

### بدون .unwrap()

```typescript
dispatch(createDepartment({ name }))
    .then((result) => console.log("Success"))
    .catch((err) => console.error("Error"));
```

---

## 🔧 Redux Actions المتاحة

| Action | Type | Parameters | Return |
|--------|------|------------|--------|
| `fetchDepartments()` | Async | - | `Department[]` |
| `fetchDepartmentById(id)` | Async | `number` | `Department` |
| `createDepartment(data)` | Async | `{name: string}` | `Department` |
| `updateDepartment({id, data})` | Async | `{id: number, data: {name: string}}` | `Department` |
| `deleteDepartment(id)` | Async | `number` | `number` |
| `clearError()` | Sync | - | `void` |
| `setSelectedDepartment(dept)` | Sync | `Department \| null` | `void` |

---

## 💡 نصائح

### ✅ افعل:
```typescript
// استخدم Typed Hooks
const dispatch = useAppDispatch();
const state = useAppSelector(state => state.departments);

// استخدم unwrap() للتعامل مع الأخطاء
await dispatch(action()).unwrap();

// اجعل UI State محلي
const [name, setName] = useState("");
```

### ❌ لا تفعل:
```typescript
// لا تستخدم Hooks العادية
const dispatch = useDispatch(); // ❌

// لا تنسى dispatch في useEffect
useEffect(() => {
    dispatch(fetchData());
}, []); // ❌ أضف dispatch

// لا تخزن UI State في Redux
// مثل: isModalOpen, currentPage, etc.
```

---

## 🎯 Complete Example

```typescript
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "@/lib/store/slices/departmentSlice";

export default function DepartmentManager() {
    const dispatch = useAppDispatch();
    const { departments, loading, error } = useAppSelector(
        (state) => state.departments
    );

    const [name, setName] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createDepartment({ name })).unwrap();
            setName("");
            alert("✅ تمت الإضافة!");
        } catch (err) {
            alert("❌ فشل: " + err);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            await dispatch(
                updateDepartment({ id, data: { name: editName } })
            ).unwrap();
            setEditId(null);
            alert("✅ تم التحديث!");
        } catch (err) {
            alert("❌ فشل: " + err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد؟")) return;
        try {
            await dispatch(deleteDepartment(id)).unwrap();
            alert("✅ تم الحذف!");
        } catch (err) {
            alert("❌ فشل: " + err);
        }
    };

    if (loading) return <div>جاري التحميل...</div>;
    if (error) return <div>خطأ: {error}</div>;

    return (
        <div>
            {/* Add Form */}
            <form onSubmit={handleAdd}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسم القسم"
                />
                <button type="submit">إضافة</button>
            </form>

            {/* List */}
            {departments.map((dept) => (
                <div key={dept.id}>
                    {editId === dept.id ? (
                        <>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <button onClick={() => handleUpdate(dept.id)}>
                                حفظ
                            </button>
                            <button onClick={() => setEditId(null)}>
                                إلغاء
                            </button>
                        </>
                    ) : (
                        <>
                            <span>{dept.name}</span>
                            <button
                                onClick={() => {
                                    setEditId(dept.id);
                                    setEditName(dept.name);
                                }}
                            >
                                تعديل
                            </button>
                            <button onClick={() => handleDelete(dept.id)}>
                                حذف
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
```

---

## 🚀 Quick Reference

```typescript
// 1. Import
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDepartments } from "@/lib/store/slices/departmentSlice";

// 2. Setup
const dispatch = useAppDispatch();
const { departments, loading, error } = useAppSelector(s => s.departments);

// 3. Fetch on mount
useEffect(() => { dispatch(fetchDepartments()); }, [dispatch]);

// 4. Use data
{departments.map(d => <div key={d.id}>{d.name}</div>)}
```

---

**نسخة سريعة للمراجعة! 🚀**




