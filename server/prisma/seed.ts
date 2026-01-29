import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import path from 'path'
import { execSync } from 'child_process'

// Try to load .env from server directory (parent of prisma directory)
// When running from server directory, prisma/seed.ts means we need to go up one level
const envPath = path.resolve(process.cwd(), '.env')
let result = dotenv.config({ path: envPath })

// If .env not found (has error), try without specifying path (default behavior)
if (result.error) {
  result = dotenv.config() // Try default location (current working directory)
}

// Validate DATABASE_URL
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl || typeof databaseUrl !== 'string') {
  console.error('❌ Error: DATABASE_URL is not defined or is not a string')
  console.error('Please make sure you have a .env file in the server directory with DATABASE_URL set')
  console.error(`Current working directory: ${process.cwd()}`)
  console.error(`Looking for .env at: ${envPath}`)
  if (result.error) {
    console.error('Dotenv error:', result.error)
  }
  process.exit(1)
}

// Ensure DATABASE_URL is a string
const connectionString = String(databaseUrl).trim()

// Function to create database if it doesn't exist
async function ensureDatabaseExists() {
  try {
    // Extract database name from connection string
    const url = new URL(connectionString)
    let dbName = url.pathname.slice(1) // Remove leading '/'
    
    // Remove query parameters if any
    if (dbName.includes('?')) {
      dbName = dbName.split('?')[0]
    }
    
    if (!dbName) {
      console.error('❌ Error: Could not extract database name from DATABASE_URL')
      return false
    }

    // Connect to postgres database to create the target database
    // Replace the database name in the connection string with 'postgres'
    const adminUrl = connectionString.replace(`/${dbName}`, '/postgres').split('?')[0]
    const adminPool = new Pool({ connectionString: adminUrl })
    
    // Check if database exists
    const checkResult = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    )
    
    if (checkResult.rows.length === 0) {
      console.log(`📦 Database '${dbName}' does not exist. Creating it...`)
      await adminPool.query(`CREATE DATABASE "${dbName}"`)
      console.log(`✅ Database '${dbName}' created successfully`)
    } else {
      console.log(`✅ Database '${dbName}' already exists`)
    }
    
    await adminPool.end()
    return true
  } catch (error: any) {
    // If error is that database already exists, that's fine
    if (error.code === '42P04') {
      console.log('✅ Database already exists')
      return true
    }
    console.error('⚠️  Warning: Could not ensure database exists:', error.message)
    // Continue anyway - maybe database exists or will be created by migrations
    return true
  }
}

const pool = new Pool({
  connectionString: connectionString,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Function to check if tables exist and run migrations if needed
async function ensureTablesExist() {
  try {
    // Try to query a table to see if it exists
    await prisma.$queryRaw`SELECT 1 FROM "Department" LIMIT 1`
    console.log('✅ Database tables already exist')
    return true
  } catch (error: any) {
    // If table doesn't exist, run migrations
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('📦 Database tables do not exist. Running migrations...')
      try {
        console.log('Running: npx prisma migrate deploy')
        execSync('npx prisma migrate deploy', {
          stdio: 'inherit',
          cwd: process.cwd(),
          env: { ...process.env }
        })
        console.log('✅ Migrations completed successfully')
        // Reconnect to verify tables exist now
        await prisma.$connect()
        return true
      } catch (migrateError: any) {
        console.error('❌ Failed to run migrations automatically.')
        console.error('Please run migrations manually:')
        console.error('  npx prisma migrate deploy  (for production)')
        console.error('  npx prisma migrate dev     (for development)')
        if (migrateError.message) {
          console.error('Error:', migrateError.message)
        }
        return false
      }
    }
    // Other errors, rethrow
    throw error
  }
}

async function main() {
  console.log('🌱 Starting seed...')
  
  // Ensure database exists
  const dbExists = await ensureDatabaseExists()
  if (!dbExists) {
    console.error('❌ Failed to ensure database exists. Please create it manually.')
    process.exit(1)
  }
  
  // Ensure tables exist (run migrations if needed)
  const tablesExist = await ensureTablesExist()
  if (!tablesExist) {
    console.error('❌ Failed to ensure database tables exist. Please run migrations manually.')
    process.exit(1)
  }

  // Clear existing data (optional - comment out if you want to keep existing data)
  // await prisma.enrollment.deleteMany()
  // await prisma.student.deleteMany()
  // await prisma.course.deleteMany()
  // await prisma.department.deleteMany()
  // await prisma.user.deleteMany()

  // Create Departments
  const dept1 = await prisma.department.upsert({
    where: { name: 'علوم الحاسوب' },
    update: {},
    create: {
      name: 'علوم الحاسوب',
    },
  })

  const dept2 = await prisma.department.upsert({
    where: { name: 'الهندسة' },
    update: {},
    create: {
      name: 'الهندسة',
    },
  })

  console.log('✅ Departments created')

  // Create Students
  const student1 = await prisma.student.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'أحمد محمد',
      email: 'student1@example.com',
      deptId: dept1.id,
    },
  })

  const student2 = await prisma.student.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      name: 'فاطمة علي',
      email: 'student2@example.com',
      deptId: dept1.id,
    },
  })

  const student3 = await prisma.student.upsert({
    where: { email: 'student3@example.com' },
    update: {},
    create: {
      name: 'خالد أحمد',
      email: 'student3@example.com',
      deptId: dept2.id,
    },
  })

  console.log('✅ Students created')

  // Create Courses
  let course1 = await prisma.course.findFirst({
    where: { title: 'قواعد البيانات', deptId: dept1.id },
  })
  if (!course1) {
     course1 = await prisma.course.create({
      data: {
        title: 'قواعد البيانات',
        credits: 3,
        deptId: dept1.id,
      },
    })
  }

  let course2 = await prisma.course.findFirst({
    where: { title: 'البرمجة المتقدمة', deptId: dept1.id },
  })
  if (!course2) {
    course2 = await prisma.course.create({
      data: {
        title: 'البرمجة المتقدمة',
        credits: 4,
        deptId: dept1.id,
      },
    })
  }

  let course3 = await prisma.course.findFirst({
    where: { title: 'الرياضيات', deptId: dept2.id },
  })
  if (!course3) {
    course3 = await prisma.course.create({
      data: {
        title: 'الرياضيات',
        credits: 3,
        deptId: dept2.id,
      },
    })
  }

  console.log('✅ Courses created')

  // Create Enrollments
  const enrollment1 = await prisma.enrollment.findFirst({
    where: { studentId: student1.id, courseId: course1.id },
  })
  if (!enrollment1) {
    await prisma.enrollment.create({
      data: {
        studentId: student1.id,
        courseId: course1.id,
        grade: 85.5,
      },
    })
  }

  const enrollment2 = await prisma.enrollment.findFirst({
    where: { studentId: student1.id, courseId: course2.id },
  })
  if (!enrollment2) {
    await prisma.enrollment.create({
      data: {
        studentId: student1.id,
        courseId: course2.id,
        grade: 90.0,
      },
    })
  }

  const enrollment3 = await prisma.enrollment.findFirst({
    where: { studentId: student2.id, courseId: course1.id },
  })
  if (!enrollment3) {
    await prisma.enrollment.create({
      data: {
        studentId: student2.id,
        courseId: course1.id,
        grade: 88.0,
      },
    })
  }

  console.log('✅ Enrollments created')

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      exist: true,
    },
  })

  await prisma.user.upsert({
    where: { username: 'user1' },
    update: {},
    create: {
      username: 'user1',
      password: hashedPassword,
      exist: true,
    },
  })

  console.log('✅ Users created')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
