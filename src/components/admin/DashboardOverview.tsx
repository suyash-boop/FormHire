'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Briefcase, 
  Users, 
  Eye, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  Building2,
  FileText,
  Plus
} from 'lucide-react'

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  totalUsers: number
  recentApplications: Array<{
    id: string
    applicantName: string
    applicantEmail: string
    jobTitle: string
    companyName: string
    appliedAt: string
    status: string
  }>
}

interface DashboardOverviewProps {
  adminId: string
  onTabChange?: (tab: string) => void
}

export default function DashboardOverview({ adminId, onTabChange }: DashboardOverviewProps) {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch dashboard stats')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'REVIEWED':
        return <Eye className="w-4 h-4 text-blue-500" />
      case 'INTERVIEW_SCHEDULED':
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
      case 'INTERVIEW_SCHEDULED':
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleQuickAction = (action: string) => {
    if (action === 'create-job') {
      router.push('/admin/jobs/create')
    } else if (action === 'applications') {
      router.push('/admin/applications')
    } else if (action === 'jobs') {
      router.push('/admin/jobs')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Recent Applications */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">Unable to fetch dashboard data. Please try refreshing the page.</p>
          <button 
            onClick={fetchDashboardStats}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/admin/jobs/create"
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-4 transition-colors group"
        >
          <div className="flex items-center">
            <Plus className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold">Create Job</h3>
              <p className="text-primary-100 text-sm">Post new position</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/applications"
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 transition-colors group"
        >
          <div className="flex items-center">
            <FileText className="w-6 h-6 mr-3 text-primary-600 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-gray-900">Applications</h3>
              <p className="text-gray-600 text-sm">{stats.pendingApplications} pending</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/jobs"
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 transition-colors group"
        >
          <div className="flex items-center">
            <Briefcase className="w-6 h-6 mr-3 text-primary-600 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-gray-900">Manage Jobs</h3>
              <p className="text-gray-600 text-sm">{stats.activeJobs} active</p>
            </div>
          </div>
        </Link>

        <button
          onClick={() => router.push('/admin/settings')}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 transition-colors group"
        >
          <div className="flex items-center">
            <Building2 className="w-6 h-6 mr-3 text-primary-600 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-gray-900">Settings</h3>
              <p className="text-gray-600 text-sm">Configure</p>
            </div>
          </div>
        </button>
      </div>

      {/* Website Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
            <p className="text-sm text-gray-600">Total Jobs</p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
            <p className="text-sm text-gray-600">Active Jobs</p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            <p className="text-sm text-gray-600">Total Applications</p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
              <UserPlus className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">Registered Users</p>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <Link 
            href="/admin/applications"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="p-6">
          {stats.recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">Applications will appear here once candidates start applying.</p>
              <Link
                href="/admin/jobs/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{application.applicantName}</h4>
                      <p className="text-sm text-gray-600">{application.applicantEmail}</p>
                      <p className="text-xs text-gray-500">
                        Applied for <span className="font-medium">{application.jobTitle}</span> at {application.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{application.status.replace('_', ' ')}</span>
                    </span>
                    <div className="text-sm text-gray-500">
                      {formatDate(application.appliedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickAction('create-job')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Plus className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block font-medium text-gray-900">Post New Job</span>
              <span className="block text-sm text-gray-600">Create a new job posting</span>
            </div>
          </button>
          
          <button 
            onClick={() => handleQuickAction('applications')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <FileText className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block font-medium text-gray-900">Review Applications</span>
              <span className="block text-sm text-gray-600">Manage candidate applications</span>
            </div>
          </button>
          
          <button 
            onClick={() => handleQuickAction('jobs')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Briefcase className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block font-medium text-gray-900">Manage Jobs</span>
              <span className="block text-sm text-gray-600">Edit existing job postings</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}