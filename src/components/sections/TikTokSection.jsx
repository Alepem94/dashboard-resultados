import { motion } from 'framer-motion'
import { Users, Eye, Play, Heart, DollarSign, Percent } from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { CampaignTable } from '../ui/DataTable'
import { TopPostsSection } from '../ui/PostCard'
import { ObservacionesCard, InsightsSection } from '../ui/ObservacionesCard'
import { formatNumber, formatCurrency, safeNumber } from '../../hooks/useSheetData'

const TikTokIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

export function TikTokSection({ 
  data, 
  campanas = [], 
  topPosts = [], 
  observaciones,
  hallazgos = [],
  loading,
}) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <KPICardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const seguidores = safeNumber(data?.seguidores)
  const views = safeNumber(data?.views)
  const views6s = safeNumber(data?.views_6s)
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
        <div className="p-3 rounded-xl bg-white/20">
          <TikTokIcon />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">TikTok</h1>
          <p className="text-white/60 text-sm">Métricas del mes</p>
        </div>
      </motion.div>

      {/* KPIs - TikTok tiene métricas diferentes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Seguidores"
          value={formatNumber(seguidores)}
          icon={Users}
          delay={0}
        />
        <KPICard
          title="Views"
          value={formatNumber(views)}
          icon={Eye}
          delay={1}
        />
        <KPICard
          title="Views 6s"
          value={formatNumber(views6s)}
          icon={Play}
          delay={2}
        />
        <KPICard
          title="Interacciones"
          value={formatNumber(interacciones)}
          icon={Heart}
          delay={3}
        />
        <KPICard
          title="Inversión"
          value={formatCurrency(inversion)}
          icon={DollarSign}
          delay={4}
        />
        <KPICard
          title="ETR"
          value={etr.toFixed(2)}
          suffix="%"
          icon={Percent}
          delay={5}
        />
      </div>

      {/* Campañas por objetivo */}
      {campanas.length > 0 && (
        <CampaignTable data={campanas} title="Campañas por Objetivo" />
      )}

      {/* Top Posts - TikTok usa Views en lugar de Alcance */}
      <TopPostsSection posts={topPosts} platform="tiktok" />

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
