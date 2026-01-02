'use client'

import { ReactNode, useEffect, useMemo, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useShallow } from 'zustand/react/shallow'
import {
  Home,
  Users,
  Building,
  GraduationCap,
  BookOpen,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart3,
  Award,
  MessageCircle,
} from 'lucide-react'

import { useAuthStore, type AuthState, type UiRole } from '@/lib/store'
import { getNotifications, markNotificationAsRead, type Notification } from '@/lib/api'


interface DashboardLayoutProps {
  children: ReactNode
  role: 'admin' | 'etudiant' | 'enseignant'
}

type NavItem = { name: string; href: string; icon: any }

const getNavItems = (role: DashboardLayoutProps['role']): NavItem[] => {
  const base: NavItem[] = [{ name: 'Dashboard', href: `/${role}/dashboard`, icon: Home }]

  if (role === 'admin') {
    return [
      ...base,
      { name: 'Étudiants', href: '/admin/etudiants', icon: GraduationCap },
      { name: 'Enseignants', href: '/admin/enseignants', icon: Users },
      { name: 'Cours', href: '/admin/cours', icon: BookOpen },
      { name: 'Devoirs', href: '/admin/devoirs', icon: FileText },
      { name: 'Documents', href: '/admin/documents', icon: FileText },
      { name: 'Rapports', href: '/admin/rapports', icon: BarChart3 },
      { name: 'Messagerie', href: '/admin/messagerie', icon: MessageCircle },
      { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
    ]
  }

  if (role === 'enseignant') {
    return [
      ...base,
      { name: 'Mes Cours', href: '/enseignant/cours', icon: BookOpen },
      { name: 'Devoirs', href: '/enseignant/devoirs', icon: FileText },
      { name: 'Documents', href: '/enseignant/documents', icon: FileText },
      { name: 'Notes', href: '/enseignant/notes', icon: Award },
      { name: 'Messagerie', href: '/enseignant/messagerie', icon: MessageCircle },
      { name: 'Paramètres', href: '/enseignant/parametres', icon: Settings },
    ]
  }

  // etudiant
  return [
    ...base,
    { name: 'Mes Cours', href: '/etudiant/cours', icon: BookOpen },
    { name: 'Devoirs', href: '/etudiant/devoirs', icon: FileText },
    { name: 'Documents', href: '/etudiant/documents', icon: FileText },
    { name: 'Mes Notes', href: '/etudiant/notes', icon: Award },
    { name: 'Messagerie', href: '/etudiant/messagerie', icon: MessageCircle },
    { name: 'Paramètres', href: '/etudiant/parametres', icon: Settings },
  ]
}

const authSelector = (s: AuthState) => ({
  user: s.user,
  token: s.token,
  isAuthenticated: s.isAuthenticated,
  logout: s.logout,
  storedRole: s.role,
})

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  

  // ✅ Important: useShallow( selector ) => évite getSnapshot loop et rerenders inutiles
  const { user, token, isAuthenticated, logout, storedRole } = useAuthStore(useShallow(authSelector))

  // rôle effectif (store > prop)
  const effectiveRole: UiRole = (storedRole ?? role) as UiRole

  const navItems = useMemo(() => getNavItems(role), [role])
  const title = navItems.find((i) => i.href === pathname)?.name ?? 'Dashboard'
  const initials =
    (user?.nom?.charAt(0) || user?.email?.charAt(0) || 'U') + (user?.prenom?.charAt(0) || '')

  // ================== PROTECTION ROUTES ==================
  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login')
      return
    }
    if (storedRole && storedRole !== role) {
      router.push(`/${storedRole}/dashboard`)
    }
  }, [isAuthenticated, token, storedRole, role, router])

  const handleLogout = () => {
    logout()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    }
    router.push('/login')
  }

  // ================== NOTIFICATIONS ==================
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [notifLoading, setNotifLoading] = useState(false)

const loadNotifications = async () => {
  if (!isAuthenticated || !user) return

  try {
    setNotifLoading(true)
    const data = await getNotifications(
      storedRole ?? role,
      user.id
    )
    setNotifs(data)
  } catch (e) {
    console.error('Erreur notifications', e)
    setNotifs([])
  } finally {
    setNotifLoading(false)
  }
}


useEffect(() => {
  if (!isAuthenticated) return
  loadNotifications()

  const interval = setInterval(loadNotifications, 30000)
  return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated, storedRole, user?.id])
const unreadCount = useMemo(() => {
  return notifs.filter((n) => n.lu === false).length
}, [notifs])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r">
        <div className="flex flex-col flex-1">
          <div className="flex items-center h-16 px-4 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                <Building className="w-5 h-5" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">CampusMaster</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition text-left ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center px-4 py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {initials}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.email ?? 'Utilisateur'}</p>
                <p className="text-xs text-gray-500 capitalize">{effectiveRole}</p>
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

      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-800">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* 🔔 Notifications */}
<div className="relative">
  <button
    onClick={() => setNotifOpen((v) => !v)}
    className="relative p-2 rounded-lg hover:bg-gray-100"
  >
    <Bell className="w-5 h-5 text-gray-600" />

    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center">
        {unreadCount}
      </span>
    )}
  </button>

  {notifOpen && (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50">
      <div className="px-4 py-3 border-b font-semibold">
        Notifications
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifLoading ? (
          <div className="p-4 text-sm text-gray-500">Chargement...</div>
        ) : notifs.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            Aucune notification
          </div>
        ) : (
          notifs.map((n) => (
            <div
              key={n.id}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={async () => {
                if (!n.lu) {
                  await markNotificationAsRead(n.id)
                  loadNotifications()
                }
              }}
            >
              <div className="font-medium flex items-center gap-2">
                {n.titre ?? 'Notification'}
                {!n.lu && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {n.message ?? n.contenu}
              </div>
              {n.dateCreation && (
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.dateCreation).toLocaleString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>


              {/* Profil (petit) */}
              <div className="hidden lg:flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.email ?? 'Utilisateur'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-800">CampusMaster</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <nav className="px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        router.push(item.href)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition text-left ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </button>
                  )
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
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

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
