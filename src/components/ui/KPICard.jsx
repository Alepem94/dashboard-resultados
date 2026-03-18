import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function KPICard({ 
  title, 
  value, 
  variation,
  subtitle,
  icon: Icon,
  prefix = '',
  suffix = '',
  delay = 0,
}) {
  const hasVariation = variation !== null && variation !== undefined && !isNaN(parseFloat(variation))
  const numVariation = parseFloat(variation)
  const isPositive = hasVariation && numVariation > 0
  const isNegative = hasVariation && numVariation < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 transition-all duration-300 hover:bg-white/15"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-white/20">
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <p className="text-xs font-medium text-white/60 mb-1 uppercase tracking-wide">
          {title}
        </p>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl md:text-3xl font-bold font-mono text-white">
            {prefix}{value}{suffix}
          </span>
        </div>

        {subtitle && (
          <p className="text-sm text-white/50 mb-2">{subtitle}</p>
        )}

        {hasVariation && (
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
            ${isPositive ? 'bg-emerald-500/30 text-emerald-300' : ''}
            ${isNegative ? 'bg-red-500/30 text-red-300' : ''}
            ${!isPositive && !isNegative ? 'bg-white/20 text-white/70' : ''}`}
          >
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{numVariation.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/20 mb-3" />
      <div className="h-3 w-20 bg-white/20 rounded mb-2" />
      <div className="h-8 w-28 bg-white/20 rounded mb-2" />
      <div className="h-5 w-16 bg-white/20 rounded-full" />
    </div>
  )
}
