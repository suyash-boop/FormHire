import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = [
  
  'suyashpadole715@gmail.com',
  'lakshay@infigon.app'
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const status = searchParams.get('status')

    let applications
    try {
      applications = await prisma.application.findMany({
        where: {
          ...(jobId && { jobId }),
          ...(status && { status: status.toUpperCase() })
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyName: true,
              department: true,
              location: true,
              employmentType: true,
              admin: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              phone: true,
              linkedin: true,
              website: true,
            },
          },
          answers: {
            include: {
              question: {
                select: {
                  id: true,
                  question: true,
                  type: true,
                  required: true,
                },
              },
            },
            orderBy: {
              question: {
                order: 'asc'
              }
            }
          },
        },
        orderBy: { appliedAt: 'desc' },
      })

    
    } catch (appError) {
      console.error('Error fetching applications:', appError)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      applications,
      count: applications.length
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { applicationId, status, notes } = await request.json()

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { 
        status: status.toUpperCase(),
        updatedAt: new Date()
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

    // Log the status change
    if (notes) {
      await prisma.applicationLog.create({
        data: {
          applicationId,
          action: status.toUpperCase(),
          notes,
        }
      })
    }

    return NextResponse.json({ 
      application: updatedApplication,
      message: 'Application status updated successfully'
    })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}