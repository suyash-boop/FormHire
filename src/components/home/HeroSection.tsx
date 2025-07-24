'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Search, MapPin, Info, Shield, Eye, EyeOff } from 'lucide-react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session, update } = useSession()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to jobs page with search parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    router.push(`/jobs?${params.toString()}`)
  }

  const handleAdminAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (adminPassword !== 'infugon') {
      setError('❌ Incorrect password!')
      return
    }

    setIsLoading(true)
    
    try {
      
      // Make API call to update user role to admin
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: adminPassword }),
      })

      
      const data = await response.json()

      if (response.ok) {
        // Update the session to reflect admin role
        await update()
        
        alert('🎉 Welcome Admin! You now have admin privileges. Page will reload.')
        setShowAdminModal(false)
        setAdminPassword('')
        setError('')
        
        // Force page reload to ensure session is updated everywhere
        window.location.reload()
      } else {
        setError(data.error || 'Failed to grant admin access')
      }
    } catch (error) {
      console.error('Admin access error:', error)
      setError('❌ Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Dream Job
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto animate-slide-up">
            Connect with top companies and discover opportunities that match your skills and ambitions
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-6 animate-slide-up">
            <div className="bg-white rounded-lg shadow-xl p-4 flex flex-col md:flex-row gap-4">
              {/* Job Title Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Location Search */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search Jobs</span>
              </button>
            </div>
          </form>

          {/* Assignment Disclaimer */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="inline-flex items-center bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-2 text-blue-100">
              <Info className="w-4 h-4 mr-2 text-blue-300" />
              <span className="text-sm">
                📝 This website is created for assignment purposes for{' '}
                <span className="font-semibold text-blue-200">Infugon Technologies</span>
              </span>
            </div>
          </div>

          {/* Admin Access Button - Only show if user is logged in but not admin */}
          {/* {session && session.user.role !== 'ADMIN' && (
            <div className="max-w-4xl mx-auto mb-12">
              <button
                onClick={() => setShowAdminModal(true)}
                className="inline-flex items-center bg-red-600/20 hover:bg-red-600/30 border border-red-400/30 rounded-lg px-4 py-2 text-red-100 hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">🔐 Get Admin Access</span>
              </button>
            </div>
          )} */}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">10,000+</div>
              <div className="text-blue-200">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">5,000+</div>
              <div className="text-blue-200">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">50,000+</div>
              <div className="text-blue-200">Happy Candidates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Access Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Access</h3>
              <p className="text-gray-600 text-sm">
                Enter the admin password to gain administrative privileges
              </p>
            </div>

            <form onSubmit={handleAdminAccess} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none pr-12 text-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false)
                    setAdminPassword('')
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Become Admin'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                💡 Hint: The password is the company name in lowercase
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-20 text-white"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39 116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}