'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Users, 
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  Send,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  Phone,
  Mail,
  User
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
  companyName: string
  companyLogo?: string
  companyWebsite?: string
  companySize?: string
  skills: string[]
  benefits: string[]
  featured: boolean
  createdAt: string
  resumeRequired: boolean
  admin?: {
    name?: string
    email?: string
  }
  _count: {
    applications: number
  }
}

interface Application {
  id: string
  status: string
  appliedAt: string
}

interface ApplicationForm {
  coverLetter: string
  experience: string
  availability: string
  expectedSalary: string
  phoneNumber: string
  linkedinUrl: string
  portfolioUrl: string
  whyInterested: string
  relevantExperience: string
  availability_start: string
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [application, setApplication] = useState<Application | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    coverLetter: '',
    experience: '',
    availability: '',
    expectedSalary: '',
    phoneNumber: '',
    linkedinUrl: '',
    portfolioUrl: '',
    whyInterested: '',
    relevantExperience: '',
    availability_start: ''
  })

  useEffect(() => {
    fetchJob()
    if (session) {
      checkApplicationStatus()
    }
  }, [params.id, session])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data.job)
      } else if (response.status === 404) {
        setJob(null)
      }
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch(`/api/applications/check/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setHasApplied(data.hasApplied)
        setApplication(data.application)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }

  const handleInputChange = (field: keyof ApplicationForm, value: string) => {
    setApplicationForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/jobs/${params.id}`)
      return
    }

    // Validate required fields
    if (!applicationForm.whyInterested.trim()) {
      alert('Please explain why you are interested in this position.')
      return
    }

    if (!applicationForm.relevantExperience.trim()) {
      alert('Please describe your relevant experience.')
      return
    }

    setIsApplying(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: params.id,
          ...applicationForm,
        }),
      })

      if (response.ok) {
        setHasApplied(true)
        setShowApplicationForm(false)
        setApplicationForm({
          coverLetter: '',
          experience: '',
          availability: '',
          expectedSalary: '',
          phoneNumber: '',
          linkedinUrl: '',
          portfolioUrl: '',
          whyInterested: '',
          relevantExperience: '',
          availability_start: ''
        })
        await checkApplicationStatus()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error applying to job:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsApplying(false)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'REVIEWED':
        return 'text-blue-600 bg-blue-100'
      case 'INTERVIEW':
        return 'text-purple-600 bg-purple-100'
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100'
      case 'REJECTED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
            <p className="text-gray-600 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Go Back
              </button>
              <button
                onClick={() => router.push('/jobs')}
                className="btn-primary"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to jobs
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-4">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <Building2 className="w-5 h-5 mr-2" />
                  {job.companyName || job.admin?.name || 'Company'}
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="capitalize">{job.experienceLevel} Level</span>
                </div>
                
                {job.salary && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salary}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Posted {formatDate(job.createdAt)}
                </div>
              </div>

              {/* Application Stats */}
              <div className="flex items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                <Users className="w-4 h-4 mr-2" />
                {job._count.applications} applications received
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="text-gray-700 leading-relaxed">
                <div 
                  className="whitespace-pre-wrap break-words"
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                >
                  {job.description}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="text-gray-700 leading-relaxed">
                <div 
                  className="whitespace-pre-wrap break-words"
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                >
                  {job.requirements}
                </div>
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, index) => (
                    <span
                      key={`${benefit}-${index}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status or Apply Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {hasApplied && application ? (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Application Submitted
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Applied on {formatDate(application.appliedAt)}
                  </p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                  </div>
                </div>
              ) : showApplicationForm ? (
                <form onSubmit={handleApply} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Apply for this Position</h3>
                    <p className="text-sm text-gray-600">Complete the form below to submit your application</p>
                  </div>
                  
                  {job.resumeRequired && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Resume Required</p>
                          <p className="text-sm text-blue-700">
                            Make sure your profile includes an up-to-date resume for this position.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Contact Information
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            id="phoneNumber"
                            required
                            value={applicationForm.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          id="linkedinUrl"
                          value={applicationForm.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div>
                        <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          Portfolio/Website
                        </label>
                        <input
                          type="url"
                          id="portfolioUrl"
                          value={applicationForm.portfolioUrl}
                          onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Application Questions */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Application Questions</h4>
                    
                    <div>
                      <label htmlFor="whyInterested" className="block text-sm font-medium text-gray-700 mb-2">
                        Why are you interested in this position? *
                      </label>
                      <textarea
                        id="whyInterested"
                        required
                        value={applicationForm.whyInterested}
                        onChange={(e) => handleInputChange('whyInterested', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                        placeholder="Explain what motivates you to apply for this role and how it aligns with your career goals..."
                      />
                    </div>

                    <div>
                      <label htmlFor="relevantExperience" className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your relevant experience *
                      </label>
                      <textarea
                        id="relevantExperience"
                        required
                        value={applicationForm.relevantExperience}
                        onChange={(e) => handleInputChange('relevantExperience', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                        placeholder="Highlight your relevant skills, experience, and accomplishments that make you a good fit for this role..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="availability_start" className="block text-sm font-medium text-gray-700 mb-1">
                          Available Start Date
                        </label>
                        <input
                          type="date"
                          id="availability_start"
                          value={applicationForm.availability_start}
                          onChange={(e) => handleInputChange('availability_start', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Salary
                        </label>
                        <input
                          type="text"
                          id="expectedSalary"
                          value={applicationForm.expectedSalary}
                          onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., $80,000 - $90,000"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Comments
                      </label>
                      <textarea
                        id="coverLetter"
                        value={applicationForm.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isApplying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Ready to apply?
                  </h3>
                  {session ? (
                    <button
                      onClick={() => router.push(`/jobs/${params.id}/apply`)}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Apply Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/auth/signin?callbackUrl=/jobs/${params.id}`)}
                      className="w-full btn-primary"
                    >
                      Sign In to Apply
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">About the Company</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Company</h4>
                  <p className="text-gray-900">{job.companyName || job.admin?.name || 'Company'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Department</h4>
                  <p className="text-gray-900">{job.department}</p>
                </div>
                
                {job.companySize && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Company Size</h4>
                    <p className="text-gray-900">{job.companySize}</p>
                  </div>
                )}
                
                {job.companyWebsite && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Website</h4>
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 break-all"
                    >
                      {job.companyWebsite}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}