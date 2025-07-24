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

    // Get ALL jobs since admin manages everything
    let jobs = []
    
    try {
      jobs = await prisma.job.findMany({
        include: {
          admin: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (dbError) {
      console.error('Database error fetching jobs:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', jobs: [] },
        { status: 500 }
      )
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs', jobs: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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


    // Test database connection first
    try {
      await prisma.$connect()
    } catch (connectError) {
      console.error('Database connection failed:', connectError)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your database configuration.' },
        { status: 500 }
      )
    }

    // Parse request data
    let data
    try {
      data = await request.json()
    } catch (parseError) {
      console.error('Failed to parse request data:', parseError)
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

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
      featured = false
    } = data

    // Validate required fields
    if (!title || !description || !requirements || !department || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, requirements, department, location' },
        { status: 400 }
      )
    }


    // Find or create admin
    let admin
    try {
      admin = await prisma.admin.findUnique({
        where: { email: session.user.email },
      })


      if (!admin) {
        admin = await prisma.admin.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'Admin',
            image: session.user.image,
          },
        })
      }
    } catch (adminError) {
      console.error('Error with admin operations:', adminError)
      return NextResponse.json(
        { error: 'Failed to verify admin access' },
        { status: 500 }
      )
    }

    if (!admin.isActive && admin.isActive !== undefined) {
      return NextResponse.json(
        { error: 'Admin account is deactivated' },
        { status: 403 }
      )
    }

    // Create the job
    let job
    try {
      
      job = await prisma.job.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          requirements: requirements.trim(),
          department: department.trim(),
          location: location.trim(),
          salary: salary?.trim() || null,
          employmentType: employmentType || 'full-time',
          experienceLevel: experienceLevel || 'mid',
          skills: Array.isArray(skills) ? skills : [],
          benefits: Array.isArray(benefits) ? benefits : [],
          companyName: companyName?.trim() || 'FormHire',
          companyLogo: companyLogo?.trim() || null,
          companyWebsite: companyWebsite?.trim() || null,
          companySize: companySize?.trim() || null,
          resumeRequired: Boolean(resumeRequired),
          featured: Boolean(featured),
          adminId: admin.id,
        },
        include: {
          admin: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        }
      })

    } catch (jobError) {
      console.error('Database error creating job:', jobError)
      
      // Provide more specific error messages
      if (jobError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A job with this information already exists' },
          { status: 409 }
        )
      } else if (jobError.code === 'P2003') {
        return NextResponse.json(
          { error: 'Invalid reference data provided' },
          { status: 400 }
        )
      } else if (jobError.message?.includes('connect')) {
        return NextResponse.json(
          { error: 'Database connection lost. Please try again.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create job', 
          details: process.env.NODE_ENV === 'development' ? jobError.message : undefined 
        },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }

    return NextResponse.json({ 
      job,
      message: 'Job created successfully!' 
    })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/jobs:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}