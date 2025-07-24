'use client'

import { useState, useEffect } from 'react'
import { Building2, MapPin, X } from 'lucide-react'

interface JobFiltersProps {
  currentFilters: {
    location: string
    department: string
  }
  onFiltersChange: (filters: Partial<{ location: string; department: string }>) => void
  onClearFilters: () => void
}

export default function JobFilters({ currentFilters, onFiltersChange, onClearFilters }: JobFiltersProps) {
  const [departments, setDepartments] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])

  // Sample data - you can replace this with API calls
  useEffect(() => {
    setDepartments([
      'Engineering',
      'Product',
      'Design',
      'Marketing',
      'Sales',
      'Data',
      'Infrastructure',
      'Operations',
      'Finance',
      'HR'
    ])

    setLocations([
      'San Francisco, CA',
      'New York, NY',
      'Austin, TX',
      'Seattle, WA',
      'Los Angeles, CA',
      'Boston, MA',
      'Chicago, IL',
      'Remote',
      'Hybrid'
    ])
  }, [])

  const hasActiveFilters = currentFilters.location || currentFilters.department

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Department Filter */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-900 mb-3">
            <Building2 className="w-4 h-4 mr-2" />
            Department
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {departments.map((dept) => (
              <label key={dept} className="flex items-center">
                <input
                  type="radio"
                  name="department"
                  value={dept}
                  checked={currentFilters.department === dept}
                  onChange={(e) => onFiltersChange({ department: e.target.value })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{dept}</span>
              </label>
            ))}
            {currentFilters.department && (
              <button
                onClick={() => onFiltersChange({ department: '' })}
                className="text-sm text-primary-600 hover:text-primary-700 ml-6"
              >
                Clear department filter
              </button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-900 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {locations.map((loc) => (
              <label key={loc} className="flex items-center">
                <input
                  type="radio"
                  name="location"
                  value={loc}
                  checked={currentFilters.location === loc}
                  onChange={(e) => onFiltersChange({ location: e.target.value })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{loc}</span>
              </label>
            ))}
            {currentFilters.location && (
              <button
                onClick={() => onFiltersChange({ location: '' })}
                className="text-sm text-primary-600 hover:text-primary-700 ml-6"
              >
                Clear location filter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}