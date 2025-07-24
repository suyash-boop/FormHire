import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const coverLetter = formData.get('coverLetter') as string
    const resumeFile = formData.get('resume') as File | null

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        companyName: true,
        isActive: true
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    if (!job.isActive) {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      )
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: params.id,
        applicantEmail: session.user.email
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      )
    }

    // Handle resume upload if provided
    let resumeUrl = null
    if (resumeFile) {
      // Save resume file (implement your file upload logic here)
      // For now, we'll store the filename
      resumeUrl = `/uploads/resumes/${Date.now()}-${resumeFile.name}`
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: params.id,
        applicantName: session.user.name || session.user.email || 'Unknown',
        applicantEmail: session.user.email,
        coverLetter: coverLetter || null,
        resumeUrl,
        status: 'pending'
      }
    })

    // Send confirmation email to applicant
    
    // Send notification email to admins
    

    return NextResponse.json({
      message: 'Application submitted successfully',
      applicationId: application.id
    })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}