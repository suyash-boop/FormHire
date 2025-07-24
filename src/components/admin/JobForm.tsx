'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Star
} from 'lucide-react'

interface JobFormProps {
  adminId: string
  job?: any // For editing existing jobs
  isEditing?: boolean
}

export default function JobForm({ adminId, job, isEditing = false }: JobFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    department: job?.department || '',
    location: job?.location || '',
    salary: job?.salary || '',
    employmentType: job?.employmentType || 'full-time',
    experienceLevel: job?.experienceLevel || 'mid',
    companyName: job?.companyName || '',
    companyLogo: job?.companyLogo || '',
    companyWebsite: job?.companyWebsite || '',
    companySize: job?.companySize || '',
    resumeRequired: job?.resumeRequired ?? true,
    featured: job?.featured ?? false,
    isActive: job?.isActive ?? true,
  })
  
  const [skills, setSkills] = useState<string[]>(job?.skills || [])
  const [benefits, setBenefits] = useState<string[]>(job?.benefits || [])
  const [newSkill, setNewSkill] = useState('')
  const [newBenefit, setNewBenefit] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()])
      setNewBenefit('')
    }
  }

  const removeBenefit = (benefitToRemove: string) => {
    setBenefits(benefits.filter(benefit => benefit !== benefitToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const jobData = {
        ...formData,
        skills,
        benefits,
      }

      const url = isEditing ? `/api/admin/jobs/${job.id}` : '/api/admin/jobs'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        router.push('/admin?tab=jobs')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to save job')
      }
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Job' : 'Create New Job'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update job details and requirements.' : 'Fill in the details for your new job posting.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <input
              type="text"
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. Engineering"
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Company Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. TechCorp Inc."
              />
            </div>

            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                Company Website
              </label>
              <input
                type="url"
                id="companyWebsite"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo URL
              </label>
              <input
                type="url"
                id="companyLogo"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://company.com/logo.png"
              />
            </div>

            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. New York, NY or Remote"
              />
            </div>

            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                id="employmentType"
                name="employmentType"
                required
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                required
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead/Principal</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. $80,000 - $120,000 per year"
            />
          </div>
        </div>

        {/* Description and Requirements */}
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              />
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                required
                rows={6}
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="List the required qualifications, experience, and skills..."
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Required Skills</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a skill (e.g. React, Python, SQL)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {benefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                {benefit}
                <button
                  type="button"
                  onClick={() => removeBenefit(benefit)}
                  className="ml-2 inline-flex items-center p-0.5 rounded-full text-green-400 hover:text-green-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a benefit (e.g. Health Insurance, Remote Work)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="resumeRequired"
                name="resumeRequired"
                checked={formData.resumeRequired}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="resumeRequired" className="ml-2 block text-sm text-gray-700">
                Resume required for application
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured job (appears at the top of listings)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Job is active and accepting applications
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin?tab=jobs')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : (isEditing ? 'Update Job' : 'Create Job')}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}