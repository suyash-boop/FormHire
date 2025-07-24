'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProfileSidebar from '@/components/profile/ProfileSidebar'
import ApplicationsTab from '@/components/profile/ApplicationsTab'
import ProfileTab from '@/components/profile/ProfileTab'
import { User, FileText, Settings } from 'lucide-react'

type TabType = 'applications' | 'profile' | 'settings'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('applications')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/profile'))
      return
    }
    
    setIsLoading(false)
  }, [session, status, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
              <div className="lg:col-span-3 mt-8 lg:mt-0">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  const tabs = [
    { id: 'applications' as TabType, name: 'My Applications', icon: FileText },
    { id: 'profile' as TabType, name: 'Profile', icon: User },
    { id: 'settings' as TabType, name: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your applications and profile information</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar 
              user={session.user}
              activeTab={activeTab}
              tabs={tabs}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {activeTab === 'applications' && <ApplicationsTab />}
            {activeTab === 'profile' && <ProfileTab user={session.user} />}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}