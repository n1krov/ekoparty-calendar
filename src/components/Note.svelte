<script lang="ts">
  import { SITE } from '../data/constants';
  import { sessions } from '../data/sessions';

  const cutCount = sessions.filter((s) => s.cut).length;
</script>

<details class="note" id="note">
  <summary class="note-summary">
    ℹ️ Datos tomados de impresión del 5/10/2026 · {cutCount} títulos cortados · <span class="note-more">Ver aviso completo</span>
  </summary>
  <p class="note-full">
    En {cutCount} sesiones el título aparece cortado en la impresión original (marcadas con …), varias no mostraban orador, y el viernes puede haber más salas a la derecha de Sala C2. Confirmá horarios y detalles en el <a href={SITE} target="_blank" rel="noopener">sitio oficial de Ekoparty</a>.
  </p>
</details>
