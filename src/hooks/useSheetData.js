import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'

const SHEET_ID = import.meta.env.VITE_SHEET_ID

function getSheetURL(sheetName) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
}

async function fetchSheet(sheetName) {
  const response = await fetch(getSheetURL(sheetName))
  const csvText = await response.text()
  const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true })
  return data
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX #1 — Normalización de fechas → siempre retorna "YYYY-MM"
//
// Google Sheets exporta la columna "mes" en distintos formatos según cómo
// esté formateada la celda:
//   "2025-12"              → texto correcto, pasa tal cual
//   "2026-01-01 00:00:00"  → fecha con hora (Enero guardado como tipo Fecha)
//   "2026-01-31 00:00:00"  → fecha fin-de-mes (TopPosts usa el último día)
//   46023.0                → serial numérico de Excel
//   Date object            → ya parseado por PapaParse
// ─────────────────────────────────────────────────────────────────────────────
function normalizeMonth(val) {
  if (!val) return null

  if (val instanceof Date && !isNaN(val)) {
    return val.toISOString().slice(0, 7)
  }

  const s = String(val).trim()

  // Ya está en formato correcto "YYYY-MM"
  if (/^\d{4}-\d{2}$/.test(s)) return s

  // Fecha completa "YYYY-MM-DD..." — TopPosts usa el último día del mes
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 7)

  // Serial numérico de Excel (días desde 1899-12-30)
  if (/^\d{4,5}(\.\d+)?$/.test(s)) {
    const d = new Date((parseFloat(s) - 25569) * 86400000)
    return d.toISOString().slice(0, 7)
  }

  return s
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX #2 — TikTok: normalización de nombres de marca
//
// La hoja TikTok usa "LA BOTANERA", "Chamoy", "Pacific Mix" en la columna
// marca, pero el sistema filtra por los IDs "botanera", "chamoy", "pacific".
// ─────────────────────────────────────────────────────────────────────────────
const TIKTOK_BRAND_MAP = {
  'la botanera': 'botanera',
  'botanera':    'botanera',
  'chamoy mega': 'chamoy',
  'chamoy':      'chamoy',
  'pacific mix': 'pacific',
  'pacific':     'pacific',
}

function normalizeTikTokMarca(val) {
  if (!val) return val
  return TIKTOK_BRAND_MAP[String(val).trim().toLowerCase()] ?? val
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX #3 — TopPosts: embed_url viene como HTML de <iframe> completo.
//
// El componente PostCard espera solo la URL para usarla como src del iframe.
// Esta función extrae el src si el valor es un bloque HTML, o lo retorna
// tal cual si ya es una URL limpia.
// ─────────────────────────────────────────────────────────────────────────────
function extractEmbedUrl(val) {
  if (!val) return null
  const s = String(val).trim()
  if (s.startsWith('http') && !s.includes('<iframe')) return s
  const match = s.match(/src="([^"]+)"/)
  return match ? match[1] : null
}

// Normaliza fecha y opcionalmente la marca (solo para TikTok)
function normalizeRows(rows, { normalizeMarca = false } = {}) {
  return rows.map(r => ({
    ...r,
    mes: normalizeMonth(r.mes),
    ...(normalizeMarca && r.marca ? { marca: normalizeTikTokMarca(r.marca) } : {}),
  }))
}

