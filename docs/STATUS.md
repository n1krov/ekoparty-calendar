# STATUS.md - Bitácora Viva del Proyecto (Ekoparty 2026 Agenda)

## 1. Resumen Ejecutivo
- **Proyecto:** Ekoparty 2026 Agenda Web App.
- **Objetivo:** Migrar y modernizar la agenda interactiva estática (`Ekoparty_2026.html`) a un framework web moderno, reactivo, accesible y ligero, preservando al 100% sus funcionalidades y diseño característico (timetable transit-style, lista, mi agenda, filtros y modal de detalle).
- **Fase Actual:** **Fase 1: Especificación y Modelado (SDD)**.
- **Estado General:** 🟢 En curso. Análisis exhaustivo del HTML base completado y documentado. Pendiente decisión de framework (Svelte vs Next.js) antes de scaffolding.

---

## 2. Decisiones de Arquitectura (ADRs)

### ADR-001: Adopción de Spec-Driven Development (SDD) Ligero
- **Fecha:** 2026-10-06
- **Contexto:** El proyecto inicial contaba con reglas diseñadas para un sistema con backend y bot de Telegram con `board.json`. El proyecto actual es una aplicación web 100% frontend, sin backend y de escala acotada.
- **Decisión:** 
  1. Eliminar `board.json` y el tooling de tableros automáticos.
  2. Adoptar `docs/` como fuente de verdad innegociable con dos pilares:
     - `docs/STATUS.md`: Bitácora viva, seguimiento ágil de hitos y registro de ADRs.
     - `docs/specs/`: Especificaciones formales modulares por componente/fase.
  3. No se implementa código sin previa especificación en `docs/specs/`.
- **Consecuencias:** Desarrollo rápido y ordenado, sin sobrecarga de schemas de tablero innecesarios, manteniendo máxima rigurosidad técnica.

### ADR-002: Selección de Framework Web - Svelte + Vite + TypeScript
- **Fecha:** 2026-10-06
- **Estado:** Aprobado por el usuario.
- **Decisión:** Desarrollar la aplicación utilizando **Svelte con Vite y TypeScript**.
- **Justificación:**
  1. **Peso y Rendimiento:** Svelte compila directamente a código JS vanilla mínimo (~20 KB gzipped vs ~100 KB+ de Next.js), asegurando carga casi instantánea en móviles de asistentes con conectividad limitada.
  2. **Reactividad Fina en Cliente:** La naturaleza 100% cliente/estática de la agenda (filtros combinados, favoritos en `localStorage`, cálculo de coordenadas de grilla y scroll) se beneficia de la reactividad directa sin sobrecarga de Server Components o directivas `'use client'` redundantes.
  3. **Estilos Encapsulados:** Permite migrar y modularizar las variables CSS y el diseño original sin riesgo de colisiones y con mínima fricción.
- **Consecuencias:** Se procederá a inicializar el proyecto usando Vite + Svelte + TypeScript en modo SPA/SSG estático.

### ADR-003: Cimientos Modulares Autocontenidos (Zero Network Scaffolding)
- **Fecha:** 2026-10-06
- **Contexto:** El entorno de red local filtra y bloquea el tráfico saliente de gestores de paquetes (`npm`, `npx`, `bun`). No es posible ejecutar comandos de instalación o generadores en línea.
- **Decisión:**
  1. Cancelar cualquier tarea de red en background (`npx create-vite`).
  2. Construir manualmente todos los cimientos del proyecto (`package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`).
  3. Implementar un store reactivo autocontenido (`src/stores/store-utils.ts`) 100% compatible con el contrato de stores de Svelte, sin requerir dependencias externas para tipado.
  4. Extraer, tipar y modularizar el código completo en `src/`: tipos, utilidades, datos, stores y todos los componentes Svelte.
- **Consecuencias:** El repositorio queda 100% estructurado, modularizado y funcional a nivel de arquitectura. Cuando el usuario conecte a una red sin filtro, bastará con correr `npm install && npm run dev` directamente.

### ADR-004: Pipeline CI/CD con GitHub Actions para Despliegue en GitHub Pages
- **Fecha:** 2026-10-06
- **Contexto:** Se requiere automatizar la compilación estática y el despliegue de la aplicación web en GitHub Pages de forma desatendida ante cada push a la rama principal.
- **Decisión:**
  1. Especificar el pipeline formalmente en `docs/specs/04-pipeline-deploy-gh-pages.md`.
  2. Implementar el workflow `.github/workflows/deploy.yml` con permisos de menor privilegio (`pages: write`, `id-token: write`, `contents: read`).
  3. Utilizar la API nativa de Pages Artifacts (`actions/upload-pages-artifact@v3` y `actions/deploy-pages@v4`) para evitar el uso de ramas intermedias sucias (`gh-pages`).
  4. Mantener `base: './'` en `vite.config.ts` para resolución segura de paths en subdirectorios de repositorios de GitHub.
- **Consecuencias:** Despliegue continuo garantizado sin pasos manuales una vez subido el código al repositorio remoto.

---

## 3. Checklist de Hitos y Tareas

- [x] **Hito 0: Inicialización y Gobernanza**
  - [x] Adaptar `GEMINI.md` a la metodología SDD sin backend ni board.
  - [x] Crear `.gitignore` estándar para proyectos Node / TypeScript.
  - [x] Crear `docs/STATUS.md` como bitácora viva.
- [x] **Hito 1: Especificación del Estado Actual**
  - [x] Crear `docs/specs/01-analisis-html-existente.md` con el desglose exhaustivo de `Ekoparty_2026.html` (datos, UI, interactividad, a11y y estilos).
  - [x] Crear `docs/specs/02-roadmap-migracion-framework.md` con la comparativa Next.js vs Svelte y plan de migración.
