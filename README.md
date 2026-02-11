# SnowStrat Field ❄️

<p align="center">
  <img src="public/pwa-512x512.png" alt="SnowStrat Field Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Aplicación PWA para la toma de datos nivológicos en campo</strong><br>
  <em>PWA Application for field snow data collection</em>
</p>

<p align="center">
  <a href="#español">🇪🇸 Español</a> •
  <a href="#english">🇬🇧 English</a>
</p>

---

# Español

## 📖 Descripción

**SnowStrat Field** es una herramienta digital avanzada diseñada para profesionales de la nivología (guías, observadores y técnicos de rescate). La aplicación permite el registro sistemático de perfiles estratigráficos y tests de estabilidad en el terreno, cumpliendo con los estándares internacionales de la IACS y las directrices de la Guía de Observación Nivometeorológica (AEMET).

## ✨Funcionalidades Principales
- **Registro de Estaciones:** Captura de datos de ubicación, altitud, orientación (0-9 según codificación estándar), inclinación de la ladera y parámetros meteorológicos básicos.
- **Estratigrafía Detallada:**
    - Identificación de capas por profundidad.
    - Registro de resistencia (Escala: Puño, 4 Dedos, 1 Dedo, Lápiz, Cuchillo).
    - Clasificación de forma y tamaño de grano (Nieve reciente, granos redondeados, caras planas, escarcha, etc.), así como su diámetro.
    - Registro de humedad.
- **Tests de Estabilidad:** Plantillas específicas para Test de Compresión (CT), Test de Columna Extendida (ECT) y Test de Propagación de Sierra (PST), con registro de tipo de fractura y plano de deslizamiento.
- **Visualización:** Generación en tiempo real del perfil de dureza y el gradiente térmico del manto.

## 🧊 Flujo de Trabajo Sugerido (Workflow)
1. **Configuración del Sitio:** Al llegar al punto de observación, registrar la pendiente y orientación antes de alterar el manto.
2. **Perfil de Temperaturas:** Realizar las mediciones térmicas cada 10 cm inmediatamente después de abrir la calicata.
3. **Análisis de Capas:** Definir las fases de dureza y clasificar los cristales según el estándar internacional.
4. **Ejecución de Tests:** Realizar las pruebas de estabilidad (ECT/CT) para validar las capas críticas identificadas. (Pendiente incluir otros test como ECT)
5. **Finalización:** Revisar el gráfico generado y exportar/guardar los datos antes de abandonar el punto.

## 📲 Características técnicas

- **📴 Uso Offline**: Funciona completamente sin conexión a internet gracias a la tecnología PWA con Service Workers.
- **📍 Geolocalización WGS84**: Captura automática de coordenadas GPS en formato estándar internacional.
- **📊 Visualización Gráfica IACS**: Representación visual del perfil estratigráfico con colores y símbolos según la Clasificación Internacional de Nieve Estacional en Suelo (IACS 2009).
- **📁 Exportación GeoJSON**: Exporta los perfiles en formato GeoJSON estandarizado, compatible con sistemas GIS.
- **🌍 Soporte Multiidioma**: Disponible en Castellano, Gallego, Asturiano, Euskera, Catalán, Aranés, Andorrano, Inglés, Francés, Alemán e Italiano.
- **📱 Instalable como App**: Se puede instalar en dispositivos móviles como una aplicación nativa.
- **🧤 Diseño para Campo**: Interfaz optimizada para uso con guantes y en condiciones adversas.

## 🚀 Guía de Instalación

### Despliegue en Vercel

