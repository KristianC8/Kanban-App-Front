# Guía de Despliegue

Esta guía describe los pasos necesarios para desplegar la aplicación Kanban en diferentes entornos.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Variables de Entorno](#variables-de-entorno)
- [Construcción para Producción](#construcción-para-producción)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Despliegue en Netlify](#despliegue-en-netlify)
- [Despliegue en GitHub Pages](#despliegue-en-github-pages)
- [Despliegue con Docker](#despliegue-con-docker)
- [Configuración del Backend](#configuración-del-backend)

## Requisitos Previos

Antes de desplegar la aplicación, asegúrate de tener:

- Node.js 16.x o superior instalado
- npm o yarn como gestor de paquetes
- Acceso al backend de la aplicación (Java Spring Boot)
- Cuenta en la plataforma de despliegue elegida

## Variables de Entorno

Crea un archivo `.env.production` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=https://tu-backend-url.com
```

> [!IMPORTANT]
> Nunca incluyas archivos `.env` en el control de versiones. Asegúrate de que estén listados en `.gitignore`.

## Construcción para Producción

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar el Build

```bash
npm run build
```

Este comando:

- Compila el código JavaScript
- Optimiza los assets
- Genera el bundle de producción en la carpeta `dist/`
- Minimiza el código JavaScript y CSS

### 3. Previsualizar el Build

Para verificar que el build funciona correctamente:

```bash
npm run preview
```

Esto iniciará un servidor local que sirve la versión de producción.

## Despliegue en Vercel

Vercel es una excelente opción para aplicaciones React con Vite.

### Despliegue Automático (Recomendado)

1. Instala Vercel CLI:

```bash
npm install -g vercel
```

2. Inicia sesión en Vercel:

```bash
vercel login
```

3. Despliega la aplicación:

```bash
vercel
```

4. Para producción:

```bash
vercel --prod
```

### Despliegue desde GitHub

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Vercel detectará automáticamente que es un proyecto Vite
4. Cada push a la rama principal desplegará automáticamente

**Configuración de Build:**

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Variables de Entorno en Vercel:**

- Ve a Settings → Environment Variables
- Agrega `VITE_API_URL` con la URL de tu backend

## Despliegue en Netlify

### Usando Netlify CLI

1. Instala Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Inicia sesión:

```bash
netlify login
```

3. Inicializa el sitio:

```bash
netlify init
```

4. Despliega:

```bash
netlify deploy --prod
```

### Usando la Interfaz Web

1. Conecta tu repositorio de GitHub a Netlify
2. Configura los ajustes de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Agrega las variables de entorno
4. Haz clic en "Deploy site"

### Archivo de Configuración

Crea un archivo `netlify.toml` en la raíz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Despliegue en GitHub Pages

### 1. Instalar gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Configurar vite.config.js

Agrega la base URL:

```javascript
export default defineConfig({
  base: '/nombre-del-repositorio/',
  plugins: [react()]
})
```

### 3. Agregar Scripts

En `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 4. Desplegar

```bash
npm run deploy
```

### 5. Configurar GitHub

1. Ve a Settings → Pages en tu repositorio
2. Selecciona la rama `gh-pages` como fuente
3. Guarda los cambios

## Despliegue con Docker

### Dockerfile

Crea un `Dockerfile` en la raíz:

```dockerfile
# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Crea un archivo `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caché para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Construir y Ejecutar

```bash
# Construir la imagen
docker build -t kanban-app .

# Ejecutar el contenedor
docker run -p 8080:80 kanban-app
```

### Docker Compose

Crea un `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - '3000:80'
    environment:
      - VITE_API_URL=http://backend:8080
    depends_on:
      - backend
    networks:
      - kanban-network

  backend:
    image: tu-backend-image:latest
    ports:
      - '8080:8080'
    networks:
      - kanban-network

networks:
  kanban-network:
    driver: bridge
```

Ejecutar:

```bash
docker-compose up -d
```

## Configuración del Backend

### CORS

Asegúrate de que el backend (Spring Boot) permita peticiones desde el dominio del frontend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/kanban-app/**")
                    .allowedOrigins("https://tu-frontend-url.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Variables de Entorno del Backend

Configura la URL del backend en las variables de entorno de tu plataforma de despliegue.

## Optimizaciones Post-Despliegue

### 1. Habilitar Compresión

La mayoría de las plataformas modernas habilitan gzip/brotli automáticamente.

### 2. CDN

Considera usar un CDN para servir assets estáticos más rápido:

- Cloudflare
- AWS CloudFront
- Vercel Edge Network (incluido)

### 3. Monitoreo

Implementa herramientas de monitoreo:

- Google Analytics
- Sentry para tracking de errores
- Vercel Analytics

### 4. SSL/HTTPS

Asegúrate de que tu aplicación se sirva sobre HTTPS. La mayoría de las plataformas modernas lo proporcionan automáticamente.

## Verificación Post-Despliegue

Después del despliegue, verifica:

- ✅ La aplicación carga correctamente
- ✅ Las rutas funcionan (no hay errores 404)
- ✅ La conexión con el backend funciona
- ✅ Las variables de entorno están configuradas
- ✅ Los assets se cargan correctamente
- ✅ La aplicación es responsive en diferentes dispositivos
- ✅ No hay errores en la consola del navegador

## Rollback

Si necesitas revertir un despliegue:

### Vercel

```bash
vercel rollback
```

### Netlify

Usa el dashboard web para seleccionar un despliegue anterior.

### Docker

```bash
docker pull tu-imagen:version-anterior
docker-compose up -d
```

## Soporte

Si encuentras problemas durante el despliegue, consulta:

- [Guía de Solución de Problemas](./TROUBLESHOOTING.md)
- Issues del repositorio
- Documentación de la plataforma de despliegue
