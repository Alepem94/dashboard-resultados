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
        mesesData,
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
        fetchSheet('_MESES'),
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
        if (row.campo && row.valor) {
          empresa[row.campo] = row.valor
        }
      })

      // Brand config (desde _MARCAS)
      const brand = marcasData.find(b => b.marca_id === marcaId)
      setBrandConfig(brand)

      // Available months (filtrar por marca)
      const allMonths = new Set()
      fbData.filter(r => r.marca === marcaId && r.seguidores).forEach(r => allMonths.add(r.mes))
      igData.filter(r => r.marca === marcaId && r.seguidores).forEach(r => allMonths.add(r.mes))
      ttData.filter(r => r.marca === marcaId && r.seguidores).forEach(r => allMonths.add(r.mes))
      
      const sortedMonths = Array.from(allMonths).sort().reverse()
      setAvailableMonths(sortedMonths)

      // Filter data by marca
      setData({
        empresa,
        facebook: fbData.filter(r => r.marca === marcaId),
        instagram: igData.filter(r => r.marca === marcaId),
        tiktok: ttData.filter(r => r.marca === marcaId),
        googleAds: gadsData.filter(r => r.marca === marcaId),
        googleAdsCiudades: gadsCiudadesData.filter(r => r.marca === marcaId),
        googleAdsKeywords: gadsKeywordsData.filter(r => r.marca === marcaId),
        campanas: campanasData.filter(r => r.marca === marcaId),
        topPosts: postsData.filter(r => r.marca === marcaId),
        sentiment: sentimentData.filter(r => r.marca === marcaId),
        sentimentCapturas: capturasData.filter(r => r.marca === marcaId),
        competencia: competenciaData.filter(r => r.marca === marcaId),
        hallazgos: hallazgosData.filter(r => r.marca === marcaId),
        observaciones: observacionesData.filter(r => r.marca === marcaId),
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

  return {
    data,
    brandConfig,
    availableMonths,
    loading,
    error,
    refresh: loadData,
    isRefreshing,
  }
}

// Utilidades de formato
export function formatNumber(value) {
  const num = parseFloat(value)
  if (isNaN(num) || value === '' || value === null || value === undefined) return '-'
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
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
