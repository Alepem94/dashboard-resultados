import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, MousePointer, DollarSign, Eye, Play, Search, Youtube, Monitor, X, MapPin } from 'lucide-react'
import { KPICard, KPICardSkeleton } from '../ui/KPICard'
import { ChartCard, GroupedBarChart } from '../ui/Charts'
import { ObservacionesCard, InsightsSection } from '../ui/ObservacionesCard'
import { formatNumber, formatCurrency, safeNumber } from '../../hooks/useSheetData'

export function GoogleAdsSection({ 
  data = [], 
  ciudades = [], 
  keywords = [],
  observaciones,
  hallazgos = [],
  loading,
}) {
  const [modalData, setModalData] = useState(null)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <KPICardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-blue-500/20">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Google Ads</h1>
            <p className="text-white/60 text-sm">Sin datos para este mes</p>
          </div>
        </motion.div>
      </div>
    )
  }

  const display = data.filter(d => d.tipo_red?.toLowerCase() === 'display')
  const search = data.filter(d => d.tipo_red?.toLowerCase() === 'search')
  const youtube = data.filter(d => d.tipo_red?.toLowerCase() === 'youtube')

  const totalClics = data.reduce((sum, d) => sum + safeNumber(d.clics), 0)
  const totalInversion = data.reduce((sum, d) => sum + safeNumber(d.inversion), 0)
  const totalImpresiones = data.reduce((sum, d) => sum + safeNumber(d.impresiones), 0)
  const totalImpresionesVisibles = data.reduce((sum, d) => sum + safeNumber(d.impresiones_visibles), 0)
  const totalViews = data.reduce((sum, d) => sum + safeNumber(d.views), 0)
  const avgCPC = totalClics > 0 ? totalInversion / totalClics : 0
  const avgCTR = totalImpresiones > 0 ? (totalClics / totalImpresiones) * 100 : 0

  const networkComparisonData = []
  if (display.length > 0) {
    networkComparisonData.push({ name: 'Display', Clics: safeNumber(display[0].clics), Inversion: safeNumber(display[0].inversion) })
  }
  if (search.length > 0) {
    networkComparisonData.push({ name: 'Search', Clics: safeNumber(search[0].clics), Inversion: safeNumber(search[0].inversion) })
  }
  if (youtube.length > 0) {
    networkComparisonData.push({ name: 'YouTube', Clics: safeNumber(youtube[0].clics), Inversion: safeNumber(youtube[0].inversion) })
  }

  const buildTableData = () => {
    const tableData = []
    if (display.length > 0) {
      const d = display[0]
      tableData.push({
        tipo: 'Display', icon: Monitor, meta: safeNumber(d.meta), resultado: safeNumber(d.resultado || d.impresiones_visibles),
        resultadoLabel: 'Impresiones Visibles',
        variacion: d.meta ? ((safeNumber(d.resultado || d.impresiones_visibles) - safeNumber(d.meta)) / safeNumber(d.meta) * 100) : null,
        costo: safeNumber(d.impresiones_visibles) > 0 ? safeNumber(d.inversion) / (safeNumber(d.impresiones_visibles) / 1000) : 0,
        costoLabel: 'CPM', inversion: safeNumber(d.inversion), detailType: 'ciudades',
      })
    }
    if (search.length > 0) {
      const s = search[0]
      tableData.push({
        tipo: 'Search', icon: Search, meta: safeNumber(s.meta), resultado: safeNumber(s.resultado || s.clics),
        resultadoLabel: 'Clics',
        variacion: s.meta ? ((safeNumber(s.resultado || s.clics) - safeNumber(s.meta)) / safeNumber(s.meta) * 100) : null,
        costo: safeNumber(s.cpc), costoLabel: 'CPC', inversion: safeNumber(s.inversion), detailType: 'keywords',
      })
    }
    if (youtube.length > 0) {
      const y = youtube[0]
      tableData.push({
        tipo: 'YouTube', icon: Youtube, meta: safeNumber(y.meta), resultado: safeNumber(y.resultado || y.views),
        resultadoLabel: 'Views',
        variacion: y.meta ? ((safeNumber(y.resultado || y.views) - safeNumber(y.meta)) / safeNumber(y.meta) * 100) : null,
        costo: safeNumber(y.costo_thruview), costoLabel: 'Costo/View', inversion: safeNumber(y.inversion), detailType: 'ciudades',
      })
    }
    return tableData
  }

  const tableData = buildTableData()

  const handleRowClick = (row) => {
    if (row.detailType === 'keywords' && keywords.length > 0) {
      setModalData({ type: 'keywords', data: keywords })
    } else if (row.detailType === 'ciudades') {
      const tipoRed = row.tipo.toLowerCase()
      const ciudadesFiltered = ciudades.filter(c => c.tipo_red?.toLowerCase() === tipoRed)
      if (ciudadesFiltered.length > 0) {
        setModalData({ type: 'ciudades', data: ciudadesFiltered, network: row.tipo })
      }
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/20"><Target className="w-6 h-6 text-blue-400" /></div>
        <div><h1 className="text-2xl font-bold text-white">Google Ads</h1><p className="text-white/60 text-sm">Rendimiento por red</p></div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Clics Totales" value={formatNumber(totalClics)} icon={MousePointer} delay={0} />
        <KPICard title="CPC Promedio" value={formatCurrency(avgCPC)} icon={DollarSign} delay={1} />
        <KPICard title="CTR" value={avgCTR.toFixed(2)} suffix="%" icon={Target} delay={2} />
        {totalImpresionesVisibles > 0 && <KPICard title="Impr. Visibles" value={formatNumber(totalImpresionesVisibles)} icon={Eye} delay={3} />}
        {totalViews > 0 && <KPICard title="Visualizaciones" value={formatNumber(totalViews)} icon={Play} delay={4} />}
        <KPICard title="Inversión Total" value={formatCurrency(totalInversion)} icon={DollarSign} delay={5} />
      </div>

      {networkComparisonData.length > 0 && (
        <ChartCard title="Comparativa por Red">
          <GroupedBarChart data={networkComparisonData} bars={[{ dataKey: 'Clics', color: '#60a5fa' }, { dataKey: 'Inversion', name: 'Inversión', color: '#34d399' }]} height={250} />
        </ChartCard>
      )}

      {tableData.length > 0 && <ResultsByNetworkTable data={tableData} onRowClick={handleRowClick} />}

      <AnimatePresence>
        {modalData && <DetailModal type={modalData.type} data={modalData.data} network={modalData.network} onClose={() => setModalData(null)} />}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hallazgos.length > 0 && <InsightsSection hallazgos={hallazgos} />}
        {observaciones && <ObservacionesCard observacion={observaciones} />}
      </div>
    </div>
  )
}

