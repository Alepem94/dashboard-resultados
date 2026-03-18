import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, Play } from 'lucide-react'
import { formatNumber } from '../../hooks/useSheetData'

// Componente para embeds HTML de redes sociales
function SocialEmbed({ embedCode, platform }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!embedCode || !containerRef.current) return

    // Insertar el HTML del embed
    containerRef.current.innerHTML = embedCode

    // Cargar scripts según la plataforma
    const loadScript = (id, src, callback) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script')
        script.id = id
        script.src = src
        script.async = true
        script.onload = callback
        document.body.appendChild(script)
      } else {
        callback?.()
      }
    }

    // Instagram
    if (platform === 'instagram' || embedCode.includes('instagram')) {
      loadScript('instagram-embed-js', 'https://www.instagram.com/embed.js', () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process()
        }
      })
    }

    // Facebook
    if (platform === 'facebook' || embedCode.includes('facebook')) {
      loadScript('facebook-jssdk', 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v18.0', () => {
        if (window.FB) {
          window.FB.XFBML.parse(containerRef.current)
        }
      })
    }

    // TikTok
    if (platform === 'tiktok' || embedCode.includes('tiktok')) {
      loadScript('tiktok-embed-js', 'https://www.tiktok.com/embed.js', () => {
        // TikTok se auto-procesa
      })
    }

  }, [embedCode, platform])

  if (!embedCode) {
    return (
      <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
        <div className="text-center p-4">
          <Play className="w-10 h-10 text-white/20 mx-auto mb-2" />
          <p className="text-xs text-white/40">Vista previa no disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="bg-white rounded-lg overflow-hidden flex items-center justify-center p-2"
      style={{ minHeight: '300px', maxHeight: '600px', overflowY: 'auto' }}
    />
  )
}

export function TopPostCard({ 
  post, 
  type = 'alcance',
  platform = 'facebook',
}) {
  if (!post) return null

  const isVideo = platform === 'tiktok' || post.tipo?.toLowerCase() === 'video' || post.tipo?.toLowerCase() === 'reel'
  const typeLabel = {
    alcance: 'Mayor Alcance',
    interaccion: 'Mayor Interacción',
    views: 'Mayor Views',
  }[type] || 'Top Post'

  const hasEmbed = post.embed_url && post.embed_url.trim() !== ''
  const hasImage = post.imagen_url && post.imagen_url.trim() !== ''

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

      {/* Embed HTML o Imagen */}
      {hasEmbed ? (
        <SocialEmbed embedCode={post.embed_url} platform={platform} />
      ) : hasImage ? (
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

      {/* Descripción solo si no hay embed */}
      {post.descripcion && !hasEmbed && (
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-sm text-white/70 line-clamp-2">{post.descripcion}</p>
        </div>
      )}

      {/* Métricas */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {type === 'views' ? (
          <>
            <MetricItem icon={Eye} label="Views" value={formatNumber(post.views)} />
            <MetricItem icon={Heart} label="Interacciones" value={formatNumber(post.interacciones)} />
          </>
        ) : (
          <>
            <MetricItem icon={Eye} label="Alcance" value={formatNumber(post.alcance)} />
            <MetricItem icon={Heart} label="Interacciones" value={formatNumber(post.interacciones)} />
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
