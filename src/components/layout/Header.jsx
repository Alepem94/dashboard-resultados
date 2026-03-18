import { motion } from 'framer-motion'
import { ChevronDown, RefreshCw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header({ 
  brandConfig,
  theme,
  months = [], 
  selectedMonth, 
  onMonthChange,
  onRefresh,
  isRefreshing,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatMonth = (monthStr) => {
    if (!monthStr) return 'Seleccionar mes'
    const [year, month] = monthStr.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  }

  return (
    <header className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden w-12" />
          
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3">
            {brandConfig?.logo_url && (
              <img 
                src={brandConfig.logo_url} 
                alt={brandConfig?.nombre} 
                className="w-8 h-8 object-contain"
              />
            )}
            <h1 className="text-lg font-semibold text-white">{brandConfig?.nombre}</h1>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-white">{brandConfig?.nombre}</h2>
            <p className="text-sm text-white/60">Reporte de Marketing Digital</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors min-w-[140px] md:min-w-[180px] text-white"
            >
              <span className="text-sm font-medium capitalize truncate">
                {formatMonth(selectedMonth)}
              </span>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && months.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-2xl overflow-hidden z-50"
              >
                <div className="max-h-64 overflow-y-auto py-1">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        onMonthChange(month)
                        setIsOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors capitalize ${
                        month === selectedMonth 
                          ? 'bg-gray-100 font-semibold'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ color: month === selectedMonth ? theme?.primary : '#374151' }}
                    >
                      {formatMonth(month)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 text-white"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
