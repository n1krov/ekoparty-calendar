# Spec 03: Arquitectura Técnica Svelte, Estructura de Proyecto y Estado

## 1. Propósito y Alcance
Esta especificación define la arquitectura técnica detallada para la implementación en **Svelte + Vite + TypeScript**, estableciendo la estructura de archivos, contratos de tipos, gestión del estado reactivo y descomposición de componentes para lograr paridad total con [`Ekoparty_2026.html`](../../Ekoparty_2026.html).

---

## 2. Tooling y Entorno de Ejecución
- **Runtime:** Node.js v26+ / ESM.
- **Bundler:** Vite.
- **Framework UI:** Svelte con TypeScript.
- **Estilos:** Variables CSS globales en `app.css` con estilos encapsulados nativos por componente en bloques `<style>`, preservando los tokens de diseño, tipografías y el soporte de modo claro/oscuro.

---

## 3. Estructura del Código Fuente (`src/`)

```text
src/
├── main.ts                     # Punto de entrada de la aplicación
├── App.svelte                  # Orquestador principal y layout general
├── app.css                     # Variables CSS globales, tipografías y reset
├── types/
│   ├── session.ts              # Modelos de datos de sesiones, salas, temas, formatos
│   └── state.ts                # Tipos de estado: vistas, filtros, sheet, toast
├── data/
│   ├── constants.ts            # ROOMS, TOPICS, DAYS, KINDS, ROOM_ORDER, SITE, KEY
│   ├── raw-sessions.ts         # Matriz cruda de 68 charlas original
│   └── sessions.ts             # Dataset transformado y mapa byId
├── utils/
│   ├── time.ts                 # hm(), fmt(), durTxt(), plural()
│   ├── normalize.ts            # norm() para búsqueda insensible a acentos/mayúsculas
│   ├── overlap.ts              # isOverlapping() para detectar cruces de horario
│   ├── clipboard.ts            # Formateo de texto de agenda y navigator.clipboard
│   └── storage.ts              # Wrapper seguro de lectura/escritura en localStorage
├── stores/
│   ├── filters.ts              # Estado reactivo de vista activa, día, salas, temas, es, q
│   ├── favorites.ts            # Set reactivo de favoritos sincronizado con localStorage
│   ├── sheet.ts                # Estado del modal lateral de detalle
│   └── toast.ts                # Cola/mensaje temporal de toast
└── components/
    ├── Header.svelte           # Hero y contadores
    ├── DayTabs.svelte          # Tabs con visualizador mini-timeline por día
    ├── Note.svelte             # Nota informativa sobre datos de la impresión
    ├── Toolbar.svelte          # Switch de vistas, barra de búsqueda y chips de filtro
    ├── GridView.svelte         # Grilla tipo mapa de tránsito con atenuación
    ├── ListView.svelte         # Lista agrupada por bloques horarios concurrentes
    ├── AgendaView.svelte       # Mi Agenda con avisos de solapamiento y copiado
    ├── DetailSheet.svelte      # Panel lateral / modal accesible con trap de foco
    ├── Toast.svelte            # Notificación flotante temporal
    └── Footer.svelte           # Pie de página y créditos
```

---

## 4. Contratos de Tipos TypeScript

### 4.1 Entidades de Dominio (`src/types/session.ts`)
```typescript
export type RoomId = 'M' | 'D' | 'C1' | 'C2' | 'C3';
export type DayId = 7 | 8 | 9;
export type TopicId = 'ia' | 'exp' | 'hw' | 'def' | 'id' | 'fin' | 'cti' | 'soc';
export type KindId = 's' | 'l' | 'w' | 'c';

export interface RoomInfo {
  n: string; // Nombre: ej. 'Maintrack'
  c: string; // Código visual: ej. 'M'
}

export interface DayInfo {
  w: string; // Nombre completo: 'Miércoles'
  s: string; // Abreviado: 'Mié'
  d: string; // Fecha completa: '7 de octubre'
}

export interface Session {
  id: string;          // `${day}-${room}-${startTimeSinDosPuntos}`
  day: DayId;          // 7 | 8 | 9
  room: RoomId;        // 'M' | 'D' | 'C1' | 'C2' | 'C3'
  a: number;           // Minutos desde medianoche de inicio
  dur: number;         // Duración en minutos
  b: number;           // Minutos de fin (a + dur)
  title: string;       // Título de la charla
  who: string[];       // Lista de oradores
  kind: KindId | '';   // Formato de sesión
  es: boolean;         // Indicador si es en español
  track: string;       // Village o espacio específico
  tags: TopicId[];     // Lista de tópicos asociados
  cut: boolean;        // Si el título original venía cortado con '…'
}
```

### 4.2 Estado de UI y Filtros (`src/types/state.ts`)
```typescript
export type ViewMode = 'grid' | 'list' | 'agenda';
export type SelectedDay = DayId | 'all';

export interface FilterState {
  view: ViewMode;
  day: SelectedDay;
  rooms: Set<RoomId>;
  topics: Set<TopicId>;
  es: boolean;
  q: string; // Texto normalizado
}

export interface SheetState {
  isOpen: boolean;
  sessionId: string | null;
  openerElement: HTMLElement | null;
}
```

---

## 5. Gestión del Estado Reactivo

Se utilizarán stores reactivos (compatibles y limpios en Svelte) para aislar la lógica del renderizado:

1. **`filterStore`:**
   - Controla `view`, `day`, `rooms`, `topics`, `es`, `q`.
   - Derivado `isFilterActive`: booleano para habilitar el botón "Limpiar filtros".
   - Derivado `filteredSessions`: sesiones que coinciden con los filtros actuales.
   - Derivado `matchSession(session)`: función para saber si una charla cumple el filtro (usado en la Grilla para aplicar `.dim`).

2. **`favoriteStore`:**
   - Mantiene el `Set<string>` de IDs guardados.
   - Sincroniza automáticamente cambios en `localStorage` bajo la clave `ekoparty2026-agenda`.
   - Métodos: `toggle(id)`, `has(id)`, `getConflicts(sessionId)`.

3. **`sheetStore`:**
   - Métodos: `open(id, openerElement?)`, `close()`.

4. **`toastStore`:**
   - Método: `show(message: string, durationMs?: number)`.

---

## 6. Criterios de Aceptación y Pruebas
1. Cero errores de compilación con `tsc --noEmit`.
2. Fidelidad visual pixel-perfect frente a `Ekoparty_2026.html`.
3. Navegación por teclado intacta: `Tab` atrapado dentro del modal, `Escape` para cerrar, restauración de foco en el disparador.
4. Persistencia en `localStorage` idéntica para permitir compatibilidad bidireccional si se usaba el HTML estático antes.
