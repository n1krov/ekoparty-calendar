# Spec 04: Pipeline CI/CD para Despliegue en GitHub Pages

## 1. Propósito y Alcance
Esta especificación define el flujo de Integración y Entrega Continua (CI/CD) para automatizar la compilación estática y el despliegue de la aplicación de agenda Ekoparty 2026 en **GitHub Pages** mediante **GitHub Actions**.

---

## 2. Requerimientos y Entorno de Ejecución

### 2.1 Requerimientos Funcionales
- Disparar el pipeline automáticamente ante cada `push` a la rama principal (`master` o `main`).
- Permitir ejecución manual mediante `workflow_dispatch`.
- Validar tipos estáticos con TypeScript (`svelte-check` / `tsc`) antes de construir.
- Compilar la aplicación estática de Svelte en el directorio `dist/`.
- Desplegar el contenido de `dist/` en GitHub Pages sin requerir ramas intermedias (`gh-pages`), utilizando la API nativa de GitHub Pages Artifacts.

### 2.2 Configuración del Repositorio en GitHub
En la configuración del repositorio (**Settings > Pages**):
- **Source:** `GitHub Actions`.

### 2.3 Manejo de Rutas Base (`base path`)
- GitHub Pages despliega típicamente bajo un subdirectorio con el nombre del repositorio: `https://<usuario>.github.io/<nombre-repo>/`.
- Para evitar problemas de carga de scripts y estilos con rutas absolutas `/assets/...`, la configuración de [`vite.config.ts`](../../vite.config.ts) ya utiliza:
  ```typescript
  base: './'
  ```
- Esto garantiza que los assets se resuelvan de forma relativa tanto en entornos locales, subdirectorios de GitHub Pages o dominios personalizados (`CNAME`).

---

## 3. Arquitectura del Workflow de GitHub Actions

### 3.1 Permisos de Seguridad
El pipeline requiere permisos mínimos conforme a las buenas prácticas de seguridad:
- `contents: read`: para clonar el repositorio.
- `pages: write`: para publicar en el entorno de GitHub Pages.
- `id-token: write`: para autenticación OIDC segura con GitHub Pages.

### 3.2 Manejo de Concurrencia
Se configura un grupo de concurrencia para evitar despliegues simultáneos que colisionen:
```yaml
concurrency:
  group: 'pages'
  cancel-in-progress: false
```

### 3.3 Estructura de Jobs

El workflow se organiza en dos jobs desacoplados:

1. **Job `build`:**
   - **Runner:** `ubuntu-latest`.
   - **Steps:**
     1. Checkout del código (`actions/checkout@v4`).
     2. Setup de Node.js v22 LTS con caché automática de npm (`actions/setup-node@v4`).
     3. Instalación limpia de dependencias con `npm ci` (o `npm install`).
     4. Verificación estricta de tipos: `npm run check` (si está disponible) o `npx tsc --noEmit`.
     5. Compilación del bundle estático: `npm run build`.
     6. Configuración de páginas (`actions/configure-pages@v5`).
     7. Carga del artefacto de páginas apuntando a `./dist` (`actions/upload-pages-artifact@v3`).

2. **Job `deploy`:**
   - **Dependencia:** `needs: build`.
   - **Entorno:** `environment: { name: 'github-pages', url: ${{ steps.deployment.outputs.page_url }} }`.
   - **Runner:** `ubuntu-latest`.
   - **Step:** Despliegue seguro mediante `actions/deploy-pages@v4`.

---

## 4. Archivo de Definición del Pipeline
El archivo se ubica en [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml).

---

## 5. Criterios de Aceptación
1. El workflow pasa exitosamente en GitHub Actions.
2. La URL generada por GitHub Pages carga los estilos, tipografías y datos sin errores 404 en consola.
3. El modal, filtros y favoritos funcionan de forma autónoma en el dominio publicado.
