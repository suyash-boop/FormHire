'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar, 
  MapPin, 
  Building2,
  Search,
  Filter
} from 'lucide-react'

interface Application {
  id: string
  status: string
  appliedAt: string
  resumeUrl?: string
  job: {
    id: string
    title: string
    department: string
    location: string
    admin: {
      name: string
    }
  }
  answers: Array<{
    id: string
    answer: string
    question: {
      question: string
    }
  }>
}

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications/user')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'REVIEWED':
        return <Eye className="w-4 h-4 text-blue-500" />
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Under Review', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' }
      case 'REVIEWED':
        return { text: 'Reviewed', color: 'text-blue-700 bg-blue-50 border-blue-200' }
      case 'ACCEPTED':
        return { text: 'Accepted', color: 'text-green-700 bg-green-50 border-green-200' }
      case 'REJECTED':
        return { text: 'Not Selected', color: 'text-red-700 bg-red-50 border-red-200' }
      default:
        return { text: status, color: 'text-gray-700 bg-gray-50 border-gray-200' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
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
          <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
          <span className="text-sm text-gray-600">
            {filteredApplications.length} of {applications.length} applications
          </span>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by job title, company, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Under Review</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Not Selected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="p-6">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </h3>
            <p className="text-gray-600 mb-6">
              {applications.length === 0 
                ? 'Start exploring jobs and submit your first application!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            <Link href="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusInfo = getStatusText(application.status)
              return (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        <Link 
                          href={`/jobs/${application.job.id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {application.job.title}
                        </Link>
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span className="font-medium">{application.job.admin.name}</span>
                      </div>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {application.job.location}
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {application.job.department}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied {formatDate(application.appliedAt)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {application.answers.length > 0 && (
                        <span>{application.answers.length} questions answered</span>
                      )}
                      {application.resumeUrl && (
                        <span className="ml-4">Resume submitted</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/jobs/${application.job.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Job
                      </Link>
                      {application.resumeUrl && (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium ml-4"
                        >
                          View Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}