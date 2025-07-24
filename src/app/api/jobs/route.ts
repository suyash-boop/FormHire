import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get filter parameters
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const department = searchParams.get('department') || ''
    const employmentType = searchParams.get('employmentType') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const salaryMin = searchParams.get('salaryMin') || ''
    const salaryMax = searchParams.get('salaryMax') || ''
    const skills = searchParams.get('skills') || ''
    const featured = searchParams.get('featured') === 'true'
    const companySize = searchParams.get('companySize') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build where clause
    const where: any = {
      isActive: true
    }

    // Text search across multiple fields
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { requirements: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Location filter
    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Department filter
    if (department) {
      where.department = { contains: department, mode: 'insensitive' }
    }

    // Employment type filter
    if (employmentType) {
      where.employmentType = employmentType
    }

    // Experience level filter
    if (experienceLevel) {
      where.experienceLevel = experienceLevel
    }

    // Company size filter
    if (companySize) {
      where.companySize = companySize
    }

    // Featured filter
    if (featured) {
      where.featured = true
    }

    // Skills filter (if skills are stored as array)
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim())
      where.skills = {
        hasSome: skillsArray
      }
    }

    // Salary range filter (basic text matching for now)
    if (salaryMin || salaryMax) {
      // This is a basic implementation - you might want to store salary as numbers
      if (salaryMin && salaryMax) {
        where.salary = {
          contains: `${salaryMin}`,
          mode: 'insensitive'
        }
      }
    }

    // Build orderBy
    const orderBy: any = {}
    if (sortBy === 'salary') {
      orderBy.salary = sortOrder
    } else if (sortBy === 'company') {
      orderBy.companyName = sortOrder
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch jobs with filters
    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              applications: true
            }
          }
        }
      }),
      prisma.job.count({ where })
    ])

    // Get filter options for dropdowns
    const [departments, locations, companies] = await Promise.all([
      prisma.job.findMany({
        where: { isActive: true },
        select: { department: true },
        distinct: ['department']
      }),
      prisma.job.findMany({
        where: { isActive: true },
        select: { location: true },
        distinct: ['location']
      }),
      prisma.job.findMany({
        where: { isActive: true },
        select: { companyName: true },
        distinct: ['companyName']
      })
    ])

    const filterOptions = {
      departments: departments.map(d => d.department).filter(Boolean),
      locations: locations.map(l => l.location).filter(Boolean),
      companies: companies.map(c => c.companyName).filter(Boolean),
      employmentTypes: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      experienceLevels: ['Entry-level', 'Mid-level', 'Senior-level', 'Executive'],
      companySizes: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    }

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filterOptions
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}