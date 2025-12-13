'use client'
import { ReactNode, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, Users,Building, GraduationCap, BookOpen, Calendar, 
  FileText, Settings, Bell, LogOut, Menu, X,
  DollarSign, BarChart3, User, Award, CreditCard, FileUser, FileStack
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

interface DashboardLayoutProps {
  children: ReactNode
  role: 'admin' | 'etudiant' | 'enseignant'
}

const getNavItems = (role: string) => {
  const baseItems = [
    { name: 'Dashboard', href: `/${role}/dashboard`, icon: Home },
  ]

  switch(role) {
    case 'admin':
      return [
        ...baseItems,
        { name: 'Étudiants', href: '/admin/etudiants', icon: Users },
        { name: 'Enseignants', href: '/admin/enseignants', icon: GraduationCap },
        { name: 'Cours', href: '/admin/cours', icon: BookOpen },
        { name: 'Devoirs', href: '/admin/devoirs', icon: FileUser },
        { name: 'Documents', href: '/admin/documents', icon: FileStack },        
        { name: 'Emploi du temps', href: '/admin/emploi-temps', icon: Calendar },
        { name: 'Rapports', href: '/admin/rapports', icon: BarChart3 },
      ]
    case 'etudiant':
      return [
        ...baseItems,
        { name: 'Mes Cours', href: '/etudiant/cours', icon: BookOpen },
        { name: 'Devoirs', href: '/etudiants/devoirs', icon: FileUser },
        { name: 'Documents', href: '/etudiants/documents', icon: FileStack },
        { name: 'Mes Notes', href: '/etudiant/notes', icon: Award },
        { name: 'Emploi du temps', href: '/etudiant/emploi-temps', icon: Calendar },
        { name: 'Paramètres', href: '/etudiant/parametres', icon: Settings },
      ]
    case 'enseignant':
      return [
        ...baseItems,
        { name: 'Mes Cours', href: '/enseignant/cours', icon: BookOpen },
        { name: 'Devoirs', href: '/enseignant/devoirs', icon: FileUser },
        { name: 'Documents', href: '/enseignant/documents', icon: FileStack },
        { name: 'Notes', href: '/enseignant/notes', icon: FileText },
        { name: 'Emploi du temps', href: '/enseignant/emploi-temps', icon: Calendar },
        { name: 'Paramètres', href: '/enseignant/parametres', icon: Settings },
      ]
    default:
      return baseItems
  }
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navItems = getNavItems(role)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar pour desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r">
        <div className="flex flex-col flex-1">
          <div className="flex items-center h-16 px-4 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold p-1">
                <Building className="w-8 h-8 text-white"/>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">Master Campus</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center px-4 py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.nom} {user?.prenom}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Header mobile */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-800">
                {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="hidden lg:flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.nom} {user?.prenom}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    MC
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-800">Master Campus</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <nav className="px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </a>
                  )
                })}
              </nav>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <div className="flex items-center px-4 py-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.nom} {user?.prenom}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}