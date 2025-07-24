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

    // Fetch dashboard statistics
    const [jobs, applications, users] = await Promise.all([
      prisma.job.findMany({
        include: {
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.application.findMany({
        include: {
          job: {
            select: {
              title: true,
              companyName: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
        take: 10, // Get last 10 applications
      }),
      prisma.user.count(),
    ])

    // Calculate stats
    const totalJobs = jobs.length
    const activeJobs = jobs.filter((job) => job.isActive).length
    const totalApplications = applications.length
    const pendingApplications = applications.filter(
      (app) => app.status === 'PENDING'
    ).length

    // Format recent applications
    const recentApplications = applications
      .slice(0, 5)
      .map((app) => ({
        id: app.id,
        applicantName: app.user.name || app.userName,
        applicantEmail: app.user.email || app.userEmail,
        jobTitle: app.job.title,
        companyName: app.job.companyName,
        appliedAt: app.appliedAt.toISOString(),
        status: app.status,
      }))

    const dashboardStats = {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      totalUsers: users,
      recentApplications,
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}