# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto Kanban App! Esta guía te ayudará a entender cómo puedes participar en el desarrollo de este proyecto.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Proceso de Contribución](#proceso-de-contribución)
- [Estándares de Código](#estándares-de-código)
- [Guía de Commits](#guía-de-commits)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## Código de Conducta

Este proyecto se adhiere a un código de conducta que todos los contribuidores deben seguir:

- **Sé respetuoso**: Trata a todos con respeto y consideración
- **Sé colaborativo**: Trabaja en equipo y ayuda a otros
- **Sé constructivo**: Proporciona feedback constructivo y acepta críticas
- **Sé inclusivo**: Da la bienvenida a personas de todos los orígenes

## ¿Cómo Puedo Contribuir?

Hay muchas formas de contribuir al proyecto:

### 🐛 Reportar Bugs

Si encuentras un error, por favor crea un issue con:

- Descripción clara del problema
- Pasos para reproducir el error
- Comportamiento esperado vs. comportamiento actual
- Screenshots si es aplicable
- Información del entorno (navegador, OS, etc.)

### 💡 Sugerir Mejoras

¿Tienes una idea para mejorar la aplicación? Crea un issue describiendo:

- El problema que resuelve tu sugerencia
- Cómo funcionaría la mejora
- Ejemplos de uso si es posible

### 🔧 Contribuir con Código

- Corregir bugs reportados
- Implementar nuevas características
- Mejorar la documentación
- Optimizar el rendimiento
- Escribir tests

### 📝 Mejorar la Documentación

- Corregir errores tipográficos
- Agregar ejemplos
- Mejorar explicaciones
- Traducir documentación

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js 16.x o superior
- npm o yarn
- Git
- Editor de código (recomendado: VS Code)

### Instalación

1. **Fork el repositorio**

   Haz click en el botón "Fork" en la parte superior derecha de la página del repositorio.

2. **Clona tu fork**

   ```bash
   git clone https://github.com/TU_USUARIO/kanban-app-front.git
   cd kanban-app-front
   ```

3. **Agrega el repositorio original como upstream**

   ```bash
   git remote add upstream https://github.com/USUARIO_ORIGINAL/kanban-app-front.git
   ```

4. **Instala las dependencias**

   ```bash
   npm install
   ```

5. **Configura las variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Edita el archivo `.env` con la configuración necesaria.

6. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

### Extensiones Recomendadas para VS Code

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag

## Proceso de Contribución

### 1. Crea una Rama

Siempre crea una nueva rama para tu trabajo:

```bash
git checkout -b tipo/descripcion-breve
```

Tipos de ramas:

- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bugs
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `test/` - Agregar o modificar tests
- `style/` - Cambios de formato (no afectan la lógica)

Ejemplos:

```bash
git checkout -b feature/drag-and-drop-tasks
git checkout -b fix/task-deletion-error
git checkout -b docs/update-readme
```

### 2. Realiza tus Cambios

- Escribe código limpio y legible
- Sigue los estándares de código del proyecto
- Agrega comentarios cuando sea necesario
- Escribe tests para nuevas funcionalidades

### 3. Prueba tus Cambios

Antes de hacer commit, asegúrate de que:

```bash
# El código pasa el linter
npm run lint

# No hay errores de TypeScript
npm run type-check

# La aplicación se construye correctamente
npm run build

# Los tests pasan (si existen)
npm run test
```

### 4. Haz Commit de tus Cambios

Sigue la [guía de commits](#guía-de-commits) para escribir mensajes claros.

```bash
git add .
git commit -m "feat: agregar funcionalidad de drag and drop"
```

### 5. Mantén tu Rama Actualizada

Antes de crear un Pull Request, sincroniza con la rama principal:

```bash
git fetch upstream
git rebase upstream/main
```

Si hay conflictos, resuélvelos y continúa:

```bash
git add .
git rebase --continue
```

### 6. Push a tu Fork

```bash
git push origin tu-rama
```

### 7. Crea un Pull Request

Ve a GitHub y crea un Pull Request desde tu rama hacia la rama `main` del repositorio original.

## Estándares de Código

### JavaScript

- Usa JavaScript ES6+ para todo el código
- Preferir `const` sobre `let`, evitar `var`
- Usa arrow functions cuando sea apropiado
- Destructuring cuando mejore la legibilidad
- Nombres descriptivos para variables y funciones
- Documenta parámetros complejos con JSDoc cuando sea necesario

```javascript
// ✅ Bueno
const handleTaskUpdate = async (taskId, updates) => {
  const { title, description } = updates
  // ...
}

// ❌ Evitar
var updateTask = function (id, data) {
  var t = data.title
  // ...
}
```

### React

- Componentes funcionales con hooks
- Un componente por archivo
- Props bien documentadas con JSDoc si son complejas
- Usa `React.memo` para optimización cuando sea necesario
- Exporta componentes usando export default o named exports según convenga

```javascript
// ✅ Bueno
/**
 * @param {Object} props
 * @param {Object} props.task - Objeto de tarea
 * @param {Function} props.onUpdate - Callback para actualizar
 * @param {Function} props.onDelete - Callback para eliminar
 */
const TaskCard = ({ task, onUpdate, onDelete }) => {
  // ...
}

export default TaskCard
```

### Estilos

- Usa Tailwind CSS para estilos
- Clases ordenadas: layout → spacing → sizing → colors → typography
- Extrae clases repetidas a componentes

```tsx
// ✅ Bueno
<div className='flex items-center justify-between p-4 bg-white rounded-lg shadow-md'>
  <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
</div>
```

### Nombres de Archivos

- Componentes: `PascalCase.jsx` (ej: `TaskCard.jsx`)
- Hooks: `camelCase.js` (ej: `useTasks.js`)
- Utilidades: `camelCase.js` (ej: `formatDate.js`)
- Helpers: `camelCase.js` con prefijo `help` (ej: `helpHTTP.js`)
- Stores: `camelCase.js` (ej: `tasks.js`)

### Estructura de Carpetas

```
src/
├── api/              # Configuración de endpoints
├── assets/           # Recursos estáticos
├── components/       # Componentes reutilizables
│   ├── icons/       # Componentes de iconos
│   ├── TaskCard.jsx
│   └── ...
├── context/          # Context API providers
├── helpers/          # Funciones auxiliares
├── hooks/            # Custom hooks
├── Layouts/          # Componentes de layout
├── pages/            # Componentes de páginas
├── routes/           # Configuración de rutas
├── store/            # Stores de Zustand
└── index.css         # Estilos globales
```

## Guía de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit claros y consistentes.

### Formato

```
<tipo>[alcance opcional]: <descripción>

[cuerpo opcional]

[footer(s) opcional(es)]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, punto y coma, etc.)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento
- `ci`: Cambios en CI/CD

### Ejemplos

```bash
# Nueva funcionalidad
git commit -m "feat: agregar filtro de tareas por estado"

# Corrección de bug
git commit -m "fix: corregir error al eliminar tarea"

# Documentación
git commit -m "docs: actualizar guía de instalación"

# Con alcance
git commit -m "feat(tasks): implementar drag and drop"

# Con cuerpo
git commit -m "fix: corregir error de validación

El formulario no validaba correctamente los campos vacíos.
Ahora muestra mensajes de error apropiados."

# Breaking change
git commit -m "feat!: cambiar estructura de datos de tareas

BREAKING CHANGE: La estructura de Task ahora requiere el campo 'priority'"
```

## Proceso de Pull Request

### Antes de Crear el PR

- [ ] El código pasa todos los linters
- [ ] No hay errores de TypeScript
- [ ] La aplicación se construye sin errores
- [ ] Has probado tus cambios manualmente
- [ ] Has actualizado la documentación si es necesario
- [ ] Tu rama está actualizada con `main`

### Descripción del PR

Usa esta plantilla para describir tu Pull Request:

```markdown
## Descripción

Breve descripción de los cambios realizados.

## Tipo de Cambio

- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione como antes)
- [ ] Documentación

## ¿Cómo se ha probado?

Describe las pruebas que realizaste.

## Checklist

- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas difíciles de entender
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban que mi fix es efectivo o que mi feature funciona

## Screenshots (si aplica)

Agrega screenshots para cambios visuales.

## Issues Relacionados

Fixes #123
```

### Revisión del Código

- Responde a los comentarios de manera constructiva
- Realiza los cambios solicitados
- Marca las conversaciones como resueltas cuando hayas hecho los cambios
- Sé paciente durante el proceso de revisión

### Después de la Aprobación

Una vez que tu PR sea aprobado:

1. Se hará merge a la rama principal
2. Puedes eliminar tu rama
3. Actualiza tu fork local

```bash
git checkout main
git pull upstream main
git push origin main
```

## Reportar Bugs

### Antes de Reportar

- Verifica que el bug no haya sido reportado ya
- Asegúrate de estar usando la última versión
- Intenta reproducir el bug en un entorno limpio

### Plantilla de Reporte de Bug

```markdown
**Descripción del Bug**
Descripción clara y concisa del bug.

**Pasos para Reproducir**

1. Ve a '...'
2. Haz click en '...'
3. Scroll hasta '...'
4. Observa el error

**Comportamiento Esperado**
Descripción de lo que esperabas que sucediera.

**Screenshots**
Si es aplicable, agrega screenshots.

**Entorno:**

- OS: [ej: Windows 10]
- Navegador: [ej: Chrome 120]
- Versión: [ej: 1.0.0]

**Contexto Adicional**
Cualquier otra información relevante.
```

## Sugerir Mejoras

### Plantilla de Sugerencia

```markdown
**¿Tu sugerencia está relacionada con un problema?**
Descripción clara del problema. Ej: Siempre me frustra cuando [...]

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda.

**Describe alternativas que has considerado**
Descripción de soluciones o características alternativas.

**Contexto Adicional**
Cualquier otra información, screenshots o ejemplos.
```

## Preguntas o Ayuda

Si tienes preguntas o necesitas ayuda:

- Revisa la [documentación](./docs/)
- Busca en los [issues existentes](https://github.com/usuario/kanban-app-front/issues)
- Crea un nuevo issue con la etiqueta `question`
- Contacta a los mantenedores

## Reconocimientos

Todos los contribuidores serán reconocidos en el proyecto. ¡Gracias por tu tiempo y esfuerzo!

---

**¡Gracias por contribuir al Kanban App! 🎉**
