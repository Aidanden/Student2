import dotenv from "dotenv";
dotenv.config();
import prisma from "../config/prisma";

// جميع الصلاحيات لكل الشاشات والعمليات
const permissions = [
    // الرئيسية
    { name: "عرض لوحة التحكم", code: "DASHBOARD_VIEW" },
    // الأقسام
    { name: "عرض الأقسام", code: "DEPARTMENTS_VIEW" },
    { name: "إضافة قسم", code: "DEPARTMENTS_CREATE" },
    { name: "تعديل قسم", code: "DEPARTMENTS_UPDATE" },
    { name: "حذف قسم", code: "DEPARTMENTS_DELETE" },
    // الطلاب
    { name: "عرض الطلاب", code: "STUDENTS_VIEW" },
    { name: "إضافة طالب", code: "STUDENTS_CREATE" },
    { name: "تعديل طالب", code: "STUDENTS_UPDATE" },
    { name: "حذف طالب", code: "STUDENTS_DELETE" },
    // المواد/الدورات
    { name: "عرض المواد", code: "COURSES_VIEW" },
    { name: "إضافة مادة", code: "COURSES_CREATE" },
    { name: "تعديل مادة", code: "COURSES_UPDATE" },
    { name: "حذف مادة", code: "COURSES_DELETE" },
    // التسجيل
    { name: "عرض التسجيل", code: "ENROLLMENTS_VIEW" },
    { name: "إضافة تسجيل", code: "ENROLLMENTS_CREATE" },
    { name: "تعديل تسجيل", code: "ENROLLMENTS_UPDATE" },
    { name: "حذف تسجيل", code: "ENROLLMENTS_DELETE" },
    // المستخدمين
    { name: "عرض المستخدمين", code: "USERS_VIEW" },
    { name: "إضافة مستخدم", code: "USERS_CREATE" },
    { name: "تعديل مستخدم", code: "USERS_UPDATE" },
    { name: "حذف مستخدم", code: "USERS_DELETE" },
    // الصلاحيات
    { name: "عرض الصلاحيات", code: "PERMISSIONS_VIEW" },
    { name: "إضافة صلاحية", code: "PERMISSIONS_CREATE" },
    { name: "تعيين صلاحيات للمستخدمين", code: "PERMISSIONS_ASSIGN" },
];

const seedPermissions = async () => {
    console.log("Seeding permissions...");

    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { code: p.code },
            update: {},
            create: p,
        });
    }

    // تعيين كل الصلاحيات لأول مستخدم (admin)
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
        console.log(`Assigning all permissions to user: ${firstUser.username}`);
        const allPermissions = await prisma.permission.findMany();

        for (const p of allPermissions) {
            await prisma.userPermission.upsert({
                where: {
                    userId_permissionId: {
                        userId: firstUser.id,
                        permissionId: p.id,
                    },
                },
                update: {},
                create: {
                    userId: firstUser.id,
                    permissionId: p.id,
                },
            });
        }
    }

    console.log("Seeding permissions completed.");
};

seedPermissions()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
