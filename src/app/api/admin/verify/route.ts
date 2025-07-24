import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Define admin emails - only these emails can access admin panel
const ADMIN_EMAILS = [
  'admin@formhire.com',
  'suyash@formhire.com',
  'suyashpadole715@gmail.com' // Add your email here
  // Add more admin emails as needed
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user email is in admin list
    if (!ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required. You are not authorized to access this area.' },
        { status: 403 }
      )
    }

    // For now, return a mock admin if the database isn't set up yet
    // This allows the admin panel to work while database is being configured
    const mockAdmin = {
      id: 'admin-' + session.user.email.replace('@', '-').replace('.', '-'),
      name: session.user.name || 'Admin',
      email: session.user.email,
      image: session.user.image,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    try {
      // Try to find existing admin record
      let admin = await prisma.admin.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          isActive: true,
          createdAt: true,
        },
      })

      // Create admin record if it doesn't exist
      if (!admin) {
        admin = await prisma.admin.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'Admin',
            image: session.user.image,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isActive: true,
            createdAt: true,
          },
        })
      }

      // Check if admin is active
      if (!admin.isActive) {
        return NextResponse.json(
          { error: 'Admin account is deactivated' },
          { status: 403 }
        )
      }

      return NextResponse.json({ admin })
    } catch (dbError) {
      console.warn('Database not available, using mock admin:', dbError.message)
      
      // Return mock admin if database operations fail
      return NextResponse.json({ admin: mockAdmin })
    }
  } catch (error) {
    console.error('Error verifying admin:', error)
    
    return NextResponse.json(
      { error: 'Failed to verify admin access' },
      { status: 500 }
    )
  }
}