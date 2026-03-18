import { useState, useEffect } from 'react'
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { useSheetData } from '../hooks/useSheetData'
import { Overview } from '../components/sections/Overview'
import { SocialSection } from '../components/sections/SocialSection'
import { TikTokSection } from '../components/sections/TikTokSection'
import { GoogleAdsSection } from '../components/sections/GoogleAdsSection'
import { SentimentSection } from '../components/sections/SentimentSection'
import { CompetenciaSection } from '../components/sections/CompetenciaSection'
import { HallazgosSection } from '../components/sections/HallazgosSection'

// Temas por marca
const brandThemes = {
  botanera: {
    primary: '#FF6B00',
    secondary: '#FFD700',
    bgGradientFrom: '#FF6B00',
    bgGradientTo: '#E85D00',
    sidebarBg: '#E85D00',
  },
  chamoy: {
    primary: '#7B2D8E',
    secondary: '#FFD700',
    bgGradientFrom: '#4B0082',
    bgGradientTo: '#2D004F',
    sidebarBg: '#3D0066',
  },
  pacific: {
    primary: '#0A2647',
    secondary: '#E31E24',
    bgGradientFrom: '#0A2647',
    bgGradientTo: '#051530',
    sidebarBg: '#0A2647',
  },
}

const defaultTheme = {
  primary: '#6366f1',
  secondary: '#818cf8',
  bgGradientFrom: '#18181b',
  bgGradientTo: '#09090b',
  sidebarBg: '#18181b',
}

export function Dashboard() {
  const { marcaId } = useParams()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(null)

  const { 
    data, 
    loading, 
    error, 
    refresh, 
    isRefreshing,
    availableMonths,
    brandConfig 
  } = useSheetData(marcaId)

  // Obtener tema
  const theme = brandThemes[marcaId] || defaultTheme

  // Seleccionar el mes más reciente
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0])
    }
  }, [availableMonths, selectedMonth])

  // Filtrar datos por mes
  const getDataForMonth = (dataArray, month) => {
    if (!Array.isArray(dataArray)) return null
    return dataArray.find(d => d.mes === month) || null
  }

  const getArrayDataForMonth = (dataArray, month) => {
    if (!Array.isArray(dataArray)) return []
    return dataArray.filter(d => d.mes === month)
  }

  const filteredData = {
    empresa: data.empresa,
    facebook: getDataForMonth(data.facebook, selectedMonth),
    instagram: getDataForMonth(data.instagram, selectedMonth),
    tiktok: getDataForMonth(data.tiktok, selectedMonth),
    googleAds: getArrayDataForMonth(data.googleAds, selectedMonth),
    googleAdsCiudades: getArrayDataForMonth(data.googleAdsCiudades, selectedMonth),
    googleAdsKeywords: getArrayDataForMonth(data.googleAdsKeywords, selectedMonth),
    campanas: getArrayDataForMonth(data.campanas, selectedMonth),
    topPosts: getArrayDataForMonth(data.topPosts, selectedMonth),
    sentiment: getDataForMonth(data.sentiment, selectedMonth),
    sentimentCapturas: getArrayDataForMonth(data.sentimentCapturas, selectedMonth),
    competencia: getArrayDataForMonth(data.competencia, selectedMonth),
    hallazgos: getArrayDataForMonth(data.hallazgos, selectedMonth),
    observaciones: getArrayDataForMonth(data.observaciones, selectedMonth),
  }

  // Datos históricos para gráficas
  const historicalData = {
    facebook: data.facebook || [],
    instagram: data.instagram || [],
    tiktok: data.tiktok || [],
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: `linear-gradient(135deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})` }}
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">Error al cargar datos</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors text-white"
            >
              Volver
            </button>
            <button
              onClick={refresh}
              className="px-6 py-3 bg-white text-gray-800 hover:bg-white/90 rounded-xl font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        background: `linear-gradient(135deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})`,
      }}
    >
      {/* Sidebar */}
      <Sidebar 
        brandConfig={brandConfig}
        theme={theme}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}`}>
        {/* Header */}
        <Header
          brandConfig={brandConfig}
          theme={theme}
          months={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onRefresh={refresh}
          isRefreshing={isRefreshing}
        />

        {/* Content Area */}
        <main className="p-4 md:p-6">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route 
              path="overview" 
              element={
                <Overview 
                  data={filteredData} 
                  historical={historicalData}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="facebook" 
              element={
                <SocialSection 
                  platform="facebook"
                  data={filteredData.facebook}
                  campanas={filteredData.campanas?.filter(c => c.plataforma === 'facebook')}
                  topPosts={filteredData.topPosts?.filter(p => p.plataforma === 'facebook')}
                  observaciones={filteredData.observaciones?.find(o => o.seccion === 'facebook')}
                  hallazgos={filteredData.hallazgos?.filter(h => h.seccion === 'facebook')}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="instagram" 
              element={
                <SocialSection 
                  platform="instagram"
                  data={filteredData.instagram}
                  campanas={filteredData.campanas?.filter(c => c.plataforma === 'instagram')}
                  topPosts={filteredData.topPosts?.filter(p => p.plataforma === 'instagram')}
                  observaciones={filteredData.observaciones?.find(o => o.seccion === 'instagram')}
                  hallazgos={filteredData.hallazgos?.filter(h => h.seccion === 'instagram')}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="tiktok" 
              element={
                <TikTokSection 
                  data={filteredData.tiktok}
                  campanas={filteredData.campanas?.filter(c => c.plataforma === 'tiktok')}
                  topPosts={filteredData.topPosts?.filter(p => p.plataforma === 'tiktok')}
                  observaciones={filteredData.observaciones?.find(o => o.seccion === 'tiktok')}
                  hallazgos={filteredData.hallazgos?.filter(h => h.seccion === 'tiktok')}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="google-ads" 
              element={
                <GoogleAdsSection 
                  data={filteredData.googleAds}
                  ciudades={filteredData.googleAdsCiudades}
                  keywords={filteredData.googleAdsKeywords}
                  observaciones={filteredData.observaciones?.find(o => o.seccion === 'google-ads')}
                  hallazgos={filteredData.hallazgos?.filter(h => h.seccion === 'google-ads')}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="sentiment" 
              element={
                <SentimentSection 
                  data={filteredData.sentiment}
                  capturas={filteredData.sentimentCapturas}
                  observaciones={filteredData.observaciones?.find(o => o.seccion === 'sentiment')}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="competencia" 
              element={
                <CompetenciaSection 
                  data={filteredData.competencia}
                  observaciones={filteredData.observaciones?.find(o => o.seccion === 'competencia')}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="hallazgos" 
              element={
                <HallazgosSection 
                  data={filteredData.hallazgos?.filter(h => h.seccion === 'hallazgos')}
                  loading={loading}
                  theme={theme}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}
