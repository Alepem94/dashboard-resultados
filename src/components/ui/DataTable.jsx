import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatNumber, formatCurrency } from '../../hooks/useSheetData'

export function DataTable({ columns = [], data = [], title, onRowClick }) {
  if (!data?.length) {
    return (
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
        {title && <h3 className="text-base font-semibold text-white mb-4">{title}</h3>}
        <p className="text-center text-white/40 py-8">Sin datos disponibles</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden"
    >
      {title && (
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col, i) => (
                <th key={i} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white/50 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-5 py-3 text-sm text-white ${col.align === 'right' ? 'text-right' : ''} ${col.mono ? 'font-mono' : ''}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export function CampaignTable({ data = [], title = 'Campañas por Objetivo' }) {
  const columns = [
    { label: 'Objetivo', key: 'objetivo', render: (v) => <span className="font-medium">{v}</span> },
    { label: 'Meta', key: 'meta', align: 'right', mono: true, render: (v) => formatNumber(v) },
    { label: 'Resultado', key: 'resultado', align: 'right', mono: true, render: (v) => formatNumber(v) },
    { label: 'Variación', key: 'variacion_pct', align: 'right', render: (v) => <VariationBadge value={v} /> },
    { label: 'Inversión', key: 'inversion', align: 'right', mono: true, render: (v) => formatCurrency(v) },
  ]
  return <DataTable columns={columns} data={data} title={title} />
}

export function VariationBadge({ value }) {
  const num = parseFloat(value)
  if (isNaN(num)) return <span className="text-white/40">-</span>
  const isPositive = num > 0
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{num.toFixed(1)}%
    </span>
  )
}

export function ProgressBar({ value, max = 100, color = '#10b981' }) {
  const pct = Math.min((parseFloat(value) / max) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono text-white/60 w-10 text-right">{pct.toFixed(0)}%</span>
    </div>
  )
}
