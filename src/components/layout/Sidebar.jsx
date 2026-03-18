import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Facebook,
  Instagram,
  MessageSquare,
  Users,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  Target,
} from 'lucide-react'

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const GoogleAdsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9 12c0-1.7 1.4-3.1 3.1-3.1h5.9V6H7c-3.3 0-6 2.7-6 6s2.7 6 6 6h5.9v-2.9H7c-1.7 0-3.1-1.4-3.1-3.1zm4.1 1h8v-2H8v2zm9-7h-5.9v2.9H17c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1h-5.9V18H17c3.3 0 6-2.7 6-6s-2.7-6-6-6z"/>
  </svg>
)

const navigation = [
  { name: 'Overview', href: 'overview', icon: LayoutDashboard },
  { name: 'Facebook', href: 'facebook', icon: Facebook },
  { name: 'Instagram', href: 'instagram', icon: Instagram },
  { name: 'TikTok', href: 'tiktok', icon: TikTokIcon },
  { name: 'Google Ads', href: 'google-ads', icon: Target },
  { name: 'Sentiment', href: 'sentiment', icon: MessageSquare },
  { name: 'Competencia', href: 'competencia', icon: Users },
  { name: 'Hallazgos', href: 'hallazgos', icon: Lightbulb },
]

export function Sidebar({ brandConfig, theme, collapsed, setCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarStyle = {
    backgroundColor: theme?.sidebarBg || '#18181b',
  }

  const SidebarContent = () => (
    <>
      {/* Logo / Brand */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          {brandConfig?.logo_url ? (
            <img 
              src={brandConfig.logo_url} 
              alt={brandConfig.nombre}
              className={`object-contain transition-all ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: theme?.primary }}
            >
              {brandConfig?.nombre?.charAt(0) || 'M'}
            </div>
          )}
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <h1 className="font-bold text-lg text-white truncate">
                {brandConfig?.nombre || 'Dashboard'}
              </h1>
              <p className="text-xs text-white/60">Marketing Report</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Back to brands */}
      <div className="px-3 py-3 border-b border-white/10">
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Cambiar marca</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const fullHref = `/dashboard/${brandConfig?.marca_id}/${item.href}`
          const isActive = location.pathname.includes(item.href)
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={fullHref}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              {typeof Icon === 'function' ? <Icon /> : <Icon className="w-5 h-5 flex-shrink-0" />}
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 rounded-r-full"
                  style={{ backgroundColor: theme?.secondary || '#FFD700' }}
                />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="hidden lg:block px-3 py-4 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={sidebarStyle}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] z-50 flex flex-col shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        style={sidebarStyle}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 flex-col z-30 shadow-2xl border-r border-white/10"
      >
        <SidebarContent />
      </motion.aside>
    </>
  )
}