// Normalización especial para TopPosts: fecha + extracción de embed_url
function normalizePostRows(rows) {
  return rows.map(r => ({
    ...r,
    mes:       normalizeMonth(r.mes),
    embed_url: extractEmbedUrl(r.embed_url),
  }))
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────────────────────────────────────
export function useSheetData(marcaId) {
  const [data, setData] = useState({
    empresa: {},
    facebook: [],
    instagram: [],
    tiktok: [],
    googleAds: [],
    googleAdsCiudades: [],
    googleAdsKeywords: [],
    campanas: [],
    topPosts: [],
    sentiment: [],
    sentimentCapturas: [],
    competencia: [],
    hallazgos: [],
    observaciones: [],
  })
  const [brandConfig, setBrandConfig] = useState(null)
  const [availableMonths, setAvailableMonths] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    if (!marcaId) return

    try {
      setIsRefreshing(true)

      const [
        configData,
        marcasData,
        fbData,
        igData,
        ttData,
        gadsData,
        gadsCiudadesData,
        gadsKeywordsData,
        campanasData,
        postsData,
        sentimentData,
        capturasData,
        competenciaData,
        hallazgosData,
        observacionesData,
      ] = await Promise.all([
        fetchSheet('_CONFIG'),
        fetchSheet('_MARCAS'),
        fetchSheet('Facebook'),
        fetchSheet('Instagram'),
        fetchSheet('TikTok'),
        fetchSheet('GoogleAds'),
        fetchSheet('GoogleAds_Ciudades').catch(() => []),
        fetchSheet('GoogleAds_Keywords').catch(() => []),
        fetchSheet('Campañas').catch(() => fetchSheet('Campanas').catch(() => [])),
        fetchSheet('TopPosts'),
        fetchSheet('Sentiment'),
        fetchSheet('Sentiment_Capturas').catch(() => []),
        fetchSheet('Competencia'),
        fetchSheet('Hallazgos'),
        fetchSheet('Observaciones').catch(() => []),
      ])

      // Config global
      const empresa = {}
      configData.forEach(row => {
        if (row.campo && row.valor) empresa[row.campo] = row.valor
      })

      // Brand config
      const brand = marcasData.find(b => b.marca_id === marcaId)
      setBrandConfig(brand)

      // Normalizar todas las hojas
      const fbNorm       = normalizeRows(fbData)
      const igNorm       = normalizeRows(igData)
      const ttNorm       = normalizeRows(ttData, { normalizeMarca: true }) // fix marca TikTok
      const gadsNorm     = normalizeRows(gadsData)
      const campNorm     = normalizeRows(campanasData)
      const sentNorm     = normalizeRows(sentimentData)
      const captNorm     = normalizeRows(capturasData)
      const compNorm     = normalizeRows(competenciaData)
      const hallNorm     = normalizeRows(hallazgosData)
      const obsNorm      = normalizeRows(observacionesData)
      const gadsCiudNorm = normalizeRows(gadsCiudadesData)
      const gadsKwNorm   = normalizeRows(gadsKeywordsData)
      const postNorm     = normalizePostRows(postsData) // fix embed_url + fecha

      // availableMonths desde todas las fuentes con datos
      const allMonths = new Set()
      const addMonths = (arr) =>
        arr.filter(r => r.marca === marcaId && r.mes).forEach(r => allMonths.add(r.mes))

      addMonths(fbNorm)
      addMonths(igNorm)
      addMonths(ttNorm)    // ahora sí encuentra filas tras el fix de marca
      addMonths(gadsNorm)
      addMonths(sentNorm)

      setAvailableMonths(Array.from(allMonths).sort().reverse())

      setData({
        empresa,
        facebook:          fbNorm.filter(r => r.marca === marcaId),
        instagram:         igNorm.filter(r => r.marca === marcaId),
        tiktok:            ttNorm.filter(r => r.marca === marcaId),
        googleAds:         gadsNorm.filter(r => r.marca === marcaId),
        googleAdsCiudades: gadsCiudNorm.filter(r => r.marca === marcaId),
        googleAdsKeywords: gadsKwNorm.filter(r => r.marca === marcaId),
        campanas:          campNorm.filter(r => r.marca === marcaId),
        topPosts:          postNorm.filter(r => r.marca === marcaId),
        sentiment:         sentNorm.filter(r => r.marca === marcaId),
        sentimentCapturas: captNorm.filter(r => r.marca === marcaId),
        competencia:       compNorm.filter(r => r.marca === marcaId),
        hallazgos:         hallNorm.filter(r => r.marca === marcaId),
        observaciones:     obsNorm.filter(r => r.marca === marcaId),
      })

      setLoading(false)
      setIsRefreshing(false)
      setError(null)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Error al cargar los datos. Verifica la conexión y el ID del Sheet.')
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [marcaId])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, brandConfig, availableMonths, loading, error, refresh: loadData, isRefreshing }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades de formato
// ─────────────────────────────────────────────────────────────────────────────
export function formatNumber(value) {
  const num = parseFloat(value)
  if (isNaN(num) || value === '' || value === null || value === undefined) return '-'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString('es-MX')
}

export function formatCurrency(value) {
  const num = parseFloat(value)
  if (isNaN(num) || value === '' || value === null || value === undefined) return '-'
  return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function formatPercent(value) {
  const num = parseFloat(value)
  if (isNaN(num) || value === '' || value === null || value === undefined) return null
  const sign = num >= 0 ? '+' : ''
  return sign + num.toFixed(1) + '%'
}

export function formatDecimal(value, decimals = 2) {
  const num = parseFloat(value)
  if (isNaN(num) || value === '' || value === null || value === undefined) return '-'
  return num.toFixed(decimals)
}

export function safeNumber(value, defaultValue = 0) {
  const num = parseFloat(value)
  return isNaN(num) ? defaultValue : num
}
