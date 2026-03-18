# 🎯 Dashboard de Reporting Marketing - Arquitectura Completa

## Documento de Diseño para Analistas No-Técnicos

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Recomendada](#arquitectura-recomendada)
3. [Tecnologías Seleccionadas](#tecnologías-seleccionadas)
4. [Estructura del Google Sheet](#estructura-del-google-sheet)
5. [Instrucciones de Implementación](#instrucciones-de-implementación)
6. [Guía de Despliegue](#guía-de-despliegue)
7. [Mantenimiento Mensual](#mantenimiento-mensual)
8. [Recomendaciones UX](#recomendaciones-ux)

---

## 🎯 RESUMEN EJECUTIVO

### Solución Propuesta
Un dashboard web moderno basado en **React + Vite** que:
- Lee datos directamente de Google Sheets (sin backend)
- Se actualiza automáticamente al refrescar
- Se despliega gratis en Vercel/Netlify
- Soporta múltiples marcas con diseño premium
- No requiere conocimientos de programación para mantener

### Por qué esta arquitectura

| Criterio | Solución Elegida | Alternativa Descartada | Razón |
|----------|------------------|------------------------|-------|
| Framework | React + Vite | Next.js | Más simple, sin SSR innecesario |
| Datos | Google Sheets API pública | Firebase/Supabase | Sin backend, gratis, familiar |
| Gráficas | Recharts | Chart.js | Mejor integración React |
| Estilos | Tailwind CSS | CSS Modules | Desarrollo más rápido |
| Deploy | Vercel | Netlify | Mejor DX, preview automático |

---

## 🏗️ ARQUITECTURA RECOMENDADA

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO FINAL                            │
│                    (Cliente / Stakeholder)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DASHBOARD WEB                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React + Vite                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │    │
│  │  │ Selector │ │ Overview │ │  Redes   │ │ Insights │    │    │
│  │  │  Marca   │ │   KPIs   │ │ Sociales │ │          │    │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │              Componentes Compartidos              │   │    │
│  │  │  • KPICard • Charts • Tables • Navigation        │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Hosting: Vercel (gratis) | CDN: Automático | SSL: Incluido     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Papa Parse (CSV Parser)                     │    │
│  │         Lee Google Sheets publicado como CSV             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Config    │ │    KPIs     │ │   Social    │               │
│  │   Marcas    │ │  Mensuales  │ │   Posts     │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  Google Ads │ │  Sentiment  │ │ Competencia │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                  │
│  Publicado como: "Cualquiera con el enlace puede ver"           │
└─────────────────────────────────────────────────────────────────┘
                                ▲
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      ANALISTA                                    │
│              (Actualiza el Sheet mensualmente)                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Analista** actualiza Google Sheets cada mes
2. **Google Sheets** está publicado públicamente como CSV
3. **Dashboard** lee el CSV al cargar (sin API key necesaria)
4. **Usuario** ve los datos actualizados al refrescar

---

## 🛠️ TECNOLOGÍAS SELECCIONADAS

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | UI Components |
| Vite | 5.x | Build tool rápido |
| Tailwind CSS | 3.x | Estilos utility-first |
| Recharts | 2.x | Gráficas interactivas |
| Framer Motion | 10.x | Animaciones suaves |
| React Router | 6.x | Navegación SPA |
| Papa Parse | 5.x | Parser CSV |
| Lucide React | - | Iconos modernos |

### Infraestructura (Todo Gratis)
| Servicio | Plan | Límites |
|----------|------|---------|
| Vercel | Hobby | 100GB bandwidth/mes |
| Google Sheets | Gratis | Sin límites prácticos |
| GitHub | Free | Repositorio privado |

### Por qué NO usar otras opciones

❌ **Next.js**: Demasiado complejo para este caso, SSR innecesario
❌ **Firebase**: Requiere configuración de backend
❌ **Airtable**: Límites en plan gratis, más caro
❌ **Notion API**: Más lento, límites de requests
❌ **Google Sheets API con OAuth**: Requiere API key, más complejo

---

## 📊 ESTRUCTURA DEL GOOGLE SHEET

### Organización por Hojas (Tabs)

```
📁 Dashboard_Marketing_2024
├── 📄 _CONFIG           → Configuración de marcas
├── 📄 _MESES            → Lista de meses disponibles
├── 📄 KPIs_Globales     → Métricas principales
├── 📄 Metas             → Objetivos vs resultados
├── 📄 Facebook          → Datos FB
├── 📄 Instagram         → Datos IG
├── 📄 TikTok            → Datos TK
├── 📄 GoogleAds         → Campañas Google
├── 📄 TopPosts          → Posts destacados
├── 📄 Sentiment         → Análisis de sentimiento
├── 📄 Competencia       → Datos competidores
├── 📄 Hallazgos         → Insights y recomendaciones
└── 📄 Historico         → Datos acumulados
```

### Hoja: _CONFIG

| Columna A | Columna B | Columna C | Columna D | Columna E |
|-----------|-----------|-----------|-----------|-----------|
| marca_id | nombre | logo_url | color_primario | color_secundario |
| botanera | La Botanera | https://... | #FF6B35 | #1A1A2E |
| chamoy | Chamoy Mega | https://... | #E91E63 | #2D1B69 |
| pacific | Pacific Mix | https://... | #00BCD4 | #004D5C |

### Hoja: KPIs_Globales

| marca | mes | comunidad_fb | comunidad_ig | comunidad_tk | alcance_total | interaccion_total | inversion_total | etr_promedio |
|-------|-----|--------------|--------------|--------------|---------------|-------------------|-----------------|--------------|
| botanera | 2024-01 | 125000 | 89000 | 45000 | 2500000 | 185000 | 15000 | 4.2 |
| botanera | 2024-02 | 128000 | 92000 | 52000 | 2800000 | 195000 | 16500 | 4.5 |
| chamoy | 2024-01 | 85000 | 62000 | 38000 | 1800000 | 125000 | 12000 | 3.8 |

### Hoja: Metas

| marca | mes | plataforma | objetivo | meta | resultado | cumplimiento |
|-------|-----|------------|----------|------|-----------|--------------|
| botanera | 2024-01 | Facebook | Alcance | 500000 | 520000 | 104% |
| botanera | 2024-01 | Instagram | Engagement | 4.5% | 4.2% | 93% |
| botanera | 2024-01 | TikTok | Views | 1000000 | 1250000 | 125% |

### Hoja: Facebook (igual estructura para IG y TikTok)

| marca | mes | followers | alcance | impresiones | interacciones | engagement_rate | nuevos_seguidores | publicaciones | inversion_paid | resultados_paid |
|-------|-----|-----------|---------|-------------|---------------|-----------------|-------------------|---------------|----------------|-----------------|
| botanera | 2024-01 | 125000 | 520000 | 780000 | 45000 | 3.6 | 3500 | 24 | 5000 | 125000 |

### Hoja: GoogleAds

| marca | mes | tipo_campana | impresiones | clics | ctr | cpc | inversion | conversiones | cpa | roas |
|-------|-----|--------------|-------------|-------|-----|-----|-----------|--------------|-----|------|
| botanera | 2024-01 | Search | 150000 | 4500 | 3.0 | 0.85 | 3825 | 125 | 30.6 | 4.2 |
| botanera | 2024-01 | Display | 500000 | 2500 | 0.5 | 0.45 | 1125 | 45 | 25.0 | 3.8 |
| botanera | 2024-01 | Video | 250000 | 3000 | 1.2 | 0.65 | 1950 | 85 | 22.9 | 5.1 |

### Hoja: TopPosts

| marca | mes | plataforma | post_url | imagen_url | descripcion | alcance | interacciones | tipo |
|-------|-----|------------|----------|------------|-------------|---------|---------------|------|
| botanera | 2024-01 | Instagram | https://... | https://... | Lanzamiento nuevo sabor | 85000 | 12500 | carousel |

### Hoja: Sentiment

| marca | mes | positivo | neutro | negativo | comentarios_destacados | resumen_cualitativo |
|-------|-----|----------|--------|----------|------------------------|---------------------|
| botanera | 2024-01 | 72 | 20 | 8 | "Excelente sabor"|"Me encanta" | Percepción positiva general... |

### Hoja: Competencia

| marca | mes | competidor | red | followers | variacion | engagement | actividad |
|-------|-----|------------|-----|-----------|-----------|------------|-----------|
| botanera | 2024-01 | Competidor A | Instagram | 95000 | +2.5% | 3.2% | 18 posts |

### Hoja: Hallazgos

| marca | mes | tipo | titulo | descripcion | prioridad |
|-------|-----|------|--------|-------------|-----------|
| botanera | 2024-01 | insight | TikTok en crecimiento | El formato corto... | alta |
| botanera | 2024-01 | recomendacion | Aumentar UGC | Contenido generado... | media |

---

## 🚀 INSTRUCCIONES DE IMPLEMENTACIÓN

### Paso 1: Preparar Google Sheet (15 minutos)

1. **Crear nuevo Google Sheet**
   - Ve a sheets.google.com
   - Crear hoja en blanco
   - Nombrar: "Dashboard_Marketing_2024"

2. **Crear las hojas según estructura**
   - Click derecho en tab → Duplicar
   - Renombrar cada tab según la estructura

3. **Publicar el Sheet**
   - Archivo → Compartir → Publicar en la web
   - Seleccionar "Documento completo"
   - Formato: CSV
   - Publicar
   - **IMPORTANTE**: Copiar el ID del documento de la URL
   
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```

### Paso 2: Configurar el Proyecto (10 minutos)

1. **Crear cuenta en GitHub** (si no tienes)
   - github.com → Sign up

2. **Crear cuenta en Vercel**
   - vercel.com → Sign up with GitHub

3. **Importar el proyecto**
   - En Vercel, click "Import Project"
   - Autorizar acceso a GitHub
   - El proyecto se creará automáticamente

### Paso 3: Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```
VITE_SHEET_ID = tu_id_del_sheet
VITE_SHEET_NAME = Dashboard_Marketing_2024
```

### Paso 4: Desplegar

1. Push a GitHub → Vercel despliega automáticamente
2. URL gratuita: `tu-proyecto.vercel.app`

---

## 📅 MANTENIMIENTO MENSUAL

### Checklist Mensual (30 minutos)

```
□ 1. Abrir Google Sheet
□ 2. Agregar nueva fila en cada hoja con el mes actual
□ 3. Pegar datos de plataformas:
    □ Meta Business Suite → Facebook/Instagram
    □ TikTok Business Center → TikTok
    □ Google Ads → GoogleAds
□ 4. Llenar TopPosts con mejores publicaciones
□ 5. Actualizar Sentiment con análisis
□ 6. Agregar Hallazgos del mes
□ 7. Verificar dashboard (refrescar página)
□ 8. Compartir URL con cliente
```

### Template de Copiado Rápido

Para facilitar el copiado desde plataformas, usa este orden en cada hoja:
- Las columnas están ordenadas igual que los exports de cada plataforma
- Solo copia y pega, sin reorganizar

---

## 🎨 RECOMENDACIONES UX ADICIONALES

### Diseño Visual

1. **Paleta de Colores por Marca**
   - Usar colores de la hoja _CONFIG
   - Aplicar automáticamente al seleccionar marca

2. **Tipografía**
   - Títulos: Plus Jakarta Sans (bold)
   - Cuerpo: Plus Jakarta Sans (regular)
   - Números: JetBrains Mono

3. **Animaciones**
   - Entrada suave de cards (stagger 50ms)
   - Hover en cards con elevación
   - Transiciones de página fluidas
   - Gráficas con animación de entrada

4. **Responsive**
   - Mobile-first
   - Breakpoints: sm(640) md(768) lg(1024) xl(1280)
   - Sidebar colapsable en móvil

### Interactividad

1. **Filtros Intuitivos**
   - Selector de marca prominente
   - Dropdown de mes con preview
   - Filtros guardados en URL

2. **Feedback Visual**
   - Loading skeletons (no spinners)
   - Estados vacíos amigables
   - Indicadores de variación con color

3. **Accesibilidad**
   - Contraste WCAG AA
   - Navegación por teclado
   - Labels descriptivos

### Performance

1. **Optimizaciones**
   - Lazy loading de secciones
   - Caché de datos en sessionStorage
   - Imágenes optimizadas (WebP)

2. **Métricas Objetivo**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## 📁 ESTRUCTURA DE ARCHIVOS DEL PROYECTO

```
dashboard-marketing/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── KPICard.jsx
│   │   │   ├── Chart.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── SentimentGauge.jsx
│   │   │   └── PostCard.jsx
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── PageWrapper.jsx
│   │   └── sections/
│   │       ├── Overview.jsx
│   │       ├── SocialSection.jsx
│   │       ├── GoogleAdsSection.jsx
│   │       └── InsightsSection.jsx
│   ├── hooks/
│   │   ├── useSheetData.js
│   │   └── useFilters.js
│   ├── utils/
│   │   ├── calculations.js
│   │   └── formatters.js
│   ├── pages/
│   │   ├── BrandSelector.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## ✅ CHECKLIST DE ENTREGA

- [ ] Google Sheet estructurado y publicado
- [ ] Proyecto desplegado en Vercel
- [ ] URL compartida con cliente
- [ ] Analista capacitado en actualización
- [ ] Documentación entregada

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### "No cargan los datos"
1. Verificar que el Sheet esté publicado
2. Verificar el ID en variables de entorno
3. Verificar nombres de hojas (sin espacios extra)

### "Las variaciones no se calculan"
1. Verificar que exista el mes anterior
2. Verificar formato de fecha (YYYY-MM)
3. Verificar que los números no tengan comas

### "No aparece una marca"
1. Verificar que esté en la hoja _CONFIG
2. Verificar que el marca_id coincida en todas las hojas

---

*Documento preparado para implementación inmediata*
*Actualizado: Marzo 2024*
