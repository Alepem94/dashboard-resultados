import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  LabelList,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatNumber } from '../../hooks/useSheetData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl">
      <p className="text-xs text-white/70 mb-2 font-medium">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-white/80">{entry.name}:</span>
          <span className="text-sm font-mono font-semibold text-white">{formatNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function AreaChartComponent({ data = [], dataKey, xKey = 'mes', color = '#ffffff', height = 250 }) {
  if (!data?.length) return <div className="h-48 flex items-center justify-center text-white/40">Sin datos</div>
  const gradientId = `gradient-${dataKey}-${Math.random().toString(36).substr(2, 9)}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={formatNumber} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MultiLineChart({ data = [], lines = [], xKey = 'mes', height = 250 }) {
  if (!data?.length) return <div className="h-48 flex items-center justify-center text-white/40">Sin datos</div>
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={formatNumber} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 15 }} formatter={(value) => <span className="text-white/70 text-xs">{value}</span>} />
        {lines.map((line) => (
          <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} name={line.name} stroke={line.color} strokeWidth={2} dot={{ fill: line.color, strokeWidth: 0, r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function HorizontalBarChart({ data = [], dataKey = 'value', nameKey = 'name', color = '#ffffff', height = 250, showVariation = false, variationKey = 'variacion' }) {
  if (!data?.length) return <div className="h-48 flex items-center justify-center text-white/40">Sin datos</div>
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: showVariation ? 70 : 30, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={formatNumber} />
        <YAxis type="category" dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} width={75} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 6, 6, 0]}>
          {showVariation && <LabelList dataKey={variationKey} position="right" formatter={(v) => { const n = parseFloat(v) || 0; return `${n > 0 ? '+' : ''}${n.toFixed(1)}%` }} fill="#fff" fontSize={10} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function GroupedBarChart({ data = [], bars = [], xKey = 'name', height = 250 }) {
  if (!data?.length) return <div className="h-48 flex items-center justify-center text-white/40">Sin datos</div>
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={formatNumber} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 15 }} formatter={(value) => <span className="text-white/70 text-xs">{value}</span>} />
        {bars.map((bar) => <Bar key={bar.dataKey} dataKey={bar.dataKey} name={bar.name} fill={bar.color} radius={[4, 4, 0, 0]} />)}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ChartCard({ title, children, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 ${className}`}>
      {title && <h3 className="text-base font-semibold text-white mb-4">{title}</h3>}
      {children}
    </motion.div>
  )
}
