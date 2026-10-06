# Spec 06: Rediseño y Adaptación Mobile-First de la Agenda

## 1. Propósito y Diagnóstico
Esta especificación define la transformación completa de la experiencia móvil de la aplicación. Durante una conferencia como la Ekoparty, más del 80% del uso ocurre desde teléfonos móviles mientras los asistentes caminan por las instalaciones con una sola mano y conectividad intermitente.

---

## 2. Diagnóstico de Problemas en Pantallas Móviles (`<= 640px`)

1. **Desplazamiento vertical excesivo antes de ver la primera charla:**
   - La cabecera Hero actual utiliza tipografía gigante `clamp(68px, 14vw, 168px)` que, sumada a las estadísticas, tres pestañas de días, la nota de datos y la barra de herramientas, consume más de 600px de altura vertical, ocultando el horario por debajo del pliegue (*below the fold*).
2. **Saturación visual de chips de filtrado:**
   - Desplegar simultáneamente 5 chips de sala, 8 de temas y botones de idioma genera entre 4 y 5 renglones de botones en cascada, ocupando casi la totalidad de la pantalla útil.
3. **Ergonomía de pulgar deficiente (Thumb Zone):**
   - El selector de vistas (`Grilla / Lista / Mi agenda`) se encuentra en la parte superior, obligando al usuario a estirar los dedos hacia la esquina superior izquierda.
4. **Fricción en la Grilla móvil:**
   - En pantallas pequeñas (360px - 390px), las columnas de 210px hacen que solo quepa una sala y media. El scroll bidireccional (horizontal y vertical simultáneo) suele provocar toques accidentales que abren el modal de detalle sin desearlo.
5. **Panel de detalle (Sheet) sin controles táctiles nativos:**
   - Carece de indicador visual de arrastre (*drag handle*) y sus botones de acción quedan al final de un texto largo que requiere scroll interno para agregar a favoritos.

---

## 3. Principios de Diseño Mobile-First

1. **Contenido visible inmediatamente:** El usuario debe ver charlas del día seleccionado en el primer pantallazo sin tener que hacer scroll extensivo.
2. **Ergonomía de pulgar:** Navegación principal en la parte inferior accesible con una sola mano.
3. **Touch Targets de estándar WCAG / Apple HIG:** Todo botón interactivo (especialmente la estrella de favoritos y el botón de cerrar) debe tener un área táctil mínima de 44x44px.
4. **Respeta Safe Area Insets:** Margen seguro para barras de gestos de Android e iOS (`env(safe-area-inset-bottom)`).

---

## 4. Componentes y Patrones Móviles Propuestos

### 4.1 Header Compacto en Móvil
- En resoluciones móviles (`<= 640px`), el título se reduce a tamaño legible y conciso:
  ```css
  @media (max-width: 640px) {
    h1 { font-size: 38px; line-height: 1; }
    .stats { gap: 14px; }
    .stats dd { font-size: 26px; }
    .hero { gap: 8px; }
  }
  ```
- La nota de integridad se compacta en un botón/banner desplegable o colapsable de 1 sola línea: *"ℹ️ Datos del 5/10/2026 (ekoparty.org)"*.

### 4.2 Barra de Navegación Inferior Fija (Bottom Navigation Bar)
En móvil, la botonera de vistas se ancla en la parte inferior de la pantalla:
- **Estructura fija:**
  - 📅 **Grilla:** icono + texto.
  - 📋 **Lista:** icono + texto.
  - ⭐ **Mi Agenda:** icono + badge numérico reactivo.
  - 🎛️ **Filtros:** botón con badge indicador de cuántos filtros están activos (ej. `Filtros (2)`).
- **Estilo:**
  ```css
  .mobile-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 45;
    display: flex;
    justify-content: space-around;
    background: var(--surface);
    border-top: 1px solid var(--line);
    padding-bottom: max(8px, env(safe-area-inset-bottom));
    padding-top: 8px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  }
  ```

### 4.3 Drawer de Filtros Móvil (Filter Sheet)
- En lugar de saturar la pantalla con 15 chips, el botón "Filtros" de la barra móvil abre un panel deslizante desde abajo:
  - Fila superior: Perfiles rápidos ("🎯 Red Team", "🐧 Linux & Bajo Nivel", "🛡️ DevSecOps").
  - Sección Salas: chips con dot de color.
  - Sección Temas: chips temáticos.
  - Interruptor "Solo en español".
  - Botón "Limpiar filtros" y botón grande "Aplicar filtros".
- En desktop, los chips permanecen visibles en la toolbar superior como hasta ahora.

### 4.4 Optimización de la Grilla en Pantallas Táctiles
- Ancho de columna por sala ajustado a `minmax(165px, 1fr)` en móvil, permitiendo ver dos salas concurrentes simultáneamente.
- Canaleta horaria izquierda sticky (`.gut`) con ancho de 48px y tipografía mono clara.
- Detección de desplazamiento: un toque leve abre el modal; un deslizamiento (drag) solo realiza scroll sin disparar el click.

### 4.5 Lista Optimizada con Riel de Tiempo
- En la vista Lista en móvil:
  - Tarjetas de sesión con padding optimizado (`10px 12px`).
  - Botón de estrella flotante ampliado a `44x44px` con padding táctil invisible para facilitar el marcado rápido con el pulgar.
  - Etiquetas compactas con badge de sala distinguible por color.

### 4.6 Drawer de Detalle (Detail Bottom Sheet)
- Al abrir una charla en móvil:
  - Barra superior con **Drag Handle** (`36px x 4px`, redondeado).
  - Altura máxima del 88% del viewport con scroll interno suave.
  - **Barra de acción fija inferior:** El botón *"Agregar a mi agenda"* y el enlace *"Sitio oficial ↗"* se quedan fijos en la parte inferior del panel con fondo esfumado, garantizando que el usuario siempre pueda interactuar sin tener que scrollear hasta el fondo de la biografía de los oradores.

---

## 5. Criterios de Aceptación
1. En pantalla de 375px (iPhone SE / estándar):
   - El primer bloque de charlas es visible inmediatamente sin scroll o con un scroll mínimo.
   - La barra de navegación inferior permite cambiar de vista instantáneamente con el pulgar.
   - El modal de filtros no genera scroll horizontal en la pantalla principal.
2. Todas las zonas de click tienen un tamaño mínimo interactivo de 44x44px.
3. El modal de detalle se adapta como un bottom-sheet nativo con botones de acción siempre visibles.
4. Cero regresiones visuales en la versión desktop (> 1024px).
