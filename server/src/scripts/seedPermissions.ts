import dotenv from "dotenv";
dotenv.config();
import prisma from "../config/prisma";

const seedPermissions = async () => {
    const permissions = [
        { name: "عرض الطلاب", code: "STUDENTS_VIEW" },
        { name: "إضافة طالب", code: "STUDENTS_CREATE" },
        { name: "تعديل طالب", code: "STUDENTS_UPDATE" },
        { name: "حذف طالب", code: "STUDENTS_DELETE" },
        { name: "عرض الاقسام", code: "DEPARTMENTS_VIEW" },
        { name: "عرض المواد", code: "COURSES_VIEW" },
        { name: "ادارة المستخدمين", code: "USERS_MANAGE" },
    ];

    console.log("Seeding permissions...");

    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { code: p.code },
            update: {},
            create: p,
        });
    }

    // Assign all permissions to the first user (as an admin)
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
        console.log(`Assigning permissions to user: ${firstUser.username}`);
        const allPermissions = await prisma.permission.findMany();

        for (const p of allPermissions) {
            await prisma.userPermission.upsert({
                where: {
                    userId_permissionId: {
                        userId: firstUser.id,
                        permissionId: p.id
                    }
                },
                update: {},
                create: {
                    userId: firstUser.id,
                    permissionId: p.id
                }
            });
        }
    }

    console.log("Seeding completed.");
};

seedPermissions()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
