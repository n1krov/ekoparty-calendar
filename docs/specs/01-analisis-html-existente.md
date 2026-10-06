# Spec 01: Análisis y Desglose Exhaustivo de Ekoparty_2026.html

## 1. Propósito y Alcance
Este documento constituye el inventario técnico y funcional completo de la aplicación contenida en [`Ekoparty_2026.html`](../../Ekoparty_2026.html). Sirve como especificación funcional y de paridad técnica innegociable para la migración a un framework web moderno.

---

## 2. Metadatos del Evento y Dominio
- **Evento:** Ekoparty 2026.
- **Fechas:** 7, 8 y 9 de octubre de 2026 (Miércoles 7, Jueves 8, Viernes 9).
- **Fuente Oficial de Datos:** `https://ekoparty.org/agenda-2026/`.
- **Nota de Integridad:** Datos basados en impresión del 5/10/2026. Sesiones con título cortado indicadas con elipsis (`…`) y bandera booleana `cut: true`.
- **Salas (5):**
  | ID | Nombre | Abreviatura | Color CSS Var | Color Hex (Claro) | Color Hex (Oscuro) |
  |---|---|---|---|---|---|
  | `M` | Maintrack | M | `--coral` | `#F2542D` | `#FF6A45` |
  | `D` | Sala D | D | `--c-d` | `#14A57F` | `#2FD1A3` |
  | `C1` | Sala C1 | C1 | `--c-c1` | `#2F80F5` | `#5AA2FF` |
  | `C2` | Sala C2 | C2 | `--c-c2` | `#F0A800` | `#FFC233` |
  | `C3` | Sala C3 | C3 | `--c-c3` | `#B655DD` | `#CC7DF0` |
  *Orden canónico de salas en grilla:* `['M', 'D', 'C1', 'C2', 'C3']`.

- **Temáticas (`TOPICS`):**
  - `ia`: IA y agentes
  - `exp`: Explotación y ofensiva
  - `hw`: Hardware y reversing
  - `def`: Defensa y cloud
  - `id`: Identidad y privacidad
  - `fin`: Fraude y finanzas
  - `cti`: Cibercrimen e inteligencia
  - `soc`: Sociedad y comunidad

- **Formatos / Tipos de Sesión (`KINDS`):**
  - `s`: Charla (por defecto)
  - `l`: Lightning talk (tag `LT`)
  - `w`: Apertura
  - `c`: CTF

---

## 3. Modelo de Datos y Tipos TypeScript

### 3.1 Estructura Raw (`RAW`)
Cada registro en la matriz cruda consta de una tupla de 7 posiciones:
`[day, room, startTimeStr, durationMin, title, speakersStr, optionsObj]`

Ejemplo:
`[7, "M", "09:25", 50, "LATAM-as-a-Service: How Latin American cybercrime industrialized Everything-as-a-Service", "Anton Dolgalev", { k: "s", tg: ["cti"] }]`

### 3.2 Interfaz TypeScript Normalizada (`Session`)
```typescript
export interface SessionOptions {
  k?: 's' | 'l' | 'w' | 'c';     // Kind / Formato
  es?: number | boolean;         // Idioma español
  tr?: string;                   // Track específico / Village (ej. 'AI Resilience', 'CyberFinance Village')
  tg?: string[];                 // Temas / tags (ej. ['ia', 'exp'])
}

export interface Session {
  id: string;                    // `${day}-${room}-${startTimeSinDosPuntos}` ej: '7-M-0925'
  day: 7 | 8 | 9;                // Día del evento
  room: 'M' | 'D' | 'C1' | 'C2' | 'C3';
  a: number;                     // Hora de inicio en minutos desde las 00:00 (ej: 09:25 -> 565)
  dur: number;                   // Duración en minutos
  b: number;                     // Hora de finalización en minutos (a + dur)
  title: string;                 // Título de la charla
  who: string[];                 // Array de oradores (separados por '|')
  kind: string;                  // 's' | 'l' | 'w' | 'c'
  es: boolean;                   // Verdadero si es en español
  track: string;                 // Village o track específico
  tags: string[];                // Array de IDs de temas
  cut: boolean;                  // Si el título contiene '…'
}
```

