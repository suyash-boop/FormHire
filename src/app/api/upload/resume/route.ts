import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting simple file upload...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create new FormData for Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('upload_preset', 'ml_default') // Use default unsigned preset
    cloudinaryFormData.append('folder', 'resumes')

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    
    if (!cloudName) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    // Upload directly to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Cloudinary error:', errorData)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      secure_url: data.secure_url,
      public_id: data.public_id,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' }, 
      { status: 500 }
    )
  }
}