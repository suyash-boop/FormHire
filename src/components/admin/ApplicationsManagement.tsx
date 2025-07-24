'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye,
  Download,
  Calendar,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react'

interface Application {
  id: string
  status: string
  coverLetter?: string
  appliedAt: string
  user: {
    name?: string
    email: string
    phone?: string
    resume?: string
    bio?: string
    location?: string
    linkedin?: string
    github?: string
    skills: string[]
    experience?: string
  }
  job: {
    id: string
    title: string
    department: string
    location: string
    companyName: string
  }
}

interface ApplicationsManagementProps {
  adminId: string
}

export default function ApplicationsManagement({ adminId }: ApplicationsManagementProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications')
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
        app.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setApplications(apps =>
          apps.map(app =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        )
        
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null)
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'REVIEWED':
        return <Eye className="w-4 h-4 text-blue-500" />
      case 'INTERVIEW':
        return <Calendar className="w-4 h-4 text-purple-500" />
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800'
      case 'INTERVIEW':
        return 'bg-purple-100 text-purple-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <h2 className="text-xl font-semibold text-gray-900">Applications Management</h2>
          <div className="text-sm text-gray-600">
            {applications.length} total applications
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by candidate name, email, job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="INTERVIEW">Interview</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      </div>

      {/* Applications List */}
      <div className="p-6">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {applications.length === 0 ? 'No applications yet' : 'No matching applications found'}
            </h3>
            <p className="text-gray-600">
              {applications.length === 0 
                ? 'Applications will appear here once candidates start applying to your jobs.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.user.name || 'Anonymous Candidate'}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status.toLowerCase()}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {application.user.email}
                      </div>
                      {application.user.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {application.user.phone}
                        </div>
                      )}
                      {application.user.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {application.user.location}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        Applied for: {application.job.title}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(application.appliedAt)}
                      </div>
                    </div>

                    {application.user.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {application.user.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {application.user.skills.length > 5 && (
                            <span className="text-xs text-gray-500">
                              +{application.user.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="View application details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {application.user.resume && (
                      <a
                        href={application.user.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="View resume"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}

                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Cover Letter:</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {application.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Application Details
              </h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Candidate Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name:</label>
                    <p className="text-gray-900">{selectedApplication.user.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email:</label>
                    <p className="text-gray-900">{selectedApplication.user.email}</p>
                  </div>
                  {selectedApplication.user.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone:</label>
                      <p className="text-gray-900">{selectedApplication.user.phone}</p>
                    </div>
                  )}
                  {selectedApplication.user.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location:</label>
                      <p className="text-gray-900">{selectedApplication.user.location}</p>
                    </div>
                  )}
                  {selectedApplication.user.experience && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Experience Level:</label>
                      <p className="text-gray-900 capitalize">{selectedApplication.user.experience}</p>
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="mt-6">
                  <h5 className="text-md font-semibold text-gray-900 mb-2">Links</h5>
                  <div className="space-y-2">
                    {selectedApplication.user.resume && (
                      <a
                        href={selectedApplication.user.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        View Resume
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                    {selectedApplication.user.linkedin && (
                      <a
                        href={selectedApplication.user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        LinkedIn Profile
                      </a>
                    )}
                    {selectedApplication.user.github && (
                      <a
                        href={selectedApplication.user.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        GitHub Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Job & Application Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Position:</label>
                    <p className="text-gray-900">{selectedApplication.job.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company:</label>
                    <p className="text-gray-900">{selectedApplication.job.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department:</label>
                    <p className="text-gray-900">{selectedApplication.job.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Applied Date:</label>
                    <p className="text-gray-900">{formatDate(selectedApplication.appliedAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      <span className="ml-1 capitalize">{selectedApplication.status.toLowerCase()}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Update Status:</label>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills */}
            {selectedApplication.user.skills.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {selectedApplication.user.bio && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Bio</h4>
                <p className="text-gray-700">{selectedApplication.user.bio}</p>
              </div>
            )}

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}