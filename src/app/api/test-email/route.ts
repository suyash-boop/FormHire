import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Email functionality removed - just return success
  return NextResponse.json({
    success: true,
    message: 'Email functionality has been disabled',
    note: 'This endpoint no longer sends actual emails'
  })
}