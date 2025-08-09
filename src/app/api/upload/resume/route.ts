import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting file upload...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('📄 File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.log('❌ Cloudinary credentials not configured')
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    // Create timestamp
    const timestamp = Math.round(Date.now() / 1000)
    
    // Parameters for signature
    const params = {
      folder: 'resumes',
      timestamp: timestamp
    }

    // Create signature
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key as keyof typeof params]}`)
      .join('&')

    const signature = crypto
      .createHash('sha1')
      .update(sortedParams + apiSecret)
      .digest('hex')

    console.log('🔐 Signature created for signed upload')

    // Create new FormData for Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('api_key', apiKey)
    cloudinaryFormData.append('timestamp', timestamp.toString())
    cloudinaryFormData.append('folder', 'resumes')
    cloudinaryFormData.append('signature', signature)

    console.log('☁️ Uploading to Cloudinary:', cloudName)

    // Use /raw/upload endpoint for PDF files
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    )

    console.log('📡 Cloudinary response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Cloudinary error response:', errorData)
      
      try {
        const errorJson = JSON.parse(errorData)
        console.error('❌ Cloudinary error details:', errorJson)
        return NextResponse.json({ 
          error: 'Upload failed', 
          details: errorJson.error?.message || errorData 
        }, { status: 500 })
      } catch {
        return NextResponse.json({ 
          error: 'Upload failed', 
          details: errorData 
        }, { status: 500 })
      }
    }

    const data = await response.json()
    console.log('✅ Upload successful:', data.secure_url)
    
    return NextResponse.json({ 
      secure_url: data.secure_url,
      public_id: data.public_id,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('💥 Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}