import { NextRequest, NextResponse } from 'next/server'

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

    // Create new FormData for Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    // Try without upload_preset first (this will use default settings)
    cloudinaryFormData.append('resource_type', 'raw')
    cloudinaryFormData.append('folder', 'resumes')

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    
    if (!cloudName) {
      console.log('❌ Cloud name not configured')
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    console.log('☁️ Uploading to Cloudinary:', cloudName)

    // Upload directly to Cloudinary (raw file upload)
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
      
      // Try to parse the error for more details
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