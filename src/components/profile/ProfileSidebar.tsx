import Image from 'next/image'
import { User } from 'next-auth'
import { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: LucideIcon
}

interface ProfileSidebarProps {
  user: User
  activeTab: string
  tabs: Tab[]
  onTabChange: (tab: string) => void
}

export default function ProfileSidebar({ user, activeTab, tabs, onTabChange }: ProfileSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* User Info */}
      <div className="p-6 text-center border-b border-gray-200">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={user.image || '/default-avatar.png'}
            alt={user.name || 'Profile'}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {tab.name}
            </button>
          )
        })}
      </nav>
    </div>
  )
}