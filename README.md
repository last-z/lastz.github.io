# 🗻 Canyon Clash Strategic Planner

Una herramienta web interactiva para planificar y coordinar estrategias de batalla en el juego competitivo **Canyon Clash**.

## Características Principales

### 🗺️ Explorador de Mapa
- **Mapa SVG interactivo** - Visualiza el mapa completo de Canyon Clash
- **Navegación por viewport** - Arrastra la ventana de visualización o usa las teclas de flecha
- **Entrada de letra** - Presiona A, B, C, D para marcar equipos rápidamente
- **Coordenadas en tiempo real** - Ve las coordenadas exactas mientras navegas

### ⏱️ Línea de Tiempo de Batalla
- **Slider de 0-40 minutos** - Controla la progresión de la batalla
- **Marcadores de fases** - Visualiza eventos importantes de la batalla

### 👥 Coordinación de Equipos
- **4 Equipos codificados por color** - A, B, C, D
- **Sliders de tiempo de ataque** - Configura cuándo cada equipo ataca
- **Soporte para diferentes posiciones de spawn** - Blue Down o Red Up

### 📍 Marcadores Estratégicos
- **Haz clic en el mapa** - Marca posiciones de equipo con coordenadas y tiempo
- **Lista de marcadores** - Ve todos tus marcadores con opción de eliminar
- **Timestamps automáticos** - Cada marcador registra el tiempo actual

### 🎯 Planes ROLS (Admin Panel)
- **Crear planes preconfigurados** - Guarda tus estrategias favoritas
- **Biblioteca de estrategias** - Gestiona múltiples configuraciones
- **Reproductor de planes** - Carga cualquier plan con un clic
- **Importar/Exportar** - Comparte planes con tu equipo como archivos JSON
- **Almacenamiento local** - Tus planes se guardan automáticamente en el navegador

## Estructura del Proyecto

```
src/
├── pages/
│   ├── PlannerPage.js          # Main planner interface
│   └── PlannerPage.css         # Planner styling
├── components/
│   └── ROLSPlans/
│       ├── ROLSPlans.js        # Admin panel for strategies
│       └── ROLSPlans.css       # Admin panel styling
├── locales/                     # i18n translations (8 languages)
├── utils/
│   └── githubIntegration.js    # Optional GitHub integration helpers
├── routes.js                    # Route configuration
├── App.js                       # Root component
├── i18n.js                      # i18n configuration
└── index.js                     # Entry point
```

## Idiomas Soportados

- 🇺🇸 English
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇨🇳 简体中文
- 🇹🇼 繁體中文

## Comenzar

### Requisitos Previos
- Node.js 14+
- npm o yarn
- Guarda nombres y descripciones de planes
- Configura posiciones de spawn (Azul/Rojo)
- Define tiempos de ataque para cada equipo
- Exporta planes completos como respaldo
- Importa planes compartidos por compañeros
- Sin límite de planes

## Instalación y Uso

### Requisitos
- Node.js 14+
- npm 6+

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/lastz/canyon-clash-planner.git
cd canyon-clash-planner

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Crear build de producción
npm run build
```

## Guía de Uso

### Navegación Básica
1. **Arrastra el viewport** gris sobre el mapa para explorar
2. **Teclas de flecha** para movimiento fino (10px por paso)
3. **Presiona A/B/C/D** para cambiar equipos rápidamente

### Planificación Estratégica
1. Selecciona un equipo con los botones de color
2. Ajusta la línea de tiempo principal (slider 0-20m)
3. Haz clic en el mapa para marcar la posición del equipo
4. Ajusta tiempos de ataque en el panel derecho
5. Exporta como PNG para compartir

### Usar Planes ROLS
1. **Crear un plan**: Click en "⚙️ ROLS Plans" → Rellena los detalles → "Guardar Plan"
2. **Usar un plan**: "⚙️ ROLS Plans" → Click "▶ Play" en el plan → ¡Se carga automáticamente!
3. **Compartir planes**: Click "📥 Exportar" → Envía el .json a tu equipo
4. **Importar planes**: Click "📤 Importar" → Selecciona el .json → Listo!

Para detalles completos, ver [QUICK_START.md](QUICK_START.md) y [ROLS_PLANS_GUIDE.md](ROLS_PLANS_GUIDE.md)

## Estructura del Proyecto

```
canyon-clash-planner/
├── public/
│   ├── background.svg
│   ├── demo/
│   └── index.html
├── src/
│   ├── CanyonClashPlanner.js
│   ├── CanyonClashPlanner.css
│   ├── App.js
│   └── ...
└── README.md
```

## Tecnologías

- React 18
- Canvas API
- SVG
- CSS3
- **i18next** - Internacionalización y gestión de idiomas
- **react-i18next** - Integración de i18next con React

### 🌍 Soporte Multilingüe (i18n)
La aplicación ahora soporta 8 idiomas:
- 🇺🇸 English
- 🇨🇳 中文 (Simplified Chinese)
- 🇹🇼 繁體中文 (Traditional Chinese)
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇪🇸 Español
- 🇯🇵 日本語
- 🇰🇷 한국어

**Características i18n:**
- Selector de idioma en la parte superior de la aplicación
- Traducción dinámica de toda la interfaz
- Persistencia de idioma en localStorage
- Fallback automático a inglés si hay datos faltantes

---

**Última actualización:** 2024

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
