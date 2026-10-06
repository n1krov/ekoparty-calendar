<script lang="ts">
  import AgendaView from './components/AgendaView.svelte';
  import DayTabs from './components/DayTabs.svelte';
  import DetailSheet from './components/DetailSheet.svelte';
  import FilterDrawer from './components/FilterDrawer.svelte';
  import Footer from './components/Footer.svelte';
  import GridView from './components/GridView.svelte';
  import Header from './components/Header.svelte';
  import ListView from './components/ListView.svelte';
  import MobileNav from './components/MobileNav.svelte';
  import Note from './components/Note.svelte';
  import Toast from './components/Toast.svelte';
  import Toolbar from './components/Toolbar.svelte';
  import { view } from './stores/filters';
</script>

<div class="wrap">
  <Header />
  <DayTabs />
  <Note />
  <Toolbar />

  <main id="out">
    {#if $view === 'grid'}
      <GridView />
    {:else if $view === 'list'}
      <ListView />
    {:else if $view === 'agenda'}
      <AgendaView />
    {/if}
  </main>

  <Footer />
</div>

<MobileNav />
<FilterDrawer />
<DetailSheet />
<Toast />
