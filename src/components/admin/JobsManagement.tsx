'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building2,
  Clock,
  Star,
  MoreVertical
} from 'lucide-react'

interface Job {
  id: string
  title: string
  description: string
  requirements: string
  department: string
  location: string
  salary?: string
  employmentType: string
  experienceLevel: string
  skills: string[]
  benefits: string[]
  companyName: string
  companyLogo?: string
  companyWebsite?: string
  companySize?: string
  resumeRequired: boolean
  isActive: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  _count: {
    applications: number
  }
}

interface JobsManagementProps {
  adminId: string
}

export default function JobsManagement({ adminId }: JobsManagementProps) {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, statusFilter, departmentFilter])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/admin/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'ACTIVE') {
        filtered = filtered.filter(job => job.isActive)
      } else if (statusFilter === 'INACTIVE') {
        filtered = filtered.filter(job => !job.isActive)
      } else if (statusFilter === 'FEATURED') {
        filtered = filtered.filter(job => job.featured)
      }
    }

    // Filter by department
    if (departmentFilter !== 'ALL') {
      filtered = filtered.filter(job => job.department === departmentFilter)
    }

    setFilteredJobs(filtered)
  }

  const toggleJobStatus = async (jobId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        setJobs(jobs =>
          jobs.map(job =>
            job.id === jobId ? { ...job, isActive: !isActive } : job
          )
        )
      }
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setJobs(jobs => jobs.filter(job => job.id !== jobId))
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const uniqueDepartments = [...new Set(jobs.map(job => job.department))]

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Jobs Management</h2>
          <button
            onClick={() => router.push('/admin/jobs/create')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by job title, department, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="FEATURED">Featured</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="ALL">All Departments</option>
              {uniqueDepartments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {jobs.length === 0 ? 'No jobs posted yet' : 'No matching jobs found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {jobs.length === 0 
                ? 'Start by creating your first job posting to attract candidates.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {jobs.length === 0 && (
              <button
                onClick={() => router.push('/admin/jobs/create')}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Post Your First Job</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {job.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {job.companyName}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.department}
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job._count.applications} applications
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Posted {formatDate(job.createdAt)}
                      </div>
                      <span className="capitalize">{job.employmentType}</span>
                      <span className="capitalize">{job.experienceLevel} level</span>
                    </div>

                    {job.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="text-xs text-gray-500">
                              +{job.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="View job"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit job"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleJobStatus(job.id, job.isActive)}
                      className={`p-2 transition-colors ${
                        job.isActive 
                          ? 'text-gray-400 hover:text-red-600' 
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                      title={job.isActive ? 'Deactivate job' : 'Activate job'}
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}