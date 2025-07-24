'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building, 
  Download,
  Eye,
  EyeOff,
  Filter,
  Search,
  ChevronDown,
  ExternalLink,
  FileText,
  Globe,
  Linkedin,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Application {
  id: string
  status: string
  appliedAt: string
  phoneNumber: string
  linkedinUrl?: sftring
  portfolioUrl?: string
  whyInterested: string
  relevantExperience: string
  expectedSalary?: string
  availabilityStart?: string
  currentEmployment?: string
  relocationWillingness?: string
  workAuthorization: string
  coverLetter?: string
  additionalComments?: string
  referenceSource?: string
  resumeUrl?: string
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
  job: {
    id: string
    title: string
    companyName: string
    department: string
    location: string
    employmentType: string
  }
  answers: Array<{
    id: string
    answer: string
    question: {
      id: string
      question: string
      type: string
      required: boolean
    }
  }>
}

const ADMIN_EMAILS = [
  
  'suyashpadole715@gmail.com',
  'lakshay@infigon.app',
]

export default function AdminApplicationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({})
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
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
      fetchApplications()
    }
  }, [status, session, router])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      } else {
        console.error('Failed to fetch applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    setIsUpdating(prev => ({ ...prev, [applicationId]: true }))
    
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
          notes: `Status changed to ${newStatus.replace('_', ' ').toLowerCase()}`
        }),
      })

      if (response.ok) {
        // Update the application in state instead of refetching all
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus.toUpperCase() }
              : app
          )
        )
      } else {
        console.error('Failed to update application status')
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    } finally {
      setIsUpdating(prev => ({ ...prev, [applicationId]: false }))
    }
  }

  const toggleDetails = (applicationId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'reviewed': return <Eye className="w-4 h-4" />
      case 'interview_scheduled': return <Calendar className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusCounts = () => {
    const counts = {
      total: applications.length,
      pending: applications.filter(app => app.status.toLowerCase() === 'pending').length,
      reviewed: applications.filter(app => app.status.toLowerCase() === 'reviewed').length,
      interview_scheduled: applications.filter(app => app.status.toLowerCase() === 'interview_scheduled').length,
      accepted: applications.filter(app => app.status.toLowerCase() === 'accepted').length,
      rejected: applications.filter(app => app.status.toLowerCase() === 'rejected').length,
    }
    return counts
  }

  const filteredApplications = applications.filter(app => {
    const matchesStatus = !statusFilter || app.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesSearch = !searchTerm || 
      app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
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

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
          <p className="text-gray-600">Review and manage job applications across all positions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-500">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.reviewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Interview</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.interview_scheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.accepted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
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
                  placeholder="Search by name, email, job title, or company..."
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
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your filters or search terms.' 
                  : 'Applications will appear here when candidates apply for jobs.'
                }
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Application Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          {application.user.image ? (
                            <img
                              src={application.user.image}
                              alt={application.user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.user.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">{application.user.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{application.job.title}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{application.job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span>{application.status.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      
                      <select
                        value={application.status}
                        onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                        disabled={isUpdating[application.id]}
                        className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      
                      <button
                        onClick={() => toggleDetails(application.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                      >
                        {showDetails[application.id] ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span className="text-sm">Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">View</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Info Row */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{application.phoneNumber}</span>
                    </div>
                    {application.expectedSalary && (
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Expected:</span>
                        <span>{application.expectedSalary}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Auth:</span>
                      <span>{application.workAuthorization.replace('_', ' ')}</span>
                    </div>
                    {application.resumeUrl && (
                      <a 
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Resume</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Application Details */}
                {showDetails[application.id] && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact & Links */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact & Links</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <a href={`mailto:${application.user.email}`} className="text-primary-600 hover:text-primary-700">
                                {application.user.email}
                              </a>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <a href={`tel:${application.phoneNumber}`} className="text-primary-600 hover:text-primary-700">
                                {application.phoneNumber}
                              </a>
                            </div>
                            {application.linkedinUrl && (
                              <div className="flex items-center space-x-3">
                                <Linkedin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <a 
                                  href={application.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                                >
                                  <span>LinkedIn Profile</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                            {application.portfolioUrl && (
                              <div className="flex items-center space-x-3">
                                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <a 
                                  href={application.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                                >
                                  <span>Portfolio/Website</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                            {application.resumeUrl && (
                              <div className="flex items-center space-x-3">
                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <a 
                                  href={application.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                                >
                                  <span>Download Resume</span>
                                  <Download className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Application Details */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h4>
                          <div className="space-y-3 text-sm">
                            {application.expectedSalary && (
                              <div>
                                <span className="font-medium text-gray-700">Expected Salary:</span>
                                <p className="text-gray-600 mt-1">{application.expectedSalary}</p>
                              </div>
                            )}
                            {application.availabilityStart && (
                              <div>
                                <span className="font-medium text-gray-700">Available Start Date:</span>
                                <p className="text-gray-600 mt-1">{new Date(application.availabilityStart).toLocaleDateString()}</p>
                              </div>
                            )}
                            {application.currentEmployment && (
                              <div>
                                <span className="font-medium text-gray-700">Current Employment:</span>
                                <p className="text-gray-600 mt-1">{application.currentEmployment}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-700">Work Authorization:</span>
                              <p className="text-gray-600 mt-1">{application.workAuthorization.replace('_', ' ')}</p>
                            </div>
                            {application.relocationWillingness && (
                              <div>
                                <span className="font-medium text-gray-700">Willing to Relocate:</span>
                                <p className="text-gray-600 mt-1">{application.relocationWillingness}</p>
                              </div>
                            )}
                            {application.referenceSource && (
                              <div>
                                <span className="font-medium text-gray-700">How they heard about us:</span>
                                <p className="text-gray-600 mt-1">{application.referenceSource.replace('_', ' ')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Application Responses */}
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-6">Application Responses</h4>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Why are you interested in this position?
                            </label>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{application.whyInterested}</p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Describe your relevant experience
                            </label>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{application.relevantExperience}</p>
                            </div>
                          </div>

                          {application.coverLetter && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Cover Letter
                              </label>
                              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{application.coverLetter}</p>
                              </div>
                            </div>
                          )}

                          {application.additionalComments && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Additional Comments
                              </label>
                              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{application.additionalComments}</p>
                              </div>
                            </div>
                          )}

                          {/* Custom Questions */}
                          {application.answers.length > 0 && (
                            <div>
                              <h5 className="text-md font-semibold text-gray-900 mb-4">Custom Questions & Answers</h5>
                              <div className="space-y-4">
                                {application.answers.map((answer) => (
                                  <div key={answer.id}>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                      {answer.question.question}
                                      {answer.question.required && <span className="text-red-500 ml-1">*</span>}
                                      <span className="text-xs text-gray-500 ml-2">({answer.question.type})</span>
                                    </label>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{answer.answer}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Results Summary */}
        {filteredApplications.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredApplications.length} of {applications.length} applications
            {statusFilter && ` • Filtered by: ${statusFilter.replace('_', ' ')}`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}