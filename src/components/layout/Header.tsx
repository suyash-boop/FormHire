'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Shield,
  ChevronDown,
  Briefcase,
  Home,
  Phone,
  Info
} from 'lucide-react'

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Check if user is admin when session is available
  useEffect(() => {
    if (session?.user?.email && !isCheckingAdmin) {
      checkAdminStatus()
    }
  }, [session])

  // Reset image error when session changes
  useEffect(() => {
    setImageError(false)
  }, [session?.user?.image])

  const checkAdminStatus = async () => {
    if (!session?.user?.email) return
    
    setIsCheckingAdmin(true)
    try {
      const response = await fetch('/api/admin/verify')
      setIsAdmin(response.ok)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    } finally {
      setIsCheckingAdmin(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    setIsProfileDropdownOpen(false)
    setIsAdmin(false)
  }

  const closeDropdown = () => {
    setIsProfileDropdownOpen(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FormHire</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side - Auth & Profile */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                    {session.user?.image && !imageError ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={handleImageError}
                        unoptimized
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {session.user?.name || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={closeDropdown}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                      <div className="py-1">
                        {/* User Info */}
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {session.user?.image && !imageError ? (
                                <Image
                                  src={session.user.image}
                                  alt="Profile"
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={handleImageError}
                                  unoptimized
                                />
                              ) : (
                                <User className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{session.user?.name || 'User'}</p>
                              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                              {isAdmin && (
                                <div className="flex items-center mt-1">
                                  <Shield className="w-3 h-3 text-green-600 mr-1" />
                                  <span className="text-xs text-green-600 font-medium">Administrator</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Admin Panel Link (only if user is admin) */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={closeDropdown}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Shield className="w-4 h-4 mr-3 text-primary-600" />
                            Admin Panel
                          </Link>
                        )}

                        {/* Profile Link */}
                        <Link
                          href="/profile"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>

                        {/* Settings Link */}
                        {/* <Link
                          href="/settings"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link> */}

                        {/* Sign Out */}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Admin Panel Link */}
              {session && isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 px-3 py-2 text-base font-medium transition-colors duration-200 bg-primary-50 rounded-lg"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {!session && (
                <div className="pt-2 border-t border-gray-200 mt-4">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 mt-2"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}