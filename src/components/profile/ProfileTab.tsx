'use client'

import { useState, useEffect } from 'react'
import { User } from 'next-auth'
import Image from 'next/image'
import { Edit, Save, X, Upload } from 'lucide-react'

interface ProfileTabProps {
  user: User
}

interface UserProfile {
  name: string
  email: string
  image?: string
  bio?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
  phone?: string
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: user.name || '',
    email: user.email || '',
    image: user.image || '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    phone: '',
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        setIsEditing(false)
        // You could show a success toast here
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    fetchUserProfile() // Reset to original values
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={profile.image || '/default-avatar.png'}
                  alt={profile.name}
                  fill
                  className="rounded-full object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-center text-xl font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-primary-500 outline-none w-full"
                />
              ) : (
                <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
              )}
              
              <p className="text-gray-600 mt-1">{profile.email}</p>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                    {profile.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="City, State"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile.location || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile.phone || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile.website ? (
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/username"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile.linkedin ? (
                      <a 
                        href={profile.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {profile.linkedin}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                )}
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://github.com/username"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile.github ? (
                      <a 
                        href={profile.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {profile.github}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                )}
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900 bg-gray-100 p-3 rounded-lg">
                  {profile.email}
                  <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}