1. Haz fork de este repositorio
2. Conecta tu cuenta de GitHub con [Vercel](https://vercel.com)
3. Importa el proyecto desde tu repositorio
4. Vercel detectará automáticamente la configuración de Vite
5. Haz clic en "Deploy"

### Despliegue en Netlify

1. Haz fork de este repositorio
2. Conecta tu cuenta de GitHub con [Netlify](https://netlify.com)
3. Selecciona el repositorio
4. Configura el comando de build: `npm run build`
5. Configura el directorio de publicación: `dist`
6. Haz clic en "Deploy site"

### Instalación como PWA en Móviles

#### Android (Chrome)
1. Abre la aplicación en Chrome
2. Toca el menú (⋮) → "Instalar aplicación" o "Añadir a pantalla de inicio"
3. Confirma la instalación

#### iOS (Safari)
1. Abre la aplicación en Safari
2. Toca el botón "Compartir" (□↑)
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma con "Añadir"

### Desarrollo Local

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🛠️ Especificaciones Técnicas

| Tecnología | Uso |
|------------|-----|
| **React 18** | Framework de interfaz de usuario |
| **TypeScript** | Tipado estático y seguridad de código |
| **Vite** | Bundler y servidor de desarrollo |
| **Tailwind CSS** | Sistema de diseño y estilos |
| **shadcn/ui** | Componentes de interfaz accesibles |
| **Lucide Icons** | Iconografía consistente |
| **vite-plugin-pwa** | Funcionalidad PWA y Service Workers |
| **IndexedDB (idb)** | Persistencia de datos offline |
| **LocalStorage** | Almacenamiento de preferencias |
| **proj4** | Transformación de coordenadas |

### Estándares Seguidos

- **IACS 2009**: International Classification for Seasonal Snow on the Ground
- **WGS84**: Sistema de coordenadas estándar GPS
- **GeoJSON (RFC 7946)**: Formato de intercambio de datos geoespaciales

## ⚠️ Disclaimer / Descargo de Responsabilidad

> **ADVERTENCIA**: Esta aplicación es una herramienta de apoyo para la toma de datos nivológicos. **NO sustituye la formación profesional, la experiencia en montaña ni el criterio experto** en la evaluación de riesgos de avalanchas.
>
> El uso de esta aplicación en terreno de montaña se realiza bajo la exclusiva responsabilidad del usuario. Los desarrolladores no se hacen responsables de accidentes, lesiones o daños derivados del uso de esta herramienta o de las decisiones tomadas basándose en los datos registrados.
>
> **Antes de adentrarse en terreno nevado, asegúrese de contar con la formación adecuada, el equipo de seguridad necesario (DVA, sonda, pala) y consulte siempre los boletines de peligro de aludes oficiales.**

## 🔗 Referencias y Recursos de Formación

- [AEMET - Predicción de Aludes](https://www.aemet.es) - Agencia Estatal de Meteorología
- [RecMountain](https://recmountain.com) - Formación en seguridad en montaña
- [Alurte](https://alurte.com) - Cursos de nivología y rescate
- [ACNA](https://acna.es) - Asociación para el Conocimiento de la Nieve y Aludes
- [Lauegi Report](https://lauegi.report) - Boletines de peligro de aludes del Pirineo
- [Montaña Segura](https://montanasegura.com) - Prevención de accidentes en montaña

## 🛡️ Licencia y Uso
Este proyecto es un MVP protegido bajo la licencia **Polyform Noncommercial 1.0.0**.

✅ Se permite: Uso personal, pruebas, aprendizaje y mejoras compartidas.
❌ Se prohíbe: Uso comercial, venta del software o servicios basados en este código sin autorización.

Para licencias comerciales o colaboraciones profesionales, escríbeme a: sanidevix@gmail.com

## 💖 Agradecimientos

A **Luis, Álvaro y Alberto Pantoja**, por su incansable trabajo, sus enseñanzas y la motivación que transmiten a todos los que amamos la montaña y la nieve.

A **Jonay**, por su amistad inquebrantable y su compañía en tantas aventuras.

---

## 🔄 Reproducibilidad (Master Prompt - Español)

<details>
<summary><strong>Haz clic para expandir el Master Prompt completo</strong></summary>

```
PROMPT MAESTRO - SNOWSTRAT FIELD

Crea una aplicación web progresiva (PWA) para la toma de datos nivológicos en campo con las siguientes especificaciones:

=== IDENTIDAD ===
- Nombre: "SnowStrat Field"
- Subtítulo: "Perfiles estratigráficos nivales"
- Logo: Icono de copo de nieve estilizado

=== TECNOLOGÍAS ===
- React 18 con TypeScript
- Vite como bundler
- Tailwind CSS para estilos
- shadcn/ui para componentes
- Lucide Icons para iconografía
- vite-plugin-pwa para funcionalidad offline
- IndexedDB (librería idb) para persistencia
- proj4 para transformación de coordenadas

=== FUNCIONALIDADES PRINCIPALES ===

1. GESTIÓN DE PERFILES:
   - Crear nuevos perfiles estratigráficos
   - Cada perfil incluye: nombre, fecha/hora, coordenadas GPS (WGS84), orientación, inclinación, altitud
   - Almacenar múltiples perfiles en IndexedDB
   - Exportar perfiles individuales o múltiples en formato GeoJSON

2. REGISTRO DE CAPAS (MUESTRAS):
   - Altura de la capa (cm)
   - Tipo de grano según clasificación IACS: PP, DF, RG, FC, DH, SH, MF, IF, Hielo
   - Tamaño del grano (mm): rango 0.1 - 5.0
   - Dureza: Puño (F), 4 dedos (4D), 1 dedo (1D), Lápiz (P), Cuchillo (K), Hielo (I)
   - Humedad: Seco, Ligeramente húmedo, Húmedo, Mojado, Muy mojado
   - Temperatura (°C): valores negativos con decimales, controles stepper ±0.1

3. VISUALIZACIÓN GRÁFICA:
   - Representación vertical del perfil estratigráfico
   - Escala de altura en cm
   - Colores según tipo de grano (estándar IACS):
     * PP (Precipitación): Azul claro (#87CEEB)
     * DF (Partículas descompuestas): Verde (#90EE90)
     * RG (Granos redondeados): Verde oscuro (#228B22)
     * FC (Caras planas): Amarillo (#FFD700)
     * DH (Escarcha de profundidad): Naranja (#FFA500)
     * SH (Escarcha de superficie): Rosa (#FF69B4)
     * MF (Formas de fusión): Rojo (#DC143C)
     * IF (Cristales de hielo): Gris (#808080)
   - Símbolos de dureza representados con barras horizontales proporcionales

4. GEOLOCALIZACIÓN:
   - Captura automática de coordenadas GPS
   - Formato WGS84 (latitud, longitud)
   - Altitud cuando esté disponible
   - Mostrar precisión de la lectura
   - Botón para refrescar ubicación

5. INTERFAZ DE USUARIO:
   - Header con logo, nombre y selector de idioma
   - Diseño responsive (mobile-first)
   - Botones grandes para uso con guantes
   - Contraste alto para visibilidad en exteriores
   - Tema claro/oscuro
   - Navegación por tabs: Formulario | Tabla | Gráfico

6. TABLA DE MUESTRAS:
   - Listado de todas las capas registradas
   - Columnas: Nº, Altura, Acumulado, Grano, Tamaño, Dureza, Humedad, Temp
   - Acciones: editar, eliminar, reordenar (drag & drop)
   - Altura acumulada calculada automáticamente

7. EXPORTACIÓN:
   - Formato GeoJSON con estructura:
     * type: "FeatureCollection"
     * features: array de perfiles
     * Cada perfil como Feature con geometry (Point) y properties
     * Properties incluye: nombre, fecha, muestras[], metadatos
   - Nombre de archivo: snowstrat_[nombre]_[fecha].geojson

8. INTERNACIONALIZACIÓN (i18n):
   - Idiomas: Castellano, Gallego, Asturiano, Euskera, Catalán, Aranés, Andorrano, Inglés, Francés, Alemán, Italiano
   - Sistema de traducciones con contexto React
   - Selector de idioma con banderas en header
   - Persistencia de preferencia de idioma

9. PWA:
   - Service Worker para funcionamiento offline
   - Manifest con iconos para instalación
   - Estrategia cache-first para assets
   - Sincronización cuando hay conexión

=== ESTRUCTURA DE ARCHIVOS ===
src/
├── components/
│   ├── ProfileApp.tsx (componente principal)
│   ├── ProfileHeader.tsx (cabecera)
│   ├── ProfileManager.tsx (gestión de perfiles)
│   ├── SampleForm.tsx (formulario de capas)
│   ├── SampleTable.tsx (tabla de muestras)
│   ├── StratigraphicChart.tsx (gráfico)
│   ├── LanguageSelector.tsx
│   └── Documentation.tsx
├── i18n/
│   ├── context.tsx (proveedor de traducciones)
│   ├── types.ts (tipos TypeScript)
│   └── translations/ (archivos por idioma)
├── hooks/
│   ├── useGeolocation.ts
│   └── useCurrentTime.ts
├── lib/
│   └── db.ts (IndexedDB)
└── pages/
    └── Index.tsx

=== ESTÁNDARES ===
- IACS 2009 para clasificación de nieve
- WGS84 para coordenadas
- GeoJSON RFC 7946 para exportación
- WCAG 2.1 AA para accesibilidad

=== DISCLAIMER ===
Incluir advertencia clara de que la app no sustituye formación profesional ni criterio experto en evaluación de riesgos de avalanchas.
```

</details>

---

# English

## 📖 Description

**SnowStrat Field** is an advanced digital tool designed for snow science professionals (guides, observers, and rescue technicians). The application enables the systematic recording of stratigraphic profiles and stability tests in the field, complying with IACS international standards and the guidelines of the Nivometeorological Observation Guide.

## ✨ Key Features
- **Station Recording:** Capture of location data, altitude, aspect (0-9 according to standard coding), slope angle, and basic meteorological parameters.
- **Detailed Stratigraphy:** - Layer identification by depth.
    - Hardness recording (Scale: Fist, 4 Fingers, 1 Finger, Pencil, Knife).
    - Grain shape and size classification (New snow, rounded grains, faceted crystals, hoar, etc.), and grain diameter.
    - Moisture recording.
- **Stability Tests:** Specific templates for Compression Test (CT), Extended Column Test (ECT), including fracture type and shear plane recording. (ECT func. pending)
- **Visualization:** Real-time generation of the hardness profile and the thermal gradient of the snowpack.

## 🧊 Suggested Workflow
1. **Site Setup:** Upon arriving at the observation point, record the slope and aspect before disturbing the snowpack.
2. **Temperature Profile:** Take thermal measurements every 10 cm immediately after opening the snow pit.
3. **Layer Analysis:** Define hardness interfaces and classify crystals according to the international standard.
4. **Test Execution:** Perform stability tests (ECT/CT) to validate the critical layers identified in the previous step.
5. **Finalization:** Review the generated chart and export/save the data before leaving the site.

## 📲 Technical Features
- **📴 Offline Use**: Works completely without internet connection thanks to PWA technology with Service Workers.
- **📍 WGS84 Geolocation**: Automatic GPS coordinate capture in international standard format.
- **📊 IACS Graphic Visualization**: Visual representation of the stratigraphic profile with colors and symbols according to the International Classification for Seasonal Snow on the Ground (IACS 2009).
- **📁 GeoJSON Export**: Export profiles in standardized GeoJSON format, compatible with GIS systems.
- **🌍 Multi-language Support**: Available in Spanish, Galician, Asturian, Basque, Catalan, Aranese, Andorran, English, French, German, and Italian.
- **📱 Installable as App**: Can be installed on mobile devices as a native application.
- **🧤 Field-Ready Design**: Interface optimized for use with gloves and in adverse conditions.

## 🚀 Installation Guide

### Deploy on Vercel

1. Fork this repository
2. Connect your GitHub account with [Vercel](https://vercel.com)
3. Import the project from your repository
4. Vercel will automatically detect the Vite configuration
5. Click "Deploy"

### Deploy on Netlify

1. Fork this repository
2. Connect your GitHub account with [Netlify](https://netlify.com)
3. Select the repository
4. Configure build command: `npm run build`
5. Configure publish directory: `dist`
6. Click "Deploy site"

### Install as PWA on Mobile

#### Android (Chrome)
1. Open the application in Chrome
2. Tap the menu (⋮) → "Install app" or "Add to Home screen"
3. Confirm the installation

#### iOS (Safari)
1. Open the application in Safari
2. Tap the "Share" button (□↑)
3. Select "Add to Home Screen"
4. Confirm with "Add"

### Local Development

```bash
# Clone the repository
git clone <REPOSITORY_URL>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Technical Specifications

| Technology | Use |
|------------|-----|
| **React 18** | User interface framework |
| **TypeScript** | Static typing and code safety |
| **Vite** | Bundler and development server |
| **Tailwind CSS** | Design system and styling |
| **shadcn/ui** | Accessible UI components |
| **Lucide Icons** | Consistent iconography |
| **vite-plugin-pwa** | PWA functionality and Service Workers |
| **IndexedDB (idb)** | Offline data persistence |
| **LocalStorage** | Preferences storage |
| **proj4** | Coordinate transformation |

### Standards Followed

- **IACS 2009**: International Classification for Seasonal Snow on the Ground
- **WGS84**: Standard GPS coordinate system
- **GeoJSON (RFC 7946)**: Geospatial data interchange format

## ⚠️ Disclaimer

> **WARNING**: This application is a support tool for snow data collection. **It does NOT replace professional training, mountain experience, or expert judgment** in avalanche risk assessment.
>
> The use of this application in mountain terrain is done under the sole responsibility of the user. The developers are not responsible for accidents, injuries, or damages resulting from the use of this tool or decisions made based on the recorded data.
>
> **Before entering snow-covered terrain, ensure you have adequate training, necessary safety equipment (transceiver, probe, shovel), and always consult official avalanche danger bulletins.**

## 🔗 References and Training Resources

- [AEMET - Avalanche Forecast](https://www.aemet.es) - Spanish Meteorological Agency
- [RecMountain](https://recmountain.com) - Mountain safety training
- [Alurte](https://alurte.com) - Nivology and rescue courses
- [ACNA](https://acna.es) - Association for Snow and Avalanche Knowledge
- [Lauegi Report](https://lauegi.report) - Pyrenees avalanche danger bulletins
- [Montaña Segura](https://montanasegura.com) - Mountain accident prevention

## ✒️ Authorship & Credits
This MVP was conceptualized and developed by Iván de Vicente Sánchez, utilizing Vibe Coding methodologies and the Lovable tool.

If you use this code for learning, improvement, or non-commercial purposes, please keep this attribution visible.

## ⚠️ Commercial & Usage License
This software is licensed under the Polyform Noncommercial 1.0.0 license.

Permitted Use: Personal, educational, research, and proof-of-concept.

Prohibited Use: Commercial exploitation, sale, or use in profit-making production environments is strictly prohibited without the express consent of the author.

Interested in commercial use? If you would like to implement this solution in your company or monetize it, let's talk: 📧 sanidevix@gmail.com

## 💖 Acknowledgements

To **Luis, Álvaro, and Alberto Pantoja**, for their tireless work, their teachings, and the motivation they transmit to all of us who love the mountains and snow.

To **Jonay**, for his unwavering friendship and companionship in so many adventures.

---

## 🔄 Reproducibility (Master Prompt - English)

<details>
<summary><strong>Click to expand the complete Master Prompt</strong></summary>

```
MASTER PROMPT - SNOWSTRAT FIELD

Create a Progressive Web Application (PWA) for field snow data collection with the following specifications:

=== IDENTITY ===
- Name: "SnowStrat Field"
- Subtitle: "Snow stratigraphic profiles"
- Logo: Stylized snowflake icon

=== TECHNOLOGIES ===
- React 18 with TypeScript
- Vite as bundler
- Tailwind CSS for styling
- shadcn/ui for components
- Lucide Icons for iconography
- vite-plugin-pwa for offline functionality
- IndexedDB (idb library) for persistence
- proj4 for coordinate transformation

=== MAIN FEATURES ===

1. PROFILE MANAGEMENT:
   - Create new stratigraphic profiles
   - Each profile includes: name, date/time, GPS coordinates (WGS84), orientation, inclination, altitude
   - Store multiple profiles in IndexedDB
   - Export individual or multiple profiles in GeoJSON format

2. LAYER (SAMPLE) RECORDING:
   - Layer height (cm)
   - Grain type according to IACS classification: PP, DF, RG, FC, DH, SH, MF, IF, Ice
   - Grain size (mm): range 0.1 - 5.0
   - Hardness: Fist (F), 4 fingers (4F), 1 finger (1F), Pencil (P), Knife (K), Ice (I)
   - Wetness: Dry, Slightly moist, Moist, Wet, Very wet
   - Temperature (°C): negative values with decimals, stepper controls ±0.1

3. GRAPHIC VISUALIZATION:
   - Vertical representation of stratigraphic profile
   - Height scale in cm
   - Colors by grain type (IACS standard):
     * PP (Precipitation particles): Light blue (#87CEEB)
     * DF (Decomposing particles): Green (#90EE90)
     * RG (Rounded grains): Dark green (#228B22)
     * FC (Faceted crystals): Yellow (#FFD700)
     * DH (Depth hoar): Orange (#FFA500)
     * SH (Surface hoar): Pink (#FF69B4)
     * MF (Melt forms): Red (#DC143C)
     * IF (Ice formations): Gray (#808080)
   - Hardness symbols represented with proportional horizontal bars

4. GEOLOCATION:
   - Automatic GPS coordinate capture
   - WGS84 format (latitude, longitude)
   - Altitude when available
   - Show reading accuracy
   - Button to refresh location

5. USER INTERFACE:
   - Header with logo, name, and language selector
   - Responsive design (mobile-first)
   - Large buttons for use with gloves
   - High contrast for outdoor visibility
   - Light/dark theme
   - Tab navigation: Form | Table | Chart

6. SAMPLES TABLE:
   - List of all recorded layers
   - Columns: No., Height, Accumulated, Grain, Size, Hardness, Wetness, Temp
   - Actions: edit, delete, reorder (drag & drop)
   - Accumulated height calculated automatically

7. EXPORT:
   - GeoJSON format with structure:
     * type: "FeatureCollection"
     * features: array of profiles
     * Each profile as Feature with geometry (Point) and properties
     * Properties include: name, date, samples[], metadata
   - Filename: snowstrat_[name]_[date].geojson

8. INTERNATIONALIZATION (i18n):
   - Languages: Spanish, Galician, Asturian, Basque, Catalan, Aranese, Andorran, English, French, German, Italian
   - Translation system with React context
   - Language selector with flags in header
   - Language preference persistence

9. PWA:
   - Service Worker for offline operation
   - Manifest with icons for installation
   - Cache-first strategy for assets
   - Sync when connection available

=== FILE STRUCTURE ===
src/
├── components/
│   ├── ProfileApp.tsx (main component)
│   ├── ProfileHeader.tsx (header)
│   ├── ProfileManager.tsx (profile management)
│   ├── SampleForm.tsx (layer form)
│   ├── SampleTable.tsx (samples table)
│   ├── StratigraphicChart.tsx (chart)
│   ├── LanguageSelector.tsx
│   └── Documentation.tsx
├── i18n/
│   ├── context.tsx (translations provider)
│   ├── types.ts (TypeScript types)
│   └── translations/ (language files)
├── hooks/
│   ├── useGeolocation.ts
│   └── useCurrentTime.ts
├── lib/
│   └── db.ts (IndexedDB)
└── pages/
    └── Index.tsx

=== STANDARDS ===
- IACS 2009 for snow classification
- WGS84 for coordinates
- GeoJSON RFC 7946 for export
- WCAG 2.1 AA for accessibility

=== DISCLAIMER ===
Include clear warning that the app does not replace professional training or expert judgment in avalanche risk assessment.
```

</details>

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❄️ for the snow community
</p>
