import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = [
  
  'suyashpadole715@gmail.com',
  'lakshay@infigon.app'
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const applicationId = params.id
    const { status } = await request.json()

    // Validate status
    const validStatuses = ['PENDING', 'REVIEWED', 'INTERVIEW', 'ACCEPTED', 'REJECTED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    let application
    
    try {
      application = await prisma.application.update({
        where: { id: applicationId },
        data: { status },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              resume: true,
              bio: true,
              location: true,
              linkedin: true,
              github: true,
              skills: true,
              experience: true,
            }
          },
          job: {
            select: {
              id: true,
              title: true,
              department: true,
              location: true,
              companyName: true,
            }
          }
        }
      })
    } catch (dbError) {
      console.error('Database error updating application:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const applicationId = params.id

    await prisma.application.delete({
      where: { id: applicationId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}