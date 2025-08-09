'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Upload, X, Check, AlertCircle, User, Phone, Mail, Globe, Calendar, DollarSign, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  department: string
  location: string
  companyName?: string
  admin?: {
    name?: string
  }
  resumeRequired: boolean
  questions?: Array<{
    id: string
    question: string
    type: string
    required: boolean
    options: string[]
    placeholder?: string
  }>
}

interface ApplicationData {
  // Contact Information
  phoneNumber: string
  email: string
  linkedinUrl: string
  portfolioUrl: string
  
  // Application Questions
  whyInterested: string
  relevantExperience: string
  expectedSalary: string
  availabilityStart: string
  currentEmployment: string
  relocationWillingness: string
  workAuthorization: string
  
  // Additional Information
  coverLetter: string
  additionalComments: string
  referenceSource: string
  
  // Custom questions from job posting
  customAnswers: { [key: string]: string | string[] }
}

export default function JobApplicationPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const [formData, setFormData] = useState<ApplicationData>({
    phoneNumber: '',
    email: session?.user?.email || '',
    linkedinUrl: '',
    portfolioUrl: '',
    whyInterested: '',
    relevantExperience: '',
    expectedSalary: '',
    availabilityStart: '',
    currentEmployment: '',
    relocationWillingness: '',
    workAuthorization: '',
    coverLetter: '',
    additionalComments: '',
    referenceSource: '',
    customAnswers: {}
  })

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/jobs/${id}/apply`))
      return
    }
    fetchJob()
  }, [id, session])

  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email || ''
      }))
    }
  }, [session])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data.job)
        
        // Check if user already applied
        const applicationResponse = await fetch(`/api/applications/check/${id}`)
        if (applicationResponse.ok) {
          const applicationData = await applicationResponse.json()
          if (applicationData.hasApplied) {
            router.push(`/jobs/${id}`)
            return
          }
        }
      } else if (response.status === 404) {
        router.push('/jobs')
      }
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleCustomAnswerChange = (questionId: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      customAnswers: {
        ...prev.customAnswers,
        [questionId]: value
      }
    }))
    
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }))
    }
  }

  const handleResumeUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }))
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }))
      return
    }

    setResumeFile(file)
    setIsUploadingResume(true)
    setErrors(prev => ({ ...prev, resume: '' }))

    // Upload to Cloudinary without preset
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

      if (!cloudName) {
        console.error('Cloudinary cloud name not configured')
        setErrors(prev => ({ ...prev, resume: 'File upload not configured. Please contact support.' }))
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      // Use your API key and secret for unsigned uploads
      formData.append('folder', 'resumes')
      formData.append('resource_type', 'raw')
      
      // For unsigned uploads, we'll use a different approach
      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResumeUrl(data.secure_url)
        setErrors(prev => ({ ...prev, resume: '' }))
      } else {
        const errorData = await response.json()
        console.error('Upload failed:', errorData)
        setErrors(prev => ({ ...prev, resume: errorData.error || 'Failed to upload resume. Please try again.' }))
      }
    } catch (error) {
      console.error('Error uploading resume:', error)
      setErrors(prev => ({ ...prev, resume: 'Network error. Please check your connection and try again.' }))
    } finally {
      setIsUploadingResume(false)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Required fields validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!formData.whyInterested.trim()) {
      newErrors.whyInterested = 'Please explain why you are interested in this position'
    }

    if (!formData.relevantExperience.trim()) {
      newErrors.relevantExperience = 'Please describe your relevant experience'
    }

    if (!formData.workAuthorization) {
      newErrors.workAuthorization = 'Work authorization status is required'
    }

    // Validate resume if required
    if (job?.resumeRequired && !resumeFile && !resumeUrl) {
      newErrors.resume = 'Resume is required for this position'
    }

    // Validate custom questions
    job?.questions?.forEach(question => {
      if (question.required) {
        const value = formData.customAnswers[question.id]
        if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
          newErrors[question.id] = 'This field is required'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const applicationData = {
        jobId: id,
        resumeUrl: resumeUrl,
        phoneNumber: formData.phoneNumber,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        whyInterested: formData.whyInterested,
        relevantExperience: formData.relevantExperience,
        expectedSalary: formData.expectedSalary,
        availabilityStart: formData.availabilityStart,
        currentEmployment: formData.currentEmployment,
        relocationWillingness: formData.relocationWillingness,
        workAuthorization: formData.workAuthorization,
        coverLetter: formData.coverLetter,
        additionalComments: formData.additionalComments,
        referenceSource: formData.referenceSource,
        customAnswers: job?.questions?.map(question => ({
          questionId: question.id,
          answer: Array.isArray(formData.customAnswers[question.id]) 
            ? (formData.customAnswers[question.id] as string[]).join(', ')
            : formData.customAnswers[question.id] || ''
        })) || []
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      if (response.ok) {
        router.push(`/jobs/${id}?applied=true`)
      } else {
        const errorData = await response.json()
        setErrors({ general: errorData.error || 'Failed to submit application' })
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      setErrors({ general: 'Failed to submit application. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCustomQuestion = (question: any) => {
    const value = formData.customAnswers[question.id] || ''
    const error = errors[question.id]

    switch (question.type) {
      case 'TEXT':
      case 'EMAIL':
      case 'PHONE':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={question.type === 'EMAIL' ? 'email' : question.type === 'PHONE' ? 'tel' : 'text'}
              value={value as string}
              onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        )

      case 'TEXTAREA':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value as string}
              onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        )

      case 'SELECT':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value as string}
              onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select an option</option>
              {question.options.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <Link href="/jobs" className="btn-primary">Back to Jobs</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href={`/jobs/${id}`}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Details
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Position</h1>
            <div className="text-lg text-gray-600">
              <strong>{job.title}</strong> at {job.companyName || job.admin?.name || 'Company'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {job.location} • {job.department}
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{errors.general}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio/Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Upload Section */}
            {job.resumeRequired && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resume *</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {resumeFile ? (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        {isUploadingResume ? (
                          <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-sm text-gray-700">
                          {isUploadingResume ? 'Uploading...' : resumeFile.name}
                        </span>
                        {!isUploadingResume && (
                          <button
                            type="button"
                            onClick={() => {
                              setResumeFile(null)
                              setResumeUrl('')
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600">
                        <label htmlFor="resume-upload" className="cursor-pointer text-primary-600 hover:text-primary-500">
                          Click to upload
                        </label>
                        {' '}or drag and drop
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PDF or Word document (max 5MB)</p>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleResumeUpload(file)
                        }}
                        disabled={isUploadingResume}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
              </div>
            )}

            {/* Application Questions Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Application Questions
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why are you interested in this position? *
                  </label>
                  <textarea
                    value={formData.whyInterested}
                    onChange={(e) => handleInputChange('whyInterested', e.target.value)}
                    rows={4}
                    placeholder="Explain what motivates you to apply for this role and how it aligns with your career goals..."
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical ${errors.whyInterested ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.whyInterested && <p className="mt-1 text-sm text-red-600">{errors.whyInterested}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your relevant experience *
                  </label>
                  <textarea
                    value={formData.relevantExperience}
                    onChange={(e) => handleInputChange('relevantExperience', e.target.value)}
                    rows={4}
                    placeholder="Highlight your relevant skills, experience, and accomplishments that make you a good fit for this role..."
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical ${errors.relevantExperience ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.relevantExperience && <p className="mt-1 text-sm text-red-600">{errors.relevantExperience}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.expectedSalary}
                        onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                        placeholder="e.g., $80,000 - $90,000"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.availabilityStart}
                        onChange={(e) => handleInputChange('availabilityStart', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Employment Status
                  </label>
                  <select
                    value={formData.currentEmployment}
                    onChange={(e) => handleInputChange('currentEmployment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="employed">Currently Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="student">Student</option>
                    <option value="freelancer">Freelancer/Contractor</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Are you willing to relocate? *
                  </label>
                  <div className="space-y-2">
                    {['Yes', 'No', 'Depends on the offer'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="relocationWillingness"
                          value={option}
                          checked={formData.relocationWillingness === option}
                          onChange={(e) => handleInputChange('relocationWillingness', e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Authorization Status *
                  </label>
                  <select
                    value={formData.workAuthorization}
                    onChange={(e) => handleInputChange('workAuthorization', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.workAuthorization ? 'border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select authorization status</option>
                    <option value="citizen">US Citizen</option>
                    <option value="permanent_resident">Permanent Resident</option>
                    <option value="work_visa">Work Visa (H1B, L1, etc.)</option>
                    <option value="student_visa">Student Visa (F1 with OPT/CPT)</option>
                    <option value="need_sponsorship">Need Sponsorship</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.workAuthorization && <p className="mt-1 text-sm text-red-600">{errors.workAuthorization}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about this position?
                  </label>
                  <select
                    value={formData.referenceSource}
                    onChange={(e) => handleInputChange('referenceSource', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select source</option>
                    <option value="company_website">Company Website</option>
                    <option value="job_board">Job Board (Indeed, LinkedIn, etc.)</option>
                    <option value="referral">Employee Referral</option>
                    <option value="social_media">Social Media</option>
                    <option value="career_fair">Career Fair</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    rows={4}
                    placeholder="Additional information about your qualifications and interest in the position..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={formData.additionalComments}
                    onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                    rows={3}
                    placeholder="Any additional information you'd like to share..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                  />
                </div>
              </div>
            </div>

            {/* Custom Questions from Job Posting */}
            {job.questions && job.questions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Additional Questions</h3>
                {job.questions.map(renderCustomQuestion)}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link href={`/jobs/${id}`} className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}