---

## 4. Estado de la Aplicación (`st`) y Reactividad

```typescript
export interface AppState {
  view: 'grid' | 'list' | 'agenda'; // Vista activa (en móviles <= 700px inicia por defecto en 'list')
  day: 7 | 8 | 9 | 'all';           // Día seleccionado ('all' solo disponible en lista/agenda)
  rooms: Set<string>;               // Filtro activo de salas
  topics: Set<string>;              // Filtro activo de temas
  es: boolean;                      // Filtro exclusivo "Solo en español"
  q: string;                        // Texto de búsqueda normalizado
  favs: Set<string>;                // Conjunto de IDs de sesiones guardadas
  sheet: string | null;             // ID de la sesión abierta en el modal/sheet
  opener: HTMLElement | null;       // Elemento HTML que disparó el modal (para restaurar foco)
  fallback: string | null;          // Texto de fallback en caso de fallo de clipboard al copiar
  key: string;                      // Clave de control para mantener scroll de grilla
}
```

### 4.1 Persistencia Local
- Clave en `localStorage`: `ekoparty2026-agenda`.
- Almacena un array JSON de IDs de sesiones favoritas (`string[]`).
- Se carga al inicio sanitizando que los IDs existan realmente en la colección de sesiones.

---

## 5. Algoritmos y Reglas de Negocio Clave

1. **Detección de Solapamiento Temporal (`ov`):**
   ```typescript
   export const isOverlapping = (x: Session, y: Session): boolean =>
     x.id !== y.id && x.day === y.day && x.a < y.b && y.a < x.b;
   ```

2. **Criterio de Ordenamiento (`cmp`):**
   Orden cronológico estricto: día ascendente, hora de inicio ascendente, y finalmente orden canónico de salas.
   ```typescript
   export const compareSessions = (x: Session, y: Session): number =>
     x.day - y.day || x.a - y.a || ROOM_ORDER.indexOf(x.room) - ROOM_ORDER.indexOf(y.room);
   ```

3. **Filtrado y Búsqueda (`match`):**
   - Coincidencia con salas seleccionadas (si hay selección, la sala debe pertenecer al Set).
   - Coincidencia con temas seleccionados (si hay selección, al menos uno de los tags debe estar en el Set).
   - Filtro de idioma: si `st.es === true`, la sesión debe tener `es === true`.
   - Búsqueda de texto (`q`): se normaliza eliminando diacríticos/tildes y convirtiendo a minúsculas. Se busca coincidencia de subcadena sobre:
     `[title, who.join(' '), track, roomName, tags.map(topicName).join(' ')].join(' ')`.

4. **Comportamiento Visual de la Grilla al Filtrar:**
   - En la vista **Grilla**, las charlas que **no** cumplen el filtro **no se eliminan del layout** para no romper la distribución física de horarios, sino que reciben la clase `.dim` (opacidad al 20%, con hover restaurado al 95%).
   - En las vistas **Lista** y **Mi Agenda**, los elementos que no coinciden se filtran por completo.

5. **Copiar Agenda al Portapapeles:**
   - Formatea la lista de charlas favoritas agrupadas por día con fecha, rango horario, sala, título y oradores.
   - Utiliza `navigator.clipboard.writeText(text)`.
   - En caso de fallo de permisos, renderiza un `<textarea id="agtxt" readonly>` enfocado y seleccionado para copia manual.

---

## 6. Vistas y Componentes de Interfaz

### 6.1 Hero & Cabecera
- Título destacado: `Ekoparty 2026`.
- Indicador de metadatos: `Agenda · 7 al 9 de octubre de 2026`.
- Tarjetas de estadísticas: número total de sesiones (dinámico), 5 salas, 3 días.

