import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendApplicationStatusUpdate } from '@/lib/email'

const ADMIN_EMAILS = [
  
  'suyashpadole715@gmail.com',
  'lakshay@infigon.app'
]

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { status, message } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'interview', 'hired', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get application with job details
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: {
          select: {
            title: true,
            companyName: true
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: params.id },
      data: {
        status,
        statusMessage: message || null,
        statusUpdatedAt: new Date()
      }
    })

    // Send email notification to applicant if status changed
    if (application.status !== status) {
      try {
        await sendApplicationStatusUpdate(application.applicantEmail, {
          applicantName: application.applicantName,
          jobTitle: application.job.title,
          companyName: application.job.companyName,
          status,
          message
        })
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError)
        // Don't fail the status update if email fails
      }
    }

    return NextResponse.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    })
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    )
  }
}