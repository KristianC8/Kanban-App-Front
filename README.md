# Kanban App - Frontend

Aplicación web de tablero Kanban diseñada para optimizar la organización y gestión de tareas y proyectos. Permite crear, mover y actualizar tareas en tiempo real con una interfaz intuitiva y moderna.

![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?logo=javascript)
![Vite](https://img.shields.io/badge/Vite-5.4.9-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38bdf8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-5.0.1-443e38)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Backend](#backend)
- [Documentación](#documentación)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## ✨ Características

- 📊 **Tablero Kanban Interactivo**: Visualiza y organiza tus tareas en columnas (Por Hacer, En Progreso, Completado)
- 📁 **Gestión de Proyectos**: Crea y administra múltiples proyectos Kanban
- 🎯 **Gestión de Tareas**: Crea, edita, elimina y mueve tareas entre columnas
- 🖱️ **Drag and Drop**: Arrastra y suelta tareas para cambiarlas de estado
- 🔄 **Actualización en Tiempo Real**: Los cambios se reflejan inmediatamente en la interfaz
- 🎨 **Interfaz Moderna**: Diseño limpio y responsive con Tailwind CSS
- 📱 **Responsive**: Funciona perfectamente en dispositivos móviles, tablets y escritorio
- ⚡ **Rendimiento Optimizado**: Construido con Vite y SWC para una experiencia ultrarrápida
- 🔧 **Gestión de Estado**: Zustand + Context API para un manejo eficiente del estado
- 🌐 **Integración con API REST**: Comunicación fluida con el backend Java Spring Boot

## 🛠️ Tecnologías

Este proyecto está construido con las siguientes tecnologías:

### Core

- **[React 18.3.1](https://react.dev/)** - Biblioteca de JavaScript para construir interfaces de usuario
- **[JavaScript ES6+](https://developer.mozilla.org/es/docs/Web/JavaScript)** - Lenguaje de programación moderno
- **[Vite 5.4.9](https://vitejs.dev/)** - Build tool y dev server de nueva generación
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)** - Plugin de React con compilador SWC ultrarrápido

### Gestión de Estado

- **[Zustand 5.0.1](https://zustand-demo.pmnd.rs/)** - Librería minimalista de gestión de estado
- **Context API** - API nativa de React para compartir estado

### Estilos

- **[Tailwind CSS 3.4.14](https://tailwindcss.com/)** - Framework de CSS basado en utilidades
- **[PostCSS](https://postcss.org/)** - Herramienta para transformar CSS
- **[Autoprefixer](https://autoprefixer.github.io/)** - Plugin de PostCSS para agregar prefijos de navegadores

### Routing

- **[React Router DOM 6.27.0](https://reactrouter.com/)** - Enrutamiento declarativo para React

### HTTP Client

- **Fetch API** - API nativa del navegador para peticiones HTTP

### Linting & Formatting

- **[ESLint](https://eslint.org/)** - Herramienta de análisis de código estático
- **[Prettier](https://prettier.io/)** - Formateador de código

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 16.x o superior
- **npm** 7.x o superior (o **yarn** 1.22.x)
- **Git** para clonar el repositorio

Verifica las versiones instaladas:

```bash
node --version
npm --version
git --version
```

## 🚀 Instalación

Sigue estos pasos para configurar el proyecto localmente:

### 1. Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/kanban-app-front.git
cd kanban-app-front
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
```

> [!IMPORTANT]
> Asegúrate de que el backend Java Spring Boot esté corriendo antes de iniciar el frontend.

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 💻 Uso

### Desarrollo

Para iniciar el servidor de desarrollo con hot-reload:

```bash
npm run dev
```

### Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

### Previsualizar Build de Producción

Para previsualizar la versión de producción localmente:

```bash
npm run preview
```

### Linting

Para ejecutar el linter y verificar el código:

```bash
npm run lint
```

## 📜 Scripts Disponibles

| Script            | Descripción                                                 |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo en `http://localhost:5173` |
| `npm run build`   | Compila la aplicación para producción en la carpeta `dist/` |
| `npm run preview` | Previsualiza la versión de producción localmente            |
| `npm run lint`    | Ejecuta ESLint para verificar el código                     |

## 📁 Estructura del Proyecto

```
kanban-app-front/
├── public/                 # Archivos estáticos públicos
│   └── vite.svg           # Favicon
├── src/                   # Código fuente
│   ├── api/              # Configuración de endpoints
│   │   └── endpoints.js  # Definición de endpoints del backend
│   ├── assets/           # Recursos estáticos (imágenes, etc.)
│   ├── components/       # Componentes reutilizables de React
│   │   ├── icons/       # Componentes de iconos
│   │   ├── CreateProject.jsx
│   │   ├── CreateTask.jsx
│   │   ├── Header.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── TaskCard.jsx
│   │   └── ...
│   ├── context/          # Context API providers
│   │   ├── dragContext.jsx
│   │   ├── projectsContex.jsx
│   │   └── tasksContext.jsx
│   ├── helpers/          # Funciones auxiliares
│   │   ├── helpHTTP.js  # Helper para peticiones HTTP
│   │   └── helpTaskPosition.js
│   ├── hooks/            # Custom hooks de React
│   │   ├── useConfirm.js
│   │   ├── useDragContext.js
│   │   ├── useForm.js
│   │   ├── usePopUp.js
│   │   ├── useProjectsContext.js
│   │   └── useTasksContext.js
│   ├── Layouts/          # Componentes de layout
│   │   └── KanbanAppLayout.jsx
│   ├── pages/            # Componentes de páginas/vistas
│   │   ├── ErrorPage.jsx
│   │   ├── ProjectKanbanPage.jsx
│   │   └── ProjectsPage.jsx
│   ├── routes/           # Configuración de rutas
│   │   └── index.jsx
│   ├── store/            # Stores de Zustand
│   │   ├── BackendAvailability.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── App.jsx           # Componente raíz de la aplicación
│   ├── main.jsx          # Punto de entrada de la aplicación
│   └── index.css         # Estilos globales
├── docs/                  # Documentación adicional
│   ├── ARCHITECTURE.md   # Documentación de arquitectura
│   ├── API.md            # Documentación de integración con API
│   ├── DEPLOYMENT.md     # Guía de despliegue
│   └── TROUBLESHOOTING.md # Solución de problemas
├── .env                  # Variables de entorno (no versionado)
├── .gitignore            # Archivos ignorados por Git
├── eslint.config.js      # Configuración de ESLint
├── index.html            # HTML principal
├── package.json          # Dependencias y scripts
├── postcss.config.js     # Configuración de PostCSS
├── tailwind.config.js    # Configuración de Tailwind CSS
├── vite.config.js        # Configuración de Vite
├── README.md             # Este archivo
├── CONTRIBUTING.md       # Guía de contribución
└── LICENSE               # Licencia del proyecto
```

## 🔧 Backend

Este frontend se comunica con un backend desarrollado en **Java Spring Boot** que proporciona una API REST para la gestión de proyectos y tareas.

### Endpoints Principales

**Proyectos:**

- `GET /kanban-app/proyectos` - Obtener todos los proyectos
- `POST /kanban-app/proyectos` - Crear un nuevo proyecto
- `PUT /kanban-app/proyectos/:id` - Actualizar un proyecto
- `DELETE /kanban-app/proyectos/:id` - Eliminar un proyecto

**Tareas:**

- `GET /kanban-app/proyectos/:id` - Obtener proyecto con sus tareas
- `POST /kanban-app/tareas` - Crear una nueva tarea
- `PUT /kanban-app/tareas/:id` - Actualizar una tarea
- `PATCH /kanban-app/estado/tareas/:id` - Actualizar estado de una tarea
- `POST /kanban-app/mover` - Mover tarea entre estados
- `DELETE /kanban-app/tareas/:id` - Eliminar una tarea

**Health Check:**

- `GET /health` - Verificar disponibilidad del backend

Para más información sobre la integración con la API, consulta la [documentación de API](./docs/API.md).

## 📚 Documentación

La documentación completa del proyecto se encuentra en la carpeta `docs/`:

- **[Arquitectura](./docs/ARCHITECTURE.md)** - Descripción detallada de la arquitectura del frontend
- **[Integración con API](./docs/API.md)** - Documentación de endpoints y comunicación con el backend
- **[Guía de Despliegue](./docs/DEPLOYMENT.md)** - Instrucciones para desplegar en diferentes plataformas
- **[Solución de Problemas](./docs/TROUBLESHOOTING.md)** - Soluciones a problemas comunes

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas contribuir al proyecto, por favor:

1. Lee la [Guía de Contribución](./CONTRIBUTING.md)
2. Haz fork del repositorio
3. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
4. Realiza tus cambios siguiendo los estándares de código
5. Haz commit de tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
6. Push a la rama (`git push origin feature/nueva-funcionalidad`)
7. Abre un Pull Request

### Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor lee la [Guía de Contribución](./CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [React](https://react.dev/) - Por la increíble biblioteca de UI
- [Vite](https://vitejs.dev/) - Por el rápido build tool
- [Tailwind CSS](https://tailwindcss.com/) - Por el framework de CSS
- [Zustand](https://zustand-demo.pmnd.rs/) - Por la gestión de estado simple y efectiva

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en:

- Abrir un [Issue](https://github.com/TU_USUARIO/kanban-app-front/issues)
- Crear un [Pull Request](https://github.com/TU_USUARIO/kanban-app-front/pulls)

---

**Desarrollado con ❤️ usando React y JavaScript**
