'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  Building,
  Search,
  Filter
} from 'lucide-react'

const ADMIN_EMAILS = [

  'suyashpadole715@gmail.com',
  'lakshay@infigon.app'
]

interface Job {
  id: string
  title: string
  description: string
  department: string
  location: string
  salary?: string
  employmentType: string
  companyName: string
  isActive: boolean
  featured: boolean
  createdAt: string
  _count: {
    applications: number
  }
}

export default function AdminJobsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isUpdating, setIsUpdating] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.email && !ADMIN_EMAILS.includes(session.user.email)) {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchJobs()
    }
  }, [status, session, router])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      } else {
        console.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    setIsUpdating(prev => ({ ...prev, [jobId]: true }))
    
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      })

      if (response.ok) {
        setJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { ...job, isActive: !currentStatus }
              : job
          )
        )
      } else {
        console.error('Failed to update job status')
      }
    } catch (error) {
      console.error('Error updating job status:', error)
    } finally {
      setIsUpdating(prev => ({ ...prev, [jobId]: false }))
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? If it has applications, it will be deactivated instead.')) {
      return
    }

    setIsUpdating(prev => ({ ...prev, [jobId]: true }))

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.message.includes('deactivated')) {
          // Job was deactivated, update the list
          setJobs(prev => 
            prev.map(job => 
              job.id === jobId 
                ? { ...job, isActive: false }
                : job
            )
          )
        } else {
          // Job was deleted, remove from list
          setJobs(prev => prev.filter(job => job.id !== jobId))
        }
      } else {
        console.error('Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    } finally {
      setIsUpdating(prev => ({ ...prev, [jobId]: false }))
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && job.isActive) ||
      (statusFilter === 'inactive' && !job.isActive) ||
      (statusFilter === 'featured' && job.featured)
    
    return matchesSearch && matchesStatus
  })

  const getJobStats = () => {
    return {
      total: jobs.length,
      active: jobs.filter(job => job.isActive).length,
      inactive: jobs.filter(job => !job.isActive).length,
      featured: jobs.filter(job => job.featured).length,
      totalApplications: jobs.reduce((sum, job) => sum + job._count.applications, 0)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const stats = getJobStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Management</h1>
              <p className="text-gray-600">Create, edit, and manage your job postings</p>
            </div>
            <Link
              href="/admin/jobs/create"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Job
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-500">
            <div className="flex items-center">
              <EyeOff className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Building className="w-5 h-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, department, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Jobs</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {jobs.length === 0 ? 'No jobs created yet' : 'No jobs match your filters'}
              </h3>
              <p className="text-gray-500 mb-6">
                {jobs.length === 0 
                  ? 'Get started by creating your first job posting.' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {jobs.length === 0 && (
                <Link
                  href="/admin/jobs/create"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Job
                </Link>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          job.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {job.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{job.companyName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job._count.applications} applications</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span>{job.employmentType}</span>
                        {job.salary && (
                          <>
                            <span>•</span>
                            <span>{job.salary}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      
                      <button
                        onClick={() => toggleJobStatus(job.id, job.isActive)}
                        disabled={isUpdating[job.id]}
                        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          job.isActive
                            ? 'border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                            : 'border border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {job.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={isUpdating[job.id]}
                        className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Summary */}
        {filteredJobs.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredJobs.length} of {jobs.length} jobs
            {statusFilter && ` • Filtered by: ${statusFilter}`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}