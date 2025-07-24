import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = [

  'suyashpadole715@gmail.com',
  'lakshay@infigon.app'
]

// GET single job
export async function GET(
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

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        admin: {
          select: {
            name: true,
            email: true,
          },
        },
        questions: {
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// UPDATE job
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

    const data = await request.json()
    const {
      title,
      description,
      requirements,
      department,
      location,
      salary,
      employmentType,
      experienceLevel,
      skills,
      benefits,
      companyName,
      companyLogo,
      companyWebsite,
      companySize,
      resumeRequired = true,
      featured = false,
      isActive = true,
      questions
    } = data

    // Validate required fields
    if (!title || !description || !requirements || !department || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, requirements, department, location' },
        { status: 400 }
      )
    }

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        questions: true
      }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update job in a transaction
    const updatedJob = await prisma.$transaction(async (tx) => {
      // Update the job
      const job = await tx.job.update({
        where: { id: params.id },
        data: {
          title,
          description,
          requirements,
          department,
          location,
          salary,
          employmentType,
          experienceLevel,
          skills: skills || [],
          benefits: benefits || [],
          companyName,
          companyLogo,
          companyWebsite,
          companySize,
          resumeRequired,
          featured,
          isActive,
          updatedAt: new Date(),
        },
      })

      // Handle questions if provided
      if (questions && Array.isArray(questions)) {
        // Delete existing questions
        await tx.jobQuestion.deleteMany({
          where: { jobId: params.id }
        })

        // Create new questions
        if (questions.length > 0) {
          await tx.jobQuestion.createMany({
            data: questions.map((q: any, index: number) => ({
              jobId: params.id,
              question: q.question,
              type: q.type || 'text',
              required: q.required || false,
              options: q.options || [],
              order: index + 1,
            }))
          })
        }
      }

      return job
    })


    return NextResponse.json({
      job: updatedJob,
      message: 'Job updated successfully'
    })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE job
export async function DELETE(
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

    // Check if job exists and get application count
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // If job has applications, set inactive instead of deleting
    if (job._count.applications > 0) {
      const updatedJob = await prisma.job.update({
        where: { id: params.id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        }
      })

      return NextResponse.json({
        job: updatedJob,
        message: 'Job deactivated successfully (has applications)'
      })
    } else {
      // Safe to delete if no applications
      await prisma.$transaction(async (tx) => {
        // Delete questions first
        await tx.jobQuestion.deleteMany({
          where: { jobId: params.id }
        })

        // Delete job
        await tx.job.delete({
          where: { id: params.id }
        })
      })

      return NextResponse.json({
        message: 'Job deleted successfully'
      })
    }
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}