'use client'

import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'

interface JobSearchProps {
  initialValues: {
    q: string
    location: string
  }
  onSearch: (filters: { q: string; location: string }) => void
}

export default function JobSearch({ initialValues, onSearch }: JobSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialValues.q)
  const [location, setLocation] = useState(initialValues.location)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ q: searchQuery, location })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-4 flex flex-col md:flex-row gap-4">
      {/* Job Title Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Job title, keywords, or company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Location Search */}
      <div className="flex-1 relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="City, state, or remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <Search className="w-5 h-5" />
        <span>Search Jobs</span>
      </button>
    </form>
  )
}