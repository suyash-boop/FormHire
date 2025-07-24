import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in first' },
        { status: 401 }
      )
    }

    const { password } = await request.json()

    // Check if password is correct
    if (password !== 'infugon') {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 403 }
      )
    }

    // For now, let's just check if user exists and simulate admin access
    // We'll store admin emails in a temporary way until we add the role field
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // For now, we'll use a simple approach - store admin emails in memory/env
    // In production, you should have the role field in database
    const adminEmails = [
      'admin@formhire.com',
      session.user.email, // Add current user as admin
    ]


    return NextResponse.json({
      success: true,
      message: 'Admin access granted successfully',
      user: {
        ...user,
        role: 'ADMIN' // Simulate admin role
      }
    })

  } catch (error) {
    console.error('Make admin error:', error)
    return NextResponse.json(
      { error: 'Failed to grant admin access' },
      { status: 500 }
    )
  }
}