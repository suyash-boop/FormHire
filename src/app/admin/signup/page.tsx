'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ShieldX } from 'lucide-react'

export default function AdminSignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin dashboard after a delay
    const timer = setTimeout(() => {
      router.push('/admin')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-4">
              Admin access is restricted to authorized personnel only.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you believe you should have admin access, please contact the website administrator.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Admin accounts are managed by email authorization. 
                Only specific email addresses can access the admin panel.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Redirecting to admin dashboard...
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}