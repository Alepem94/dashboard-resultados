import { motion } from 'framer-motion'
import { Users, Eye, Heart, DollarSign, Percent, Facebook, Instagram } from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { CampaignTable } from '../ui/DataTable'
import { TopPostsSection } from '../ui/PostCard'
import { ObservacionesCard, InsightsSection } from '../ui/ObservacionesCard'
import { formatNumber, formatCurrency, safeNumber } from '../../hooks/useSheetData'

const platformConfig = {
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
  },
}

export function SocialSection({ 
  platform, 
  data, 
  campanas = [], 
  topPosts = [], 
  observaciones,
  hallazgos = [],
  loading,
  theme,
}) {
  const config = platformConfig[platform]
  
  if (!config) {
    return <div className="text-white/50 text-center py-12">Plataforma no configurada</div>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <KPICardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const Icon = config.icon
  const seguidores = safeNumber(data?.seguidores)
  const alcance = safeNumber(data?.alcance)
  const interacciones = safeNumber(data?.interacciones)
  const inversion = safeNumber(data?.inversion)
  const etr = safeNumber(data?.engagement_rate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${config.color}30` }}>
          <Icon className="w-6 h-6" style={{ color: config.color }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{config.name}</h1>
          <p className="text-white/60 text-sm">Métricas del mes</p>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Seguidores"
          value={formatNumber(seguidores)}
          icon={Users}
          delay={0}
        />
        <KPICard
          title="Alcance"
          value={formatNumber(alcance)}
          icon={Eye}
          delay={1}
        />
        <KPICard
          title="Interacciones"
          value={formatNumber(interacciones)}
          icon={Heart}
          delay={2}
        />
        <KPICard
          title="Inversión"
          value={formatCurrency(inversion)}
          icon={DollarSign}
          delay={3}
        />
        <KPICard
          title="ETR"
          value={etr.toFixed(2)}
          suffix="%"
          icon={Percent}
          delay={4}
        />
      </div>

      {/* Campañas por objetivo */}
      {campanas.length > 0 && (
        <CampaignTable data={campanas} title="Campañas por Objetivo" />
      )}

      {/* Top Posts */}
      <TopPostsSection posts={topPosts} platform={platform} />

      {/* Insights y Observaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hallazgos.length > 0 && (
          <InsightsSection hallazgos={hallazgos} />
        )}
        {observaciones && (
          <ObservacionesCard observacion={observaciones} />
        )}
      </div>
    </div>
  )
}
