import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Papa from 'papaparse'

const SHEET_ID = import.meta.env.VITE_SHEET_ID

function getSheetURL(sheetName) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
}

export function BrandSelector() {
  const [brands, setBrands] = useState([])
  const [empresa, setEmpresa] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        // Cargar config y marcas en paralelo
        const [configRes, marcasRes] = await Promise.all([
          fetch(getSheetURL('_CONFIG')),
          fetch(getSheetURL('_MARCAS'))
        ])
        
        const configCsv = await configRes.text()
        const marcasCsv = await marcasRes.text()
        
        // Parsear config global
        const { data: configData } = Papa.parse(configCsv, { header: true, skipEmptyLines: true })
        const empresaObj = {}
        configData.forEach(row => {
          if (row.campo && row.valor) {
            empresaObj[row.campo] = row.valor
          }
        })
        setEmpresa(empresaObj)
        
        // Parsear marcas
        const { data: marcasData } = Papa.parse(marcasCsv, { header: true, skipEmptyLines: true })
        setBrands(marcasData.filter(row => row.marca_id && row.nombre))
        
        setLoading(false)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('No se pudieron cargar los datos. Verifica la configuración del Google Sheet.')
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleSelectBrand = (marcaId) => {
    navigate(`/dashboard/${marcaId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-white/30 border-t-yellow-400 rounded-full mx-auto mb-4"
          />
          <p className="text-white/80">Cargando...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-3">Error de Conexión</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] border-[30px] border-red-400/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] border-[30px] border-red-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo y título desde _EMPRESA */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          {empresa.logo_url && (
            <img 
              src={empresa.logo_url}
              alt={empresa.nombre || 'Logo'}
              className="h-20 md:h-28 mx-auto mb-6 drop-shadow-2xl"
            />
          )}
          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">
            {empresa.titulo || 'Dashboard'}
          </h1>
          <p className="text-white/80 text-lg mt-3">
            {empresa.subtitulo || 'Selecciona una marca'}
          </p>
        </motion.div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {brands.map((brand, index) => (
            <motion.button
              key={brand.marca_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectBrand(brand.marca_id)}
              className="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: brand.color_primario }}
              />
              
              {/* Logo */}
              <div className="relative h-28 flex items-center justify-center mb-6">
                {brand.logo_url ? (
                  <img 
                    src={brand.logo_url}
                    alt={brand.nombre}
                    className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                    style={{ backgroundColor: brand.color_primario }}
                  >
                    {brand.nombre?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Brand name */}
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                {brand.nombre}
              </h2>

              {/* CTA */}
              <div 
                className="flex items-center justify-center gap-2 text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105"
                style={{ 
                  backgroundColor: `${brand.color_primario}15`,
                  color: brand.color_primario 
                }}
              >
                <span>Ver Dashboard</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Color indicator bar */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: brand.color_primario }}
              />
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-white/60 text-sm"
        >
          © {new Date().getFullYear()} {empresa.nombre || 'Dashboard'} • Reportes de Marketing
        </motion.p>
      </div>
    </div>
  )
}
