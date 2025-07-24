import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, description, website, location, size } = data

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: session.user.email },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin account already exists' },
        { status: 400 }
      )
    }

    // Create admin account
    const admin = await prisma.admin.create({
      data: {
        email: session.user.email,
        name: name || session.user.name || 'Company',
        image: session.user.image,
        description,
        website,
        location,
        size,
      },
    })

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Error creating admin account:', error)
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}