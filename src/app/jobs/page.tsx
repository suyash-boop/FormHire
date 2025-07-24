'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar,
  DollarSign,
  Users,
  Building,
  Filter,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  SlidersHorizontal
} from 'lucide-react'

interface Job {
  id: string
  title: string
  description: string
  department: string
  location: string
  salary?: string
  employmentType: string
  experienceLevel: string
  companyName: string
  companySize?: string
  skills: string[]
  featured: boolean
  createdAt: string
  _count: {
    applications: number
  }
}

interface FilterOptions {
  departments: string[]
  locations: string[]
  companies: string[]
  employmentTypes: string[]
  experienceLevels: string[]
  companySizes: string[]
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNext: boolean
  hasPrev: boolean
}

function JobsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departments: [],
    locations: [],
    companies: [],
    employmentTypes: [],
    experienceLevels: [],
    companySizes: []
  })
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    department: '',
    employmentType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    featured: false,
    companySize: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      department: searchParams.get('department') || '',
      employmentType: searchParams.get('employmentType') || '',
      experienceLevel: searchParams.get('experienceLevel') || '',
      salaryMin: searchParams.get('salaryMin') || '',
      salaryMax: searchParams.get('salaryMax') || '',
      skills: searchParams.get('skills') || '',
      featured: searchParams.get('featured') === 'true',
      companySize: searchParams.get('companySize') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    }
    setFilters(urlFilters)
  }, [searchParams])

  const fetchJobs = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value.toString())
        }
      })
      
      params.append('page', page.toString())
      params.append('limit', '12')

      const response = await fetch(`/api/jobs?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
        setPagination(data.pagination)
        setFilterOptions(data.filterOptions)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchJobs(1)
  }, [fetchJobs])

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(updated).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const newUrl = params.toString() ? `/jobs?${params.toString()}` : '/jobs'
    window.history.pushState({}, '', newUrl)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      department: '',
      employmentType: '',
      experienceLevel: '',
      salaryMin: '',
      salaryMax: '',
      skills: '',
      featured: false,
      companySize: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    router.push('/jobs')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs(1)
  }

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false
      return value && value !== ''
    }).length
  }

  const formatSalary = (salary?: string) => {
    if (!salary) return 'Salary not specified'
    return salary
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Posted today'
    if (diffDays <= 7) return `Posted ${diffDays} days ago`
    return `Posted on ${date.toLocaleDateString()}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">
            Discover {pagination.totalCount} opportunities waiting for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="lg:w-64">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Search Jobs
              </button>
            </div>
          </form>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  updateFilters({ sortBy, sortOrder })
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="company-asc">Company A-Z</option>
                <option value="company-desc">Company Z-A</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => updateFilters({ department: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Departments</option>
                    {filterOptions.departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={filters.employmentType}
                    onChange={(e) => updateFilters({ employmentType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {filterOptions.employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => updateFilters({ experienceLevel: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {filterOptions.experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={filters.companySize}
                    onChange={(e) => updateFilters({ companySize: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Sizes</option>
                    {filterOptions.companySizes.map(size => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, Python"
                    value={filters.skills}
                    onChange={(e) => updateFilters({ skills: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Min"
                      value={filters.salaryMin}
                      onChange={(e) => updateFilters({ salaryMin: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Max"
                      value={filters.salaryMax}
                      onChange={(e) => updateFilters({ salaryMax: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => updateFilters({ featured: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured jobs only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {((pagination.currentPage - 1) * 12) + 1} to {Math.min(pagination.currentPage * 12, pagination.totalCount)} of {pagination.totalCount} jobs
          </p>
        </div>

        {/* Job Cards */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or clearing filters.</p>
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                          <Link href={`/jobs/${job.id}`}>
                            {job.title}
                          </Link>
                        </h3>
                        {job.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-primary-600 font-medium mb-3">{job.companyName}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.department} • {job.employmentType}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {formatSalary(job.salary)}
                    </div>
                    {job.companySize && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {job.companySize} employees
                      </div>
                    )}
                  </div>

                  {job.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(job.createdAt)}
                    </div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => fetchJobs(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1
              const isCurrentPage = page === pagination.currentPage
              
              // Show only a subset of pages around current page
              if (
                page === 1 || 
                page === pagination.totalPages || 
                (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => fetchJobs(page)}
                    className={`px-3 py-2 border rounded-lg ${
                      isCurrentPage
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              } else if (
                page === pagination.currentPage - 3 || 
                page === pagination.currentPage + 3
              ) {
                return <span key={page} className="px-2">...</span>
              }
              return null
            })}

            <button
              onClick={() => fetchJobs(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsContent />
    </Suspense>
  )
}