- [x] **Hito 2: Decisión de Framework & Scaffolding**
  - [x] Acordar con el usuario el framework definitivo (Svelte elegido).
  - [x] Formalizar ADR-002 en este documento.
  - [x] Especificar arquitectura Svelte en `docs/specs/03-arquitectura-svelte-y-datos.md`.
  - [x] Configurar `package.json`, `tsconfig.json`, `vite.config.ts` e `index.html`.
- [x] **Hito 3: Extracción y Tipado del Modelo de Datos**
  - [x] Crear módulo de tipos TypeScript (`src/types/session.ts`, `src/types/state.ts`, `src/types/index.ts`).
  - [x] Extraer matriz original tipada (`src/data/raw-sessions.ts`) y constantes (`src/data/constants.ts`).
  - [x] Normalizar sesiones indexadas por ID (`src/data/sessions.ts`).
  - [x] Implementar utilitarios de cálculo de tiempo (`time.ts`), solapamiento (`overlap.ts`), normalización (`normalize.ts`), portapapeles (`clipboard.ts`) y almacenamiento local (`storage.ts`).
- [x] **Hito 4: Componentes de UI y Vistas**
  - [x] Implementar stores reactivos (`filters.ts`, `favorites.ts`, `sheet.ts`, `toast.ts`, `store-utils.ts`).
  - [x] Migrar sistema de estilos completo a `src/app.css` con variables CSS y soporte dark mode.
  - [x] Componente `Header.svelte` con estadísticas dinámicas.
  - [x] Componente `DayTabs.svelte` con barras de mini-horario relativas.
  - [x] Componente `Note.svelte` y `Footer.svelte`.
  - [x] Componente `Toolbar.svelte` (switch de vistas, búsqueda en vivo y chips de filtros).
  - [x] Vista `GridView.svelte` (horario tipo tránsito con carriles, scroll sticky y atenuación de no coincidentes).
  - [x] Vista `ListView.svelte` (agrupada por bloques horarios concurrentes).
  - [x] Vista `AgendaView.svelte` (favoritos persistentes en `localStorage`, alerta de cruces de horario y exportación de texto).
  - [x] Componente `DetailSheet.svelte` (modal accesible con trap de foco en `Tab`, tecla `Escape` y enlace oficial).
  - [x] Componente `Toast.svelte` (notificación accesible).
  - [x] Componente raíz `App.svelte` y punto de entrada `src/main.ts`.
- [ ] **Hito 5: CI/CD, Verificación y Deploy**
  - [x] Especificar pipeline CI/CD en `docs/specs/04-pipeline-deploy-gh-pages.md`.
  - [x] Crear workflow de GitHub Actions en `.github/workflows/deploy.yml`.
  - [ ] Pruebas de paridad funcional con el archivo original.
  - [ ] Verificación de accesibilidad por teclado y contraste en modo claro/oscuro.
  - [ ] Deploy automático en GitHub Pages al realizar push al repositorio.

---

## 4. Registro Cronológico de la Bitácora

### 2026-10-06: Configuración Inicial, Cimientos Svelte y Pipeline CI/CD GitHub Pages
- Se reescribió `GEMINI.md` para eliminar toda mención a backend, Telegram bots y `board.json`, estableciendo el rol de Desarrollador Frontend Senior bajo Spec-Driven Development estricto.
- Se configuró `.gitignore` para cubrir entornos de desarrollo Node, Vite, Svelte y Next.js.
- Se analizó en profundidad el archivo `Ekoparty_2026.html` (624 líneas, 68 charlas, 5 salas, 3 días, filtros combinados, visualización timetable y modal lateral).
- Se documentó la especificación del HTML en `docs/specs/01-analisis-html-existente.md` y la comparativa de arquitectura en `docs/specs/02-roadmap-migracion-framework.md`.
- El usuario seleccionó **Svelte** como framework de destino. Se aprobó ADR-002 y se redactó la especificación técnica en `docs/specs/03-arquitectura-svelte-y-datos.md`.
- Ante el bloqueo de red para comandos de descarga (`npm`, `npx`, `bun`), se aprobó ADR-003: se canceló el proceso bloqueante y se construyeron artesanalmente todos los cimientos del proyecto en `src/` (28 archivos modulares cubriendo tipos, datos, utilidades, stores desacoplados y todos los componentes Svelte requeridos para paridad total).
- Se redactó `docs/specs/04-pipeline-deploy-gh-pages.md` y se aprobó ADR-004 para automatizar la entrega continua en GitHub Pages.
- Se implementó el pipeline de GitHub Actions en `.github/workflows/deploy.yml`.
- Se corrigió el error en GitHub Actions eliminando `cache: 'npm'` en `actions/setup-node@v4` debido a la ausencia inicial de `package-lock.json` en el repositorio, y se fijaron las versiones de Svelte a 4.x estable.
- Se añadió un `package-lock.json` (lockfileVersion 3) para garantizar compatibilidad total con detectores de paquetes y herramientas de CI.
- Se creó `svelte.config.js` y se actualizó `vite.config.ts` integrando `vitePreprocess()` para compilar bloques `<script lang="ts">` en los componentes Svelte durante el build.
- Se eliminaron las aserciones de tipo TypeScript (`as`) de las expresiones en plantillas Svelte (`AgendaView`, `ListView`, `DetailSheet`) y se resolvió la advertencia a11y de `<nav role="tablist">` en `DayTabs`.
