# Spec 02: Hoja de Ruta y Comparativa Técnica de Migración (Next.js vs Svelte)

## 1. Objetivo y Alcance
El objetivo es transformar la aplicación autocontenida de [`Ekoparty_2026.html`](../../Ekoparty_2026.html) en un proyecto web moderno, modular y mantenible utilizando un framework frontend. Este documento analiza las alternativas técnicas propuestas (**Next.js** vs **Svelte / SvelteKit**), evalúa su idoneidad para las características de este proyecto y define las fases de ejecución.

---

## 2. Comparativa Técnica de Frameworks

### 2.1 Perfil del Proyecto
- **Tipo de aplicación:** Single Page Application (SPA) / Sitio Estático (SSG) de alta interacción en cliente.
- **Backend:** Inexistente (cero llamadas a APIs externas en tiempo de ejecución, cero base de datos remota).
- **Datos:** Conjunto estático de ~68 charlas con relaciones fijas (días, salas, temas, formatos).
- **Interactividad crítica en cliente:**
  - Manipulación reactiva de filtros combinados (salas, temas, idioma, búsqueda de texto con diacríticos).
  - Cálculo de coordenadas de grilla y scroll sincronizado.
  - Gestión de favoritos y detección de solapamiento en tiempo real con persistencia en `localStorage`.
  - Diálogo modal accesible (foco circular, teclado).
  - Rendimiento óptimo en dispositivos móviles (los asistentes al evento consultan la agenda en sus celulares con conectividad variable en el recinto).

---

### 2.2 Tabla Comparativa: Svelte (SvelteKit / Vite) vs Next.js (App Router)

| Criterio | Svelte (SvelteKit o Vite + Svelte) | Next.js (App Router) |
|---|---|---|
| **Tamaño de Bundle (JS enviado al cliente)** | 🟢 **Ultra liviano (~15-25 KB gzipped).** Svelte compila a JavaScript vainilla sin virtual DOM runtime pesado. | 🟡 **Más pesado (~80-120 KB gzipped base).** Requiere runtime de React + ReactDOM + router de Next.js. |
| **Modelo de Reactividad** | 🟢 **Nativo y fino.** Manejo de filtros, sets de salas/temas y búsqueda sin boilerplate de `useState`/`useMemo`/`useCallback`. | 🟡 **Hooks de React.** Requiere optimización manual para evitar re-renderizados innecesarios en la grilla. |
| **Tiempo de Carga en Móvil (Mobile-first)** | 🟢 **Instantáneo.** Crucial para conferencias con redes Wi-Fi o 4G congestionadas. | 🟡 Rápido con SSG, pero con hidratación más costosa en CPUs móviles de gama media/baja. |
| **Simplicidad de Arquitectura** | 🟢 Estructura limpia y directa: componentes `.svelte` con estilos encapsulados nativos (ideal para portar los estilos exactos del HTML). | 🟡 Requiere definir `'use client'` en prácticamente todos los componentes debido a la alta interactividad y `localStorage`. |
| **Soporte TypeScript** | 🟢 Soporte nativo de primer nivel. | 🟢 Soporte nativo de primer nivel. |
| **Ecosistema y Adopción** | 🟡 Ecosistema especializado, muy querido por la comunidad. | 🟢 Ecosistema inmenso de componentes React. |

---

### 2.3 Recomendación Técnica
**Recomendación: Svelte (o SvelteKit con adaptador estático)**.
- **Justificación:** Al ser una herramienta que los asistentes usan en vivo durante la Ekoparty, la prioridad número 1 es la **velocidad de carga, peso mínimo en megabytes y reactividad fluida**. 
- En Next.js App Router, al no haber backend ni server actions, el 95% de la aplicación requeriría la directiva `'use client'` para manejar el estado de filtros, scroll de la grilla, `localStorage` y modales, perdiendo las principales ventajas de Server Components.
- Si el usuario prefiere Next.js por familiaridad con React, es perfectamente viable y se estructurará con componentes limpios y memorizados.

---

## 3. Arquitectura Propuesta del Proyecto

Independientemente del framework final, la arquitectura mantendrá la separación estricta de responsabilidades:

```text
src/
├── data/
│   ├── raw-sessions.ts       # Matriz cruda de datos original tipada
│   ├── constants.ts          # ROOMS, TOPICS, DAYS, KINDS, constantes de layout
│   └── sessions.ts           # Dataset normalizado y transformado a objetos Session
├── types/
│   ├── session.ts            # Interfaces Session, Room, Topic, Kind, SessionOptions
│   └── state.ts              # Interfaces de filtros, estado de UI y favoritos
├── utils/
│   ├── time.ts               # Conversión hm(), fmt(), durTxt(), plural()
│   ├── normalize.ts          # Búsqueda insensible a mayúsculas y acentos (norm())
│   ├── overlap.ts            # Detección matemática de cruces de horario (isOverlapping())
│   ├── clipboard.ts          # Formateo de texto de agenda y copia segura
│   └── storage.ts            # Wrapper con manejo de errores para localStorage
├── stores/ / hooks/
│   ├── filterStore.ts        # Estado reactivo de vistas, días, salas, temas, idioma y query
│   └── favoriteStore.ts      # Estado reactivo sincronizado con localStorage
└── components/
    ├── layout/
    │   ├── Header.svelte / tsx
    │   ├── DayTabs.svelte / tsx
    │   └── Footer.svelte / tsx
    ├── toolbar/
    │   ├── Toolbar.svelte / tsx
    │   ├── ViewSwitch.svelte / tsx
    │   ├── SearchInput.svelte / tsx
    │   └── FilterChips.svelte / tsx
    ├── views/
    │   ├── GridView.svelte / tsx
    │   ├── ListView.svelte / tsx
    │   └── AgendaView.svelte / tsx
    └── ui/
        ├── SessionCard.svelte / tsx
        ├── DetailSheet.svelte / tsx
        ├── StarButton.svelte / tsx
        └── Toast.svelte / tsx
```

---

## 4. Fases de Ejecución

1. **Fase 1: Especificación y Gobernanza (Completada):**
   - Reglas y workflow documentados en `GEMINI.md`.
   - Bitácora activa en `docs/STATUS.md`.
   - Especificación del HTML actual en `docs/specs/01-analisis-html-existente.md`.
   - Comparativa de framework y arquitectura en este documento.
2. **Fase 2: Scaffolding y Tipado Base:**
   - Confirmar framework con el usuario.
   - Inicializar el proyecto con TypeScript y linter.
   - Extraer y tipar los datos estáticos de `Ekoparty_2026.html`.
3. **Fase 3: Lógica y Estado Central:**
   - Módulo de utilitarios (tiempo, normalización, solapamiento, persistencia).
   - Store o hooks reactivos para filtros y favoritos.
4. **Fase 4: Desarrollo de Componentes y Vistas:**
   - Toolbar y selector de días con mini-gráfico.
   - Vista Grilla (layout de tránsito, cálculo de altura/top, dimming).
   - Vista Lista (agrupación por slots horarios).
   - Vista Mi Agenda (detección de cruces, copiado de texto).
   - Modal Sheet accesible (trap de foco, responsive desktop/mobile).
5. **Fase 5: Validación, Pulido y Despliegue:**
   - Pruebas de paridad funcional contra el HTML original.
   - Validación de accesibilidad y contrastes.
   - Compilación estática de producción.
