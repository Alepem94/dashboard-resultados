import { motion } from 'framer-motion'
import { MessageSquare, Lightbulb, AlertCircle } from 'lucide-react'

export function ObservacionesCard({ observacion, className = '' }) {
  if (!observacion?.observacion) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-500/20">
          <MessageSquare className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Observaciones</h4>
          <p className="text-sm text-white/70 leading-relaxed">{observacion.observacion}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function InsightsSection({ hallazgos = [], className = '' }) {
  if (!hallazgos?.length) return null

  const insights = hallazgos.filter(h => h.tipo === 'hallazgo')
  const recomendaciones = hallazgos.filter(h => h.tipo === 'recomendacion')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 ${className}`}
    >
      <h4 className="text-base font-semibold text-white mb-4">Insights del Mes</h4>
      
      <div className="space-y-3">
        {insights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Lightbulb className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">{item.titulo}</p>
              {item.descripcion && (
                <p className="text-xs text-white/60 mt-1">{item.descripcion}</p>
              )}
            </div>
          </div>
        ))}
        
        {recomendaciones.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">{item.titulo}</p>
              {item.descripcion && (
                <p className="text-xs text-white/60 mt-1">{item.descripcion}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
