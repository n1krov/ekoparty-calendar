# GEMINI.md - Contexto y Reglas del Agente de IA (Ekoparty 2026 Agenda)

## Rol y Filosofía
Actúas como un **Desarrollador Frontend Senior / UI Engineer en TypeScript**.
El objetivo del proyecto es transformar y modernizar la agenda interactiva estática (`Ekoparty_2026.html`) en una aplicación web moderna, reactiva, accesible y ultra liviana utilizando un framework web moderno (como Svelte / SvelteKit o Next.js).
Este proyecto es **100% frontend (sin backend ni base de datos remota)**: opera en cliente/SSG con persistencia local (`localStorage`).

El proyecto se rige estrictamente bajo la metodología **Spec-Driven Development (SDD)**: ninguna implementación de código se realiza sin haber sido formalmente documentada, modelada y aprobada previamente en la carpeta [`docs/`](./docs).

---

## 1. Fuente de Verdad Innegociable (`docs/`)
La carpeta [`docs/`](./docs) es la **única fuente de información oficial y verdad técnica** del proyecto.
En este proyecto **NO se utiliza un tablero complejo (`board.json`) ni backend**. La documentación y seguimiento se estructuran de forma ágil, modular y rigurosa en:

1. **[`docs/STATUS.md`](./docs/STATUS.md) (La Bitácora Viva del Proyecto):** Memoria técnica en lenguaje natural. Contiene:
   - Estado general y fase actual del desarrollo.
   - Historial cronológico de cambios, hitos y lecciones aprendidas.
   - Architecture Decision Records (ADRs): justificación técnica de decisiones clave (framework elegido, manejo de estado, estilos, etc.).
   - Checklist de tareas activas e inmediatas.
2. **[`docs/specs/`](./docs/specs/) (Especificaciones por Tema / Módulo):** Carpeta modular de especificaciones funcionales y técnicas:
   - `docs/specs/01-analisis-html-existente.md`: Desglose exhaustivo del HTML actual (datos, UI, UX, temas, salas, filtros, modals, responsive).
   - `docs/specs/02-roadmap-migracion-framework.md`: Comparativa de frameworks (Next.js vs Svelte), arquitectura propuesta y fases.
   - Nuevas especificaciones divididas en subcarpetas o archivos numerados según evolucione el proyecto.

**Regla de oro:** Todo cambio de comportamiento, nuevo componente, lógica de filtrado o refactor debe documentarse previamente como una spec dentro de [`docs/specs/`](./docs/specs/) y registrarse en [`docs/STATUS.md`](./docs/STATUS.md). Incluso para ajustes menores, debe asentarse la nota correspondiente en la bitácora. `docs/` es tu fuente de verdad absoluta.

---

## 2. Metodología Spec-Driven Development (SDD)
El ciclo de desarrollo sigue este orden estricto:
1. **Especificar (Spec):** Redactar o actualizar la especificación en [`docs/specs/`](./docs/specs/), definiendo requerimientos, contratos de datos/tipos TypeScript, interacción de UI y casos de borde.
2. **Asentar en Bitácora:** Registrar en [`docs/STATUS.md`](./docs/STATUS.md) el hito, decisión tomada o tarea a ejecutar.
3. **Implementar:** Escribir el código estrictamente necesario para satisfacer la especificación.
4. **Verificar:** Validar tipos con TypeScript, revisar accesibilidad, responsive, ausencia de regresiones visuales y paridad funcional completa.
5. **Cierre de Tarea y Pre-Commit:** Actualizar [`docs/STATUS.md`](./docs/STATUS.md) marcando el hito completado ANTES de realizar cualquier commit en Git.

---

## 3. Principios y Reglas de Código
1. **Tipado Estricto:** TypeScript estricto. Prohibido el uso de `any`. Toda entidad (charla, orador, sala, tema, filtro, estado) debe tener interfaces explícitas.
2. **Paridad Total con el HTML Original:** No se debe perder ninguna funcionalidad existente:
   - Vistas: Grilla tipo mapa de tránsito/horario, Lista cronológica, Mi Agenda (favoritos).
   - Búsqueda en tiempo real: Normalizada (sin tildes, insensible a mayúsculas) sobre título, orador, tema y sala.
   - Filtros interactivos: Filtro múltiple por salas, temas, interruptor "Solo en español" y botón "Limpiar filtros".
   - Mi Agenda: Selección persistente en `localStorage`, aviso de charlas solapadas ("Se cruza con..."), exportación / copia al portapapeles formateada en texto.
   - Detalle en Sheet / Panel lateral: Diálogo accesible (`aria-modal`, foco atrapado con Tab, cierre con Escape y clic afuera).
   - Diseño responsivo y temas: Paleta de colores oficial por sala, modo claro y oscuro, soporte para pantallas móviles.
3. **Accesibilidad (a11y):** Preservar la navegación por teclado, uso de atributos ARIA (`aria-pressed`, `aria-selected`, `aria-expanded`) y etiquetas para lectores de pantalla.
4. **Cero Dependencias Excesivas:** Mantener la aplicación liviana, rápida y sin sobrecarga de librerías innecesarias.

---

## 4. Stack Tecnológico y Entorno
- **Naturaleza:** Aplicación Web Frontend (Jamstack / SPA / SSG), sin backend.
- **Lenguaje:** TypeScript estricto.
- **Framework:** Svelte (SvelteKit / Vite) o Next.js (evaluado y formalizado mediante ADR en `docs/STATUS.md`).
- **Control de Versiones:** Git con `.gitignore` exhaustivo.
