<script lang="ts">
  import { SITE } from '../data/constants';
  import { sessions } from '../data/sessions';

  const cutCount = sessions.filter((s) => s.cut).length;
</script>

<p class="note" id="note">
  Datos tomados de una impresión de <a href={SITE} target="_blank" rel="noopener">ekoparty.org/agenda-2026</a> del 5/10/2026. En {cutCount} sesiones el título aparece cortado (marcadas con …), varias no mostraban orador, y el viernes puede haber más salas a la derecha de Sala C2. Confirmá horarios y detalles en el sitio.
</p>
