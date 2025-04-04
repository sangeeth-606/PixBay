// // db.js
// import { PrismaClient } from '../generated/prisma/index.js'
// const prisma = new PrismaClient()
// export default prisma

// db.js
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

// Verify database connection
async function verifyDatabaseConnection() {
  try {
    // Run a simple query to check connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ PostgreSQL database connected')
  } catch (error) {
    console.error('❌ Unable to connect to the PostgreSQL database:', error)
    process.exit(1) // Exit if connection fails
  }
}

// Run the verification
verifyDatabaseConnection()

export default prisma