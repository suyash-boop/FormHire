'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Clock, 
  Bell, 
  ArrowLeft, 
  Mail, 
  CheckCircle,
  Rocket,
  Star,
  Users
} from 'lucide-react'

interface ComingSoonProps {
  title: string
  description: string
  features?: string[]
  expectedDate?: string
  showNotifyForm?: boolean
}

export default function ComingSoon({ 
  title, 
  description, 
  features = [], 
  expectedDate,
  showNotifyForm = true 
}: ComingSoonProps) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call - you can replace this with actual notification signup
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail('')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
              <Rocket className="w-10 h-10 text-primary-600" />
            </div>
          </div>

          {/* Title and Description */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {description}
          </p>

          {/* Expected Date */}
          {expectedDate && (
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full mb-8">
              <Clock className="w-4 h-4 mr-2" />
              Expected Launch: {expectedDate}
            </div>
          )}

          {/* Features Preview */}
          {features.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                What's Coming
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notify Me Form */}
          {showNotifyForm && (
            <div className="max-w-md mx-auto">
              {!isSubscribed ? (
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Get Notified When We Launch
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Be the first to know when this feature becomes available.
                  </p>
                  
                  <form onSubmit={handleNotifySubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 mr-2" />
                          Notify Me
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    You're on the list!
                  </h3>
                  <p className="text-green-700">
                    We'll send you an email as soon as this feature is ready.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Job Seekers Waiting</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Companies Interested</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                Expected Rating
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              Have questions or suggestions?{' '}
              <a 
                href="mailto:hello@formhire.com" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Get in touch
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CSS for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}