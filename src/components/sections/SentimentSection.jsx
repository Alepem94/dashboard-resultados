import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { ObservacionesCard } from '../ui/ObservacionesCard'
import { safeNumber } from '../../hooks/useSheetData'

export function SentimentSection({ data, capturas = [], observaciones, loading }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/10 h-80 animate-pulse" />
          <div className="rounded-2xl bg-white/10 h-80 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20"><MessageSquare className="w-6 h-6 text-purple-400" /></div>
          <div><h1 className="text-2xl font-bold text-white">Sentiment</h1><p className="text-white/60 text-sm">Sin datos para este mes</p></div>
        </motion.div>
      </div>
    )
  }

  const positivo = safeNumber(data.positivo_pct)
  const neutro = safeNumber(data.neutro_pct)
  const negativo = safeNumber(data.negativo_pct)
  const descripcion = data.descripcion || ''
  const sortedCapturas = [...capturas].sort((a, b) => safeNumber(a.orden) - safeNumber(b.orden))

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sortedCapturas.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sortedCapturas.length) % sortedCapturas.length)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-purple-500/20"><MessageSquare className="w-6 h-6 text-purple-400" /></div>
        <div><h1 className="text-2xl font-bold text-white">Sentiment</h1><p className="text-white/60 text-sm">Análisis de percepción</p></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
          <h3 className="text-base font-semibold text-white mb-6">Distribución de Sentiment</h3>
          <div className="flex flex-col gap-4">
            <SentimentBar label="Positivo" value={positivo} color="#22c55e" bgColor="rgba(34, 197, 94, 0.2)" />
            <SentimentBar label="Neutro" value={neutro} color="#facc15" bgColor="rgba(250, 204, 21, 0.2)" />
            <SentimentBar label="Negativo" value={negativo} color="#ef4444" bgColor="rgba(239, 68, 68, 0.2)" />
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <SemaphoreLight color="#22c55e" value={positivo} isActive={positivo >= neutro && positivo >= negativo} />
            <SemaphoreLight color="#facc15" value={neutro} isActive={neutro > positivo && neutro > negativo} />
            <SemaphoreLight color="#ef4444" value={negativo} isActive={negativo > positivo && negativo > neutro} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
          <h3 className="text-base font-semibold text-white mb-4">Análisis Cualitativo</h3>
          <p className="text-white/80 leading-relaxed text-base">{descripcion || 'Sin descripción disponible.'}</p>
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: positivo >= neutro && positivo >= negativo ? '#22c55e' : negativo > positivo ? '#ef4444' : '#facc15' }} />
              <span className="text-sm text-white/70">Sentiment predominante: <span className="font-medium text-white">{positivo >= neutro && positivo >= negativo ? 'Positivo' : negativo > positivo ? 'Negativo' : 'Neutro'}</span></span>
            </div>
          </div>
        </motion.div>
      </div>

      {sortedCapturas.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
          <h3 className="text-base font-semibold text-white mb-4">Comentarios Destacados</h3>
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="aspect-video bg-black/20 rounded-xl overflow-hidden">
                  <img src={sortedCapturas[currentSlide]?.imagen_url} alt={`Captura ${currentSlide + 1}`} className="w-full h-full object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            {sortedCapturas.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"><ChevronLeft className="w-5 h-5 text-white" /></button>
                <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"><ChevronRight className="w-5 h-5 text-white" /></button>
              </>
            )}
            {sortedCapturas.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {sortedCapturas.map((_, idx) => <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/30'}`} />)}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {observaciones && <ObservacionesCard observacion={observaciones} />}
    </div>
  )
}

function SentimentBar({ label, value, color, bgColor }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/70">{label}</span>
        <span className="text-lg font-bold font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: bgColor }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  )
}

function SemaphoreLight({ color, value, isActive }) {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'ring-4 ring-offset-4 ring-offset-transparent' : 'opacity-40'}`}
        style={{ backgroundColor: color, boxShadow: isActive ? `0 0 30px ${color}80` : 'none', ringColor: color }}>
        <span className="text-lg font-bold text-white drop-shadow-lg">{value}%</span>
      </div>
    </motion.div>
  )
}
