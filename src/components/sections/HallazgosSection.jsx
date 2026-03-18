import { motion } from 'framer-motion'
import { Lightbulb, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

export function HallazgosSection({ data = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/10 h-96 animate-pulse" />
          <div className="rounded-2xl bg-white/10 h-96 animate-pulse" />
        </div>
      </div>
    )
  }

  // Separar hallazgos y recomendaciones
  const hallazgos = data.filter(item => item.tipo === 'hallazgo' || item.tipo === 'logro' || item.tipo === 'insight' || item.tipo === 'alerta')
  const recomendaciones = data.filter(item => item.tipo === 'recomendacion')

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'logro': return CheckCircle
      case 'insight': return TrendingUp
      case 'alerta': return AlertCircle
      default: return Lightbulb
    }
  }

  const getColors = (tipo, prioridad) => {
    switch (tipo) {
      case 'logro':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400' }
      case 'alerta':
        return { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400' }
      case 'insight':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400' }
      default:
        if (prioridad === 'alta') return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400' }
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 rounded-xl bg-amber-500/20">
          <Lightbulb className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Hallazgos y Recomendaciones</h1>
          <p className="text-white/60 text-sm">Insights del período</p>
        </div>
      </motion.div>

      {/* Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Hallazgos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Hallazgos</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
              {hallazgos.length}
            </span>
          </div>

          {hallazgos.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-8">Sin hallazgos para este período</p>
          ) : (
            <div className="space-y-3">
              {hallazgos.map((item, idx) => {
                const Icon = getIcon(item.tipo)
                const colors = getColors(item.tipo, item.prioridad)
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white truncate">{item.titulo}</h4>
                          {item.prioridad === 'alta' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/30 text-red-300 uppercase">
                              Alta
                            </span>
                          )}
                        </div>
                        {item.descripcion && (
                          <p className="text-sm text-white/60 leading-relaxed">{item.descripcion}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Columna derecha: Recomendaciones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Recomendaciones</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
              {recomendaciones.length}
            </span>
          </div>

          {recomendaciones.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-8">Sin recomendaciones para este período</p>
          ) : (
            <div className="space-y-3">
              {recomendaciones.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-400">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-white truncate">{item.titulo}</h4>
                        {item.prioridad === 'alta' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/30 text-amber-300 uppercase">
                            Prioritaria
                          </span>
                        )}
                      </div>
                      {item.descripcion && (
                        <p className="text-sm text-white/60 leading-relaxed">{item.descripcion}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary card */}
      {(hallazgos.length > 0 || recomendaciones.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-blue-500/20 backdrop-blur-md border border-white/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white/80">Resumen del Período</h4>
              <p className="text-2xl font-bold text-white mt-1">
                {hallazgos.length} hallazgos • {recomendaciones.length} recomendaciones
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {hallazgos.filter(h => h.tipo === 'logro').length}
                </p>
                <p className="text-xs text-white/50">Logros</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {hallazgos.filter(h => h.prioridad === 'alta').length}
                </p>
                <p className="text-xs text-white/50">Alta prioridad</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
