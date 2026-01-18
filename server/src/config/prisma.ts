import { PrismaClient } from '../generated/prisma'
//import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    /*max: 10,          
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,*/
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

export default prisma 

//Singleton
