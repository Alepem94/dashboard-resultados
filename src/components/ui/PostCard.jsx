import { motion } from 'framer-motion'
import { Heart, Eye, MessageCircle, DollarSign, Play } from 'lucide-react'
import { formatNumber, formatCurrency } from '../../hooks/useSheetData'

export function TopPostCard({ 
  post, 
  type = 'alcance', // 'alcance', 'interaccion', 'views'
  platform = 'facebook',
}) {
  if (!post) return null

  const isVideo = platform === 'tiktok' || post.tipo?.toLowerCase() === 'video' || post.tipo?.toLowerCase() === 'reel'
  const typeLabel = {
    alcance: 'Mayor Alcance',
    interaccion: 'Mayor Interacción',
    views: 'Mayor Views',
  }[type] || 'Top Post'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">{typeLabel}</span>
        {isVideo && <Play className="w-4 h-4 text-white/50" />}
      </div>

      {/* Embed o Imagen */}
      {post.embed_url ? (
        <div className="aspect-video bg-black/20">
          <iframe
            src={post.embed_url}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : post.imagen_url ? (
        <div className="aspect-video bg-black/20">
          <img 
            src={post.imagen_url} 
            alt={post.descripcion}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
          <div className="text-center p-4">
            <Play className="w-10 h-10 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/40">Vista previa no disponible</p>
          </div>
        </div>
      )}

      {/* Descripción */}
      {post.descripcion && (
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-sm text-white/70 line-clamp-2">{post.descripcion}</p>
        </div>
      )}

      {/* Métricas */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {type === 'alcance' || type === 'interaccion' ? (
          <>
            <MetricItem icon={Eye} label="Alcance" value={formatNumber(post.alcance)} />
            <MetricItem icon={Heart} label="Interacciones" value={formatNumber(post.interacciones)} />
            <MetricItem icon={MessageCircle} label="ETR" value={`${post.etr || 0}%`} />
            {type === 'alcance' && post.cpm && (
              <MetricItem icon={DollarSign} label="CPM" value={formatCurrency(post.cpm)} />
            )}
            {type === 'interaccion' && post.cpe && (
              <MetricItem icon={DollarSign} label="CPE" value={formatCurrency(post.cpe)} />
            )}
          </>
        ) : (
          <>
            <MetricItem icon={Eye} label="Views" value={formatNumber(post.views)} />
            <MetricItem icon={Play} label="Views 6s" value={formatNumber(post.views_6s)} />
            <MetricItem icon={Heart} label="Interacciones" value={formatNumber(post.interacciones)} />
            {post.cpv && (
              <MetricItem icon={DollarSign} label="CPV" value={formatCurrency(post.cpv)} />
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

function MetricItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-white/10">
        <Icon className="w-3.5 h-3.5 text-white/50" />
      </div>
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="text-sm font-mono font-medium text-white">{value}</p>
      </div>
    </div>
  )
}

export function TopPostsSection({ posts = [], platform = 'facebook' }) {
  if (!posts?.length) return null

  const isTikTok = platform === 'tiktok'
  
  // Encontrar posts por tipo
  const postAlcance = posts.find(p => p.tipo_top === 'alcance')
  const postInteraccion = posts.find(p => p.tipo_top === 'interaccion')
  const postViews = posts.find(p => p.tipo_top === 'views')

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white">Top Posts del Mes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isTikTok ? (
          <>
            {postViews && <TopPostCard post={postViews} type="views" platform={platform} />}
            {postInteraccion && <TopPostCard post={postInteraccion} type="interaccion" platform={platform} />}
          </>
        ) : (
          <>
            {postAlcance && <TopPostCard post={postAlcance} type="alcance" platform={platform} />}
            {postInteraccion && <TopPostCard post={postInteraccion} type="interaccion" platform={platform} />}
          </>
        )}
      </div>
    </div>
  )
}
