const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateApplicationData() {
  console.log('Starting application data migration...')

  try {
    // Get all applications that don't have applicantName and applicantEmail set
    const applications = await prisma.application.findMany({
      where: {
        OR: [
          { applicantName: null },
          { applicantEmail: null }
        ]
      },
      include: {
        user: true
      }
    })

    console.log(`Found ${applications.length} applications to migrate`)

    // Update each application
    for (const app of applications) {
      await prisma.application.update({
        where: { id: app.id },
        data: {
          applicantName: app.applicantName || app.userName || app.user?.name || 'Unknown',
          applicantEmail: app.applicantEmail || app.userEmail || app.user?.email || 'unknown@example.com'
        }
      })
    }

    // Update application logs that have null action
    const logs = await prisma.applicationLog.findMany({
      where: { action: null }
    })

    console.log(`Found ${logs.length} application logs to migrate`)

    for (const log of logs) {
      await prisma.applicationLog.update({
        where: { id: log.id },
        data: {
          action: 'pending' // Default value
        }
      })
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateApplicationData()