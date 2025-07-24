'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JobForm from '@/components/admin/JobForm'

export default function CreateJobPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [adminData, setAdminData] = useState<any>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/admin/jobs/create'))
      return
    }
    
    checkAdminAccess()
  }, [session, status, router])

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/verify')
      if (response.ok) {
        const data = await response.json()
        setAdminData(data.admin)
        setIsLoading(false)
      } else {
        router.push('/signin')
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/signin')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!adminData) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            ← Back to Admin Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
          <p className="text-gray-600 mt-2">Create a new job posting to attract qualified candidates.</p>
        </div>

        <JobForm adminId={adminData.id} />
      </div>

      <Footer />
    </div>
  )
}