### 6.2 Selector de Días (Tabs con Mini-Horarios)
- Botones tabuladores para Miércoles 07, Jueves 08 y Viernes 09 (y botón "Todos" condicional).
- Cada botón incluye un gráfico de barras miniatura (`.mini`) que ilustra la densidad y horario de las charlas de ese día sobre una línea temporal relativa.

### 6.3 Barra de Herramientas (Toolbar)
- Interruptor segmentado de vistas: `[ Grilla ]`, `[ Lista ]`, `[ Mi agenda (contador) ]`.
- Campo de búsqueda en vivo con icono/placeholder descriptivo.
- Chips de filtrado interactivo:
  - Chips por sala con dot identificador de color.
  - Chips por temáticas.
  - Chip conmutador "Solo en español".
  - Botón "Limpiar filtros" (visible solo cuando hay filtros activos).
  - La barra de chips se oculta automáticamente en la vista "Mi agenda".

### 6.4 Vista Grilla (Transit-style Timetable)
- Eje X: Cabecera sticky con las salas activas en ese día y contador de sesiones por sala.
- Eje Y: Canaleta lateral sticky (`.gut`) con marcas de hora en intervalos de 60 minutos.
- Escala: `PX = 3.4` (3.4 píxeles por minuto).
- Tarjetas de sesión posicionadas absolutamente (`top: OFF + (a - t0) * PX`, `height: Math.max(dur * PX - 4, 64)`).
- Botón de estrella rápida para guardar/quitar de favoritos.
- Apertura de modal al hacer clic en el título de la charla.

### 6.5 Vista Lista
- Agrupación por franjas horarias concurrentes (`.slot` con badge de hora inicial `.tm`).
- Permite comparar qué charlas arrancan a la misma hora en distintas salas.
- Ficha completa con sala, duración, formato, track/village, temas y botón de favoritos.

### 6.6 Vista Mi Agenda
- Muestra únicamente las sesiones guardadas en favoritos.
- **Detector de conflictos:** Destaca en rojo/alerta aquellas charlas que se solapan en horario: `<p class="warn"><span class="pill">Se cruza</span> con ...</p>`.
- Botón "Copiar como texto".
- Estado vacío con mensaje instructivo si no hay favoritas guardadas.

### 6.7 Sheet Lateral / Modal de Detalle (`#sheet`)
- Diálogo flotante modal con backdrop oscurecido (`.scrim`).
- En escritorio: panel lateral derecho deslizante.
- En móvil: bottom-sheet anclado a la parte inferior con esquinas redondeadas.
- Contenido detallado: sala, fecha completa, horario exacto, duración, título completo, oradores, espacio/village, formato, idioma, temas, advertencia de título cortado si aplica, aviso de solapamiento si se cruza con otra favorita, botón "Agregar / Quitar de mi agenda" y enlace externo al sitio oficial.
- **Accesibilidad:**
  - `role="dialog"`, `aria-modal="true"`.
  - Trap de foco accesible (navegación cíclica con `Tab` y `Shift+Tab`).
  - Cierre con tecla `Escape` o clic sobre el backdrop.
  - Retorno automático del foco al elemento disparador (`st.opener`).

### 6.8 Toast de Notificaciones
- Píldora flotante centrada en la parte inferior de la pantalla.
- Mensajes: confirmación de agregado a favoritos, alerta de solapamiento al agregar, confirmación de quitado, confirmación de copiado de agenda.
- Desaparición automática tras 2.4 segundos.

---

## 7. Sistema de Diseño, Variables y Tipografías

### Fuentes Tipográficas:
- Display: `'Big Shoulders Display', 'Arial Narrow', Impact, sans-serif`
- Body: `'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif`
- Monospace: `'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace`

### Paleta y Soporte de Modo Oscuro:
- Variables semánticas: `--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-2`, `--line`.
- Soporte nativo para `@media (prefers-color-scheme: dark)` y selector `[data-theme="dark"]`.
- Soporte para `@media (prefers-reduced-motion: reduce)`.
