import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      jobId,
      resumeUrl,
      phoneNumber,
      linkedinUrl,
      portfolioUrl,
      whyInterested,
      relevantExperience,
      expectedSalary,
      availabilityStart,
      currentEmployment,
      relocationWillingness,
      workAuthorization,
      coverLetter,
      additionalComments,
      referenceSource,
      customAnswers = []
    } = body

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || '',
          image: session.user.image,
        }
      })
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId: jobId,
          userId: user.id,
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 400 }
      )
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: user.id,
        userEmail: session.user.email,
        userName: session.user.name || '',
        resumeUrl: resumeUrl || '',
        phoneNumber,
        linkedinUrl: linkedinUrl || '',
        portfolioUrl: portfolioUrl || '',
        whyInterested,
        relevantExperience,
        expectedSalary: expectedSalary || '',
        availabilityStart: availabilityStart || '',
        currentEmployment: currentEmployment || '',
        relocationWillingness: relocationWillingness || '',
        workAuthorization,
        coverLetter: coverLetter || '',
        additionalComments: additionalComments || '',
        referenceSource: referenceSource || '',
        status: 'PENDING'
      },
      include: {
        job: {
          select: {
            title: true,
            companyName: true,
          }
        }
      }
    })

    // Handle custom answers if provided
    if (customAnswers && customAnswers.length > 0) {
      await Promise.all(
        customAnswers.map((answer: any) =>
          prisma.applicationAnswer.create({
            data: {
              applicationId: application.id,
              questionId: answer.questionId,
              answer: answer.answer
            }
          })
        )
      )
    }

    return NextResponse.json({ 
      application,
      message: 'Application submitted successfully!'
    })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let user
    let applications = []

    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (user) {
        applications = await prisma.application.findMany({
          where: { userId: user.id },
          include: {
            job: {
              select: {
                id: true,
                title: true,
                companyName: true,
                department: true,
                location: true,
                employmentType: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            appliedAt: 'desc',
          },
        })
      }
    } catch (dbError) {
      console.error('Database error fetching applications:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}