function ResultsByNetworkTable({ data, onRowClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <h3 className="text-base font-semibold text-white">Resultados por Red</h3>
        <p className="text-xs text-white/50 mt-1">Clic en una fila para ver detalles</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-white/10">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Red</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Meta</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Resultado</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">% Var</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Costo</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Inversión</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, idx) => {
              const Icon = row.icon
              return (
                <tr key={idx} onClick={() => onRowClick(row)} className="hover:bg-white/5 cursor-pointer transition-colors">
                  <td className="px-5 py-4"><div className="flex items-center gap-2"><Icon className="w-4 h-4 text-white/50" /><span className="text-sm font-medium text-white">{row.tipo}</span><span className="text-xs text-white/40 ml-1">→</span></div><span className="text-xs text-white/40">{row.resultadoLabel}</span></td>
                  <td className="px-5 py-4 text-right text-sm font-mono text-white">{row.meta ? formatNumber(row.meta) : '-'}</td>
                  <td className="px-5 py-4 text-right text-sm font-mono font-medium text-white">{formatNumber(row.resultado)}</td>
                  <td className="px-5 py-4 text-right">{row.variacion !== null ? <span className={`text-xs font-medium ${row.variacion >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{row.variacion >= 0 ? '+' : ''}{row.variacion.toFixed(1)}%</span> : <span className="text-white/40">-</span>}</td>
                  <td className="px-5 py-4 text-right"><div className="text-sm font-mono text-white">{formatCurrency(row.costo)}</div><div className="text-xs text-white/40">{row.costoLabel}</div></td>
                  <td className="px-5 py-4 text-right text-sm font-mono text-white">{formatCurrency(row.inversion)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function DetailModal({ type, data, network, onClose }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">{type === 'keywords' ? <Search className="w-5 h-5 text-blue-400" /> : <MapPin className="w-5 h-5 text-blue-400" />}</div>
            <div><h3 className="text-lg font-semibold text-white">{type === 'keywords' ? 'Top Keywords' : `Top Ciudades - ${network}`}</h3><p className="text-sm text-white/50">{type === 'keywords' ? 'Por clics' : 'Por rendimiento'}</p></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-white/70" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6">{type === 'keywords' ? <KeywordsTable data={data} /> : <CiudadesTable data={data} />}</div>
      </motion.div>
    </>
  )
}

function KeywordsTable({ data }) {
  const sorted = [...data].sort((a, b) => safeNumber(b.clics) - safeNumber(a.clics)).slice(0, 10)
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead><tr className="border-b border-white/10">
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Keyword</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Clics</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">CTR</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">CPC</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Inversión</th>
        </tr></thead>
        <tbody className="divide-y divide-white/5">
          {sorted.map((kw, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="px-4 py-3 text-sm font-medium text-white">{kw.keyword}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white">{formatNumber(kw.clics)}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white/70">{safeNumber(kw.ctr).toFixed(2)}%</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white">{formatCurrency(kw.cpc)}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white">{formatCurrency(kw.inversion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CiudadesTable({ data }) {
  const sorted = [...data].sort((a, b) => (safeNumber(b.impresiones_visibles) || safeNumber(b.views)) - (safeNumber(a.impresiones_visibles) || safeNumber(a.views))).slice(0, 10)
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead><tr className="border-b border-white/10">
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Ciudad</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Impresiones</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Clics</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Views</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">Inversión</th>
        </tr></thead>
        <tbody className="divide-y divide-white/5">
          {sorted.map((city, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="px-4 py-3"><div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/40" /><span className="text-sm font-medium text-white">{city.ciudad}</span></div></td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white">{formatNumber(city.impresiones_visibles || city.impresiones)}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white/70">{formatNumber(city.clics)}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white/70">{city.views ? formatNumber(city.views) : '-'}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-white">{formatCurrency(city.inversion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
