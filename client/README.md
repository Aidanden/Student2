# 🎓 نظام إدارة الأقسام - Frontend

> نظام متكامل لإدارة الأقسام الدراسية مع Next.js و Redux Toolkit

## ✨ الميزات

- ✅ **Redux Toolkit** لإدارة الحالة
- ✅ **TypeScript** للأمان والجودة
- ✅ **Tailwind CSS** للتصميم
- ✅ **CRUD كامل** لجميع العمليات
- ✅ **Types منفصلة** في ملفات مستقلة
- ✅ **API Service Layer** منفصل
- ✅ **Typed Redux Hooks** للأمان

## 🚀 التشغيل السريع

```bash
# تثبيت التبعيات
npm install

# تشغيل الخادم التطويري
npm run dev

# فتح المتصفح
# http://localhost:3000
```

## 📁 البنية

```
client/
├── app/                    # Next.js App Router
│   ├── department/         # صفحة الأقسام
│   └── layout.tsx          # Redux Provider
├── lib/                    # Redux & API
│   ├── api/                # API Services
│   ├── store/              # Redux Store
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   └── providers/          # React Providers
└── types/                  # TypeScript Types
```

## 🔄 Redux

### استخدام Redux في Component:

```typescript
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDepartments } from "@/lib/store/slices/departmentSlice";

const { departments, loading } = useAppSelector(state => state.departments);
const dispatch = useAppDispatch();

useEffect(() => {
    dispatch(fetchDepartments());
}, [dispatch]);
```

## 📚 التوثيق

- **REDUX_CHEATSHEET.md** - مرجع سريع لـ Redux
- **README_REDUX.md** - دليل Redux كامل
- **../COMPLETE_GUIDE.md** - الدليل الشامل للمشروع

## 🛠️ التقنيات

- Next.js 16.1.1
- React 19.2.3
- Redux Toolkit 2.x
- TypeScript 5.x
- Tailwind CSS 4.x

## 📦 Scripts

```bash
npm run dev      # تشغيل التطوير
npm run build    # بناء للإنتاج
npm run start    # تشغيل الإنتاج
npm run lint     # فحص الكود
```

## 🌐 API

الاتصال مع Backend على:
```
http://localhost:5000/departments
```

## 📝 ملاحظات

- تأكد من تشغيل Backend قبل Frontend
- الـ Port الافتراضي: 3000
- Redux DevTools متاح للتطوير

---

**Built with ❤️ using Next.js & Redux Toolkit**
