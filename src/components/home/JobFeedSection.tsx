'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, DollarSign, Building2, ChevronRight } from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string
  location: string
  salary?: string
  createdAt: string
  companyName: string
  employmentType: string
  admin?: {
    name?: string
  }
}

export default function JobFeedSection() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchJobs()
    }
  }, [session])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?limit=6') // Get latest 6 jobs
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  // Don't render anything if user is not signed in
  if (!session) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Job Opportunities
            </h2>
            <p className="text-lg text-gray-600">
              Discover new opportunities tailored for you
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden md:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <span>View All Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="card p-6 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                >
                  <Link href={`/jobs/${job.id}`} className="block">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">
                          {job.companyName || job.admin?.name || 'Company'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">{job.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">{job.department}</span>
                      </div>

                      {job.employmentType && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm capitalize">{job.employmentType.replace('-', ' ')}</span>
                        </div>
                      )}

                      {job.salary && (
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                        View Details
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/jobs"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Explore All Jobs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-600 mb-6">Check back later for new opportunities.</p>
            <Link href="/jobs" className="btn-secondary">
              Browse All Categories
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}