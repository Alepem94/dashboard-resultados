# 📊 Dashboard de Marketing

Dashboard web profesional para visualizar reportes de marketing de múltiples marcas, conectado a Google Sheets.

![Dashboard Preview](https://via.placeholder.com/800x400/1a1a2e/818cf8?text=Marketing+Dashboard)

## ✨ Características

- 🎨 **Diseño premium** - Estética moderna tipo SaaS con animaciones fluidas
- 📱 **Responsive** - Funciona en desktop, tablet y móvil
- 🔄 **Datos en tiempo real** - Se actualiza automáticamente desde Google Sheets
- 🏷️ **Multi-marca** - Soporte para múltiples marcas/clientes
- 📈 **Visualizaciones interactivas** - Gráficas, KPIs, tablas y más
- 🌙 **Modo oscuro** - Diseño optimizado para presentaciones

## 🚀 Despliegue Rápido (15 minutos)

### Paso 1: Configurar Google Sheet

1. **Crear el Sheet** - Ve a [sheets.new](https://sheets.new) y crea un nuevo documento
2. **Crear las hojas** (tabs) con estos nombres exactos:
   - `_CONFIG` - Configuración de marcas
   - `_MESES` - Meses disponibles por marca
   - `KPIs_Globales` - KPIs consolidados
   - `Metas` - Metas y cumplimiento
   - `Facebook` - Métricas de Facebook
   - `Instagram` - Métricas de Instagram
   - `TikTok` - Métricas de TikTok
   - `GoogleAds` - Métricas de Google Ads
   - `TopPosts` - Posts destacados
   - `Sentiment` - Análisis de sentimiento
   - `Competencia` - Datos de competidores
   - `Hallazgos` - Insights y recomendaciones

3. **Publicar como CSV**:
   - Archivo → Compartir → Publicar en la web
   - Seleccionar "Todo el documento" y formato "CSV"
   - Clic en "Publicar"

4. **Copiar el ID** del Sheet de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_ID]/edit
   ```

### Paso 2: Desplegar en Vercel

1. **Subir a GitHub**:
   - Crear cuenta en [github.com](https://github.com) si no tienes
   - Crear nuevo repositorio
   - Subir todos los archivos del proyecto

2. **Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com) y crea cuenta con GitHub
   - Clic en "New Project" → Importar tu repositorio
   - En "Environment Variables" agregar:
     - Nombre: `VITE_SHEET_ID`
     - Valor: El ID de tu Google Sheet
   - Clic en "Deploy"

3. **¡Listo!** Tu dashboard estará en `tu-proyecto.vercel.app`

## 📋 Estructura del Google Sheet

### Hoja `_CONFIG`
| marca_id | nombre | logo_url | color_primario | color_secundario |
|----------|--------|----------|----------------|------------------|
| botanera | La Botanera | https://... | #ff6b35 | #f7c59f |
| chamoy | Chamoy Mega | | #e91e63 | |

### Hoja `_MESES`
| marca | mes |
|-------|-----|
| botanera | 2024-01 |
| botanera | 2024-02 |

### Hoja `KPIs_Globales`
| marca | mes | comunidad_fb | comunidad_ig | comunidad_tk | alcance_total | interaccion_total | inversion_total | etr_promedio |
|-------|-----|--------------|--------------|--------------|---------------|-------------------|-----------------|--------------|
| botanera | 2024-02 | 15000 | 8500 | 3200 | 125000 | 4500 | 5000 | 3.6 |

### Hoja `Metas`
| marca | mes | plataforma | objetivo | meta | resultado | cumplimiento |
|-------|-----|------------|----------|------|-----------|--------------|
| botanera | 2024-02 | Facebook | Alcance | 100000 | 125000 | 125 |

### Hojas `Facebook` / `Instagram` / `TikTok`
| marca | mes | followers | alcance | impresiones | interacciones | engagement_rate | nuevos_seguidores | publicaciones | inversion_paid | resultados_paid |
|-------|-----|-----------|---------|-------------|---------------|-----------------|-------------------|---------------|----------------|-----------------|

### Hoja `GoogleAds`
| marca | mes | tipo_campana | impresiones | clics | ctr | cpc | inversion | conversiones | cpa | roas |
|-------|-----|--------------|-------------|-------|-----|-----|-----------|--------------|-----|------|
| botanera | 2024-02 | Search | 50000 | 1500 | 3.0 | 0.8 | 1200 | 45 | 26.67 | 3.5 |

### Hoja `TopPosts`
| marca | mes | plataforma | post_url | imagen_url | descripcion | alcance | interacciones | tipo |
|-------|-----|------------|----------|------------|-------------|---------|---------------|------|

### Hoja `Sentiment`
| marca | mes | positivo | neutro | negativo | comentarios_destacados | resumen_cualitativo |
|-------|-----|----------|--------|----------|------------------------|---------------------|
| botanera | 2024-02 | 65 | 25 | 10 | Excelente sabor|Me encanta|Muy bueno | La percepción general es positiva... |

### Hoja `Competencia`
| marca | mes | competidor | red | followers | variacion | engagement | actividad |
|-------|-----|------------|-----|-----------|-----------|------------|-----------|

### Hoja `Hallazgos`
| marca | mes | tipo | titulo | descripcion | prioridad |
|-------|-----|------|--------|-------------|-----------|
| botanera | 2024-02 | insight | Contenido viral | El reel de recetas tuvo 3x más alcance | alta |

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear archivo .env.local con tu SHEET_ID
echo "VITE_SHEET_ID=tu_sheet_id_aqui" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## 📅 Mantenimiento Mensual

Cada mes solo necesitas:

1. Agregar una nueva fila en `_MESES` con el nuevo mes
2. Agregar filas con datos del nuevo mes en cada hoja
3. Los usuarios solo necesitan refrescar el dashboard

## 🎨 Personalización

### Colores de marca
En `_CONFIG`, define los colores por marca:
- `color_primario`: Color principal (botones, acentos)
- `color_secundario`: Color secundario

### Logo
Sube el logo a un hosting de imágenes (Imgur, etc.) y coloca la URL en `logo_url`.

## 📝 Notas

- El Sheet debe estar **publicado** (no solo compartido) para que funcione
- Los nombres de las hojas son **case-sensitive**
- El formato de fecha debe ser `YYYY-MM` (ej: 2024-02)
- Separar comentarios destacados con `|` (pipe)

## 🆘 Solución de Problemas

**No cargan los datos**
- Verifica que el Sheet esté publicado (Archivo → Publicar en la web)
- Confirma que el VITE_SHEET_ID sea correcto
- Revisa los nombres de las hojas (deben ser exactos)

**Error de CORS**
- Google Sheets publicado como CSV no tiene problemas de CORS
- Si persiste, verifica la URL del Sheet

**Datos desactualizados**
- Los datos se cachean brevemente
- Usa el botón de refresh en el header
- El caché de Google puede tardar unos minutos

## 📄 Licencia

MIT - Usa libremente para tus proyectos.

---

Hecho con ❤️ para equipos de marketing digital
