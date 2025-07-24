import Image from 'next/image'
import { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: LucideIcon
}

interface AdminSidebarProps {
  admin: any
  activeTab: string
  tabs: Tab[]
  onTabChange: (tab: string) => void
}

export default function AdminSidebar({ admin, activeTab, tabs, onTabChange }: AdminSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Admin Info */}
      <div className="p-6 text-center border-b border-gray-200">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <Image
            src={admin.image || '/default-company.png'}
            alt={admin.name || 'Company'}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
        <p className="text-sm text-gray-600">{admin.email}</p>
        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Admin
        </div>
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