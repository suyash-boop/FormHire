import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { hasApplied: false, application: null }
      )
    }

    const jobId = params.jobId

    let user
    let application = null

    try {
      // Find user by email
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        // Check if user has applied to this job
        // Fix: Use the correct unique constraint name
        application = await prisma.application.findUnique({
          where: {
            jobId_userId: {  // This should match your schema: @@unique([jobId, userId])
              jobId: jobId,
              userId: user.id
            }
          }
        })
      }
    } catch (dbError) {
      console.error('Database error checking application:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasApplied: !!application,
      application: application || null
    })
  } catch (error) {
    console.error('Error checking application status:', error)
    return NextResponse.json(
      { error: 'Failed to check application status' },
      { status: 500 }
    )
  }
}