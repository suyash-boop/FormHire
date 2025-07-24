import Link from 'next/link'
import { MapPin, Building2, Clock, Users, DollarSign, ChevronRight } from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string
  location: string
  salary?: string
  description: string
  createdAt: string
  admin: {
    name: string
  }
  _count: {
    applications: number
  }
}

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
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

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium">{job.admin.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end ml-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
              {formatDate(job.createdAt)}
            </span>
            {job._count.applications > 0 && (
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Users className="w-3 h-3 mr-1" />
                <span>{job._count.applications} applied</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {truncateDescription(job.description)}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm">{job.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm">{job.department}</span>
          </div>

          {job.salary && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium text-green-600">{job.salary}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
            View Details & Apply
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
        </div>
      </Link>
    </div>
  )
}