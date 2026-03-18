import { motion } from 'framer-motion'
import { Users, TrendingUp, TrendingDown } from 'lucide-react'
import { ChartCard, GroupedBarChart } from '../ui/Charts'
import { ObservacionesCard } from '../ui/ObservacionesCard'
import { formatNumber, safeNumber } from '../../hooks/useSheetData'

export function CompetenciaSection({ data = [], observaciones, loading }) {
  if (loading) {
    return <div className="space-y-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="rounded-2xl bg-white/10 h-80 animate-pulse" /><div className="rounded-2xl bg-white/10 h-80 animate-pulse" /></div></div>
  }

  if (!data || data.length === 0) {
    return <div className="space-y-6"><motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3"><div className="p-3 rounded-xl bg-cyan-500/20"><Users className="w-6 h-6 text-cyan-400" /></div><div><h1 className="text-2xl font-bold text-white">Competencia</h1><p className="text-white/60 text-sm">Sin datos para este mes</p></div></motion.div></div>
  }

  const postsEngagementData = data.map(item => ({ name: item.competidor, Posts: safeNumber(item.posts), 'Engagement %': safeNumber(item.engagement_pct) }))
  const seguidoresData = data.map(item => ({ name: item.competidor, seguidores: safeNumber(item.seguidores), variacion: safeNumber(item.variacion_pct) }))

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyan-500/20"><Users className="w-6 h-6 text-cyan-400" /></div>
        <div><h1 className="text-2xl font-bold text-white">Competencia</h1><p className="text-white/60 text-sm">Análisis comparativo</p></div>
      </motion.div>

      <ChartCard title="Actividad y Engagement por Competidor">
        <GroupedBarChart data={postsEngagementData} bars={[{ dataKey: 'Posts', color: '#60a5fa' }, { dataKey: 'Engagement %', color: '#34d399' }]} height={280} />
      </ChartCard>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
        <h3 className="text-base font-semibold text-white mb-4">Seguidores Totales</h3>
        <div className="space-y-4">
          {seguidoresData.sort((a, b) => b.seguidores - a.seguidores).map((item, idx) => {
            const maxSeguidores = Math.max(...seguidoresData.map(d => d.seguidores))
            const widthPercent = (item.seguidores / maxSeguidores) * 100
            const isPositive = item.variacion >= 0
            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-white/70">{formatNumber(item.seguidores)}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{item.variacion.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-8 bg-white/10 rounded-lg overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${widthPercent}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }} className="h-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500" />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {observaciones && <ObservacionesCard observacion={observaciones} />}
    </div>
  )
}
