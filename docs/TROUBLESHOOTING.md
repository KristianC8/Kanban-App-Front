# Guía de Solución de Problemas

Esta guía te ayudará a resolver los problemas más comunes que puedes encontrar al trabajar con la aplicación Kanban.

## Tabla de Contenidos

- [Problemas de Instalación](#problemas-de-instalación)
- [Problemas de Desarrollo](#problemas-de-desarrollo)
- [Problemas de Conexión con el Backend](#problemas-de-conexión-con-el-backend)
- [Problemas de Build](#problemas-de-build)
- [Problemas de Despliegue](#problemas-de-despliegue)
- [Problemas de Rendimiento](#problemas-de-rendimiento)
- [Problemas Comunes de React](#problemas-comunes-de-react)

## Problemas de Instalación

### Error: `npm install` falla

**Síntomas:**

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Soluciones:**

1. **Limpiar caché de npm:**

```bash
npm cache clean --force
```

2. **Eliminar node_modules y reinstalar:**

```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Usar la flag --legacy-peer-deps:**

```bash
npm install --legacy-peer-deps
```

4. **Verificar la versión de Node.js:**

```bash
node --version
```

Asegúrate de usar Node.js 16.x o superior.

### Error: Permisos denegados (Linux/Mac)

**Síntomas:**

```
EACCES: permission denied
```

**Solución:**

No uses `sudo` con npm. En su lugar, configura npm para usar un directorio diferente:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Problemas de Desarrollo

### El servidor de desarrollo no inicia

**Síntomas:**

```
Error: Cannot find module 'vite'
```

**Soluciones:**

1. **Reinstalar dependencias:**

```bash
npm install
```

2. **Verificar que el puerto no esté en uso:**

```bash
# Linux/Mac
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

3. **Cambiar el puerto en vite.config.js:**

```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Hot Module Replacement (HMR) no funciona

**Síntomas:**
Los cambios en el código no se reflejan automáticamente en el navegador.

**Soluciones:**

1. **Verificar la configuración de Vite:**

```javascript
export default defineConfig({
  server: {
    hmr: {
      overlay: true
    }
  }
})
```

2. **Reiniciar el servidor de desarrollo:**

```bash
# Ctrl+C para detener
npm run dev
```

3. **Limpiar caché del navegador:**

- Abre DevTools (F12)
- Click derecho en el botón de recargar
- Selecciona "Vaciar caché y recargar de forma forzada"

### Errores de JavaScript

**Síntomas:**

```
SyntaxError: Unexpected token
ReferenceError: variable is not defined
```

**Soluciones:**

1. **Verificar la sintaxis del código:**
   Revisa que no falten llaves, paréntesis o puntos y coma.

2. **Verificar imports:**

```javascript
// ❌ Incorrecto
import Component from './Component'

// ✅ Correcto
import Component from './Component.jsx'
```

3. **Reiniciar el servidor de desarrollo:**

```bash
# Ctrl+C para detener
npm run dev
```

4. **Ejecutar el linter:**

```bash
npm run lint
```

## Problemas de Conexión con el Backend

### Error: CORS Policy

**Síntomas:**

```
Access to fetch at 'http://localhost:8080/api/tasks' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**Soluciones:**

1. **Configurar proxy en vite.config.js:**

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/kanban-app': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

2. **Configurar CORS en el backend (Spring Boot):**

```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class TaskController {
    // ...
}
```

### Error: Network Request Failed

**Síntomas:**

```
TypeError: Failed to fetch
```

**Soluciones:**

1. **Verificar que el backend esté corriendo:**

```bash
curl http://localhost:8080/api/health
```

2. **Verificar la URL del API en .env:**

```env
VITE_API_URL=http://localhost:8080/api
```

3. **Verificar la configuración del helper HTTP:**

```javascript
const API_URL = import.meta.env.VITE_API_URL
console.log('API URL:', API_URL) // Debug
```

### Timeout en las peticiones

**Síntomas:**
Las peticiones tardan mucho y eventualmente fallan.

**Soluciones:**

1. **Ajustar el timeout en el helper HTTP:**

El helper `helpHTTP.js` ya tiene un timeout de 10 segundos configurado. Si necesitas aumentarlo:

```javascript
// En helpers/helpHTTP.js
setTimeout(() => controller.abort(), 15000) // 15 segundos
```

2. **Verificar el rendimiento del backend:**
   Revisa los logs del backend para identificar consultas lentas.

## Problemas de Build

### Error: Build falla con errores de ESLint

**Síntomas:**

```
Error: 'variable' is assigned a value but never used
```

**Soluciones:**

1. **Corregir los errores de linting:**
   El build de producción ejecuta el linter.

2. **Ejecutar el linter:**

```bash
npm run lint
```

3. **Verificar la configuración de ESLint:**
   Revisa `eslint.config.js` para ajustar las reglas si es necesario.

### Error: Out of Memory

**Síntomas:**

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
```

**Soluciones:**

1. **Aumentar el límite de memoria de Node.js:**

```bash
# Linux/Mac
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Windows
set NODE_OPTIONS=--max-old-space-size=4096 && npm run build
```

2. **Agregar al package.json:**

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

### Assets no se cargan después del build

**Síntomas:**
Imágenes o archivos CSS no se cargan en producción.

**Soluciones:**

1. **Verificar las rutas de los assets:**

```javascript
// ❌ Incorrecto
;<img src='/src/assets/logo.png' />

// ✅ Correcto
import logo from './assets/logo.png'
;<img src={logo} />
```

2. **Configurar la base URL en vite.config.js:**

```javascript
export default defineConfig({
  base: './' // Para rutas relativas
})
```

## Problemas de Despliegue

### Error 404 en rutas de React Router

**Síntomas:**
Al recargar la página en una ruta diferente a `/`, obtienes un error 404.

**Soluciones:**

1. **Netlify - Crear \_redirects:**

```
/*    /index.html   200
```

2. **Vercel - Crear vercel.json:**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

3. **Nginx - Configurar try_files:**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Variables de entorno no funcionan en producción

**Síntomas:**
`import.meta.env.VITE_API_URL` es `undefined` en producción.

**Soluciones:**

1. **Verificar el prefijo VITE\_:**
   Solo las variables que empiezan con `VITE_` están disponibles en el cliente.

2. **Configurar en la plataforma de despliegue:**

- Vercel: Settings → Environment Variables
- Netlify: Site settings → Build & deploy → Environment

3. **Reconstruir después de agregar variables:**
   Las variables de entorno se inyectan en tiempo de build.

## Problemas de Rendimiento

### La aplicación es lenta

**Soluciones:**

1. **Usar React DevTools Profiler:**
   Identifica componentes que se renderizan innecesariamente.

2. **Implementar memoización:**

```javascript
const MemoizedComponent = React.memo(Component)
```

3. **Lazy loading de componentes:**

```javascript
const TaskBoard = lazy(() => import('./components/TaskBoard'))
```

4. **Optimizar imágenes:**
   Usa formatos modernos como WebP y lazy loading.

### Muchas re-renderizaciones

**Soluciones:**

1. **Usar useCallback para funciones:**

```javascript
const handleClick = useCallback(() => {
  // ...
}, [dependencies])
```

2. **Usar useMemo para cálculos costosos:**

```javascript
const filteredTasks = useMemo(() => {
  return tasks.filter((task) => task.status === 'active')
}, [tasks])
```

## Problemas Comunes de React

### Warning: Can't perform a React state update on an unmounted component

**Soluciones:**

```javascript
useEffect(() => {
  let isMounted = true

  fetchData().then((data) => {
    if (isMounted) {
      setData(data)
    }
  })

  return () => {
    isMounted = false
  }
}, [])
```

### Warning: Each child in a list should have a unique "key" prop

**Soluciones:**

```javascript
// ❌ Incorrecto
{
  tasks.map((task, index) => <Task key={index} {...task} />)
}

// ✅ Correcto
{
  tasks.map((task) => <Task key={task.id} {...task} />)
}
```

## Obtener Ayuda Adicional

Si ninguna de estas soluciones funciona:

1. **Revisa los logs completos:**

   - Consola del navegador (F12)
   - Terminal donde corre el servidor
   - Logs del backend

2. **Busca en GitHub Issues:**
   Revisa si alguien más ha reportado el problema.

3. **Crea un Issue:**
   Incluye:

   - Descripción del problema
   - Pasos para reproducir
   - Versión de Node.js y npm
   - Sistema operativo
   - Logs de error completos

4. **Consulta la documentación:**
   - [Documentación de Vite](https://vitejs.dev)
   - [Documentación de React](https://react.dev)
   - [Documentación de Zustand](https://zustand-demo.pmnd.rs/)

## Herramientas de Diagnóstico

### Verificar el estado del sistema

```bash
# Versiones
node --version
npm --version

# Información del sistema
npm doctor

# Verificar dependencias
npm list --depth=0

# Verificar vulnerabilidades
npm audit
```

### Logs de depuración

```bash
# Ejecutar con logs detallados
npm run dev --verbose

# Build con información de debug
npm run build -- --debug
```
