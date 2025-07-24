import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }


    // Test database connection first
    try {
      await prisma.$connect()
    } catch (connectError) {
      console.error('Database connection failed:', connectError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    let user
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
    } catch (userError) {
      console.error('Error finding user:', userError)
      return NextResponse.json(
        { error: 'Failed to find user' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let applications
    try {
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
              admin: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          answers: {
            include: {
              question: {
                select: {
                  id: true,
                  question: true,
                  type: true,
                },
              },
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
      })
      
    } catch (appError) {
      console.error('Error fetching applications:', appError)
      
      // Provide more specific error information
      if (appError.code === 'P2025') {
        return NextResponse.json(
          { error: 'No applications found' },
          { status: 404 }
        )
      } else if (appError.code === 'P2021') {
        return NextResponse.json(
          { error: 'Database table does not exist' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }

    return NextResponse.json({ 
      applications,
      count: applications.length
    })
  } catch (error) {
    console.error('Unexpected error fetching user applications:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch applications',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}