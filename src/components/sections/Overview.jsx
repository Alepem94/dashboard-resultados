import { motion } from 'framer-motion'
import { Users, Eye, Heart, DollarSign, Facebook, Instagram } from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { ChartCard, MultiLineChart } from '../ui/Charts'
import { InsightsSection, ObservacionesCard } from '../ui/ObservacionesCard'
import { formatNumber, formatCurrency, safeNumber } from '../../hooks/useSheetData'

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

export function Overview({ data, historical, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const { facebook, instagram, tiktok, googleAds, hallazgos, observaciones } = data

  // Calcular totales
  const totalSeguidores = 
    safeNumber(facebook?.seguidores) + 
    safeNumber(instagram?.seguidores) + 
    safeNumber(tiktok?.seguidores)

  const totalAlcance = 
    safeNumber(facebook?.alcance) + 
    safeNumber(instagram?.alcance) + 
    safeNumber(tiktok?.views)

  const totalInteracciones = 
    safeNumber(facebook?.interacciones) + 
    safeNumber(instagram?.interacciones) + 
    safeNumber(tiktok?.interacciones)

  const inversionRedes = 
    safeNumber(facebook?.inversion) + 
    safeNumber(instagram?.inversion) + 
    safeNumber(tiktok?.inversion)

  const inversionGoogleAds = Array.isArray(googleAds) 
    ? googleAds.reduce((sum, c) => sum + safeNumber(c.inversion), 0) 
    : 0

  const inversionTotal = inversionRedes + inversionGoogleAds

  // Datos para gráficas históricas
  const buildHistoricalData = () => {
    const months = new Set()
    historical.facebook?.forEach(d => months.add(d.mes))
    historical.instagram?.forEach(d => months.add(d.mes))
    historical.tiktok?.forEach(d => months.add(d.mes))

    return Array.from(months).sort().slice(-6).map(mes => {
      const fb = historical.facebook?.find(d => d.mes === mes)
      const ig = historical.instagram?.find(d => d.mes === mes)
      const tt = historical.tiktok?.find(d => d.mes === mes)
      
      const formatMes = (m) => {
        const [year, month] = m.split('-')
        return new Date(year, parseInt(month) - 1).toLocaleDateString('es-MX', { month: 'short' })
      }

      return {
        mes: formatMes(mes),
        Facebook: safeNumber(fb?.seguidores),
        Instagram: safeNumber(ig?.seguidores),
        TikTok: safeNumber(tt?.seguidores),
        Alcance_FB: safeNumber(fb?.alcance),
        Alcance_IG: safeNumber(ig?.alcance),
        Alcance_TT: safeNumber(tt?.views),
        Inter_FB: safeNumber(fb?.interacciones),
        Inter_IG: safeNumber(ig?.interacciones),
        Inter_TT: safeNumber(tt?.interacciones),
      }
    })
  }

  const historicalChartData = buildHistoricalData()

  // Insights del overview
  const overviewInsights = hallazgos?.filter(h => h.seccion === 'overview') || []
  const overviewObs = observaciones?.find(o => o.seccion === 'overview')

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Seguidores Totales"
          value={formatNumber(totalSeguidores)}
          icon={Users}
          delay={0}
        />
        <KPICard
          title="Alcance Total"
          value={formatNumber(totalAlcance)}
          icon={Eye}
          delay={1}
        />
        <KPICard
          title="Interacciones"
          value={formatNumber(totalInteracciones)}
          icon={Heart}
          delay={2}
        />
        <KPICard
          title="Inversión Total"
          value={formatCurrency(inversionTotal)}
          icon={DollarSign}
          delay={3}
        />
      </div>

      {/* Resumen por plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlatformCard
          name="Facebook"
          icon={Facebook}
          color="#1877F2"
          seguidores={facebook?.seguidores}
          alcance={facebook?.alcance}
          interacciones={facebook?.interacciones}
          inversion={facebook?.inversion}
        />
        <PlatformCard
          name="Instagram"
          icon={Instagram}
          color="#E4405F"
          seguidores={instagram?.seguidores}
          alcance={instagram?.alcance}
          interacciones={instagram?.interacciones}
          inversion={instagram?.inversion}
        />
        <PlatformCard
          name="TikTok"
          icon={TikTokIcon}
          color="#000000"
          seguidores={tiktok?.seguidores}
          alcance={tiktok?.views}
          alcanceLabel="Views"
          interacciones={tiktok?.interacciones}
          inversion={tiktok?.inversion}
        />
      </div>

      {/* Gráficas históricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Evolución de Seguidores">
          <MultiLineChart
            data={historicalChartData}
            lines={[
              { dataKey: 'Facebook', color: '#1877F2' },
              { dataKey: 'Instagram', color: '#E4405F' },
              { dataKey: 'TikTok', color: '#ffffff' },
            ]}
            height={220}
          />
        </ChartCard>

        <ChartCard title="Evolución de Alcance">
          <MultiLineChart
            data={historicalChartData}
            lines={[
              { dataKey: 'Alcance_FB', name: 'Facebook', color: '#1877F2' },
              { dataKey: 'Alcance_IG', name: 'Instagram', color: '#E4405F' },
              { dataKey: 'Alcance_TT', name: 'TikTok', color: '#ffffff' },
            ]}
            height={220}
          />
        </ChartCard>

        <ChartCard title="Evolución de Interacciones">
          <MultiLineChart
            data={historicalChartData}
            lines={[
              { dataKey: 'Inter_FB', name: 'Facebook', color: '#1877F2' },
              { dataKey: 'Inter_IG', name: 'Instagram', color: '#E4405F' },
              { dataKey: 'Inter_TT', name: 'TikTok', color: '#ffffff' },
            ]}
            height={220}
          />
        </ChartCard>
      </div>

      {/* Insights y Observaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {overviewInsights.length > 0 && (
          <InsightsSection hallazgos={overviewInsights} />
        )}
        {overviewObs && (
          <ObservacionesCard observacion={overviewObs} />
        )}
      </div>
    </div>
  )
}

function PlatformCard({ name, icon: Icon, color, seguidores, alcance, alcanceLabel = 'Alcance', interacciones, inversion }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}30` }}>
          {typeof Icon === 'function' ? <Icon /> : <Icon className="w-5 h-5" style={{ color }} />}
        </div>
        <h3 className="font-semibold text-white">{name}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-white/50">Seguidores</span>
          <span className="text-sm font-mono font-medium text-white">{formatNumber(seguidores)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-white/50">{alcanceLabel}</span>
          <span className="text-sm font-mono font-medium text-white">{formatNumber(alcance)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-white/50">Interacciones</span>
          <span className="text-sm font-mono font-medium text-white">{formatNumber(interacciones)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-white/10">
          <span className="text-sm text-white/50">Inversión</span>
          <span className="text-sm font-mono font-medium text-white">{formatCurrency(inversion)}</span>
        </div>
      </div>
    </motion.div>
  )
}
