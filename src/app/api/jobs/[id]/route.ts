import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    let job

    try {
      job = await prisma.job.findUnique({
        where: {
          id: jobId,
          isActive: true, // Only show active jobs to public
        },
        include: {
          admin: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      })
    } catch (dbError) {
      console.error('Database error fetching job:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      )
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or no longer available' },
        { status: 404 }
      )
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    )
  }
}