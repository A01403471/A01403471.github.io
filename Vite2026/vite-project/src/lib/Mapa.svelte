<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  // ── Tipo para los registros de la base de datos ──────────────────────────────
  type MapConfig = {
    id:     number;
    titulo: string;
    lat:    number;
    lng:    number;
    zoom:   number;
  };

  // ── Simulación de base de datos ──────────────────────────────────────────────
  // En un proyecto real reemplaza esto con una llamada fetch() a tu API/backend.
  // Ejemplo: const res = await fetch('/api/mapa'); const data: MapConfig = await res.json();
  const db: MapConfig[] = [
    { id: 1, titulo: 'Explorador del Mundo',  lat: 20.6597,  lng: -103.3496, zoom: 13 },
    { id: 2, titulo: 'Centro Histórico CDMX', lat: 19.4326,  lng: -99.1332,  zoom: 15 },
    { id: 3, titulo: 'Cancún — Vista Costera',lat: 21.1619,  lng: -86.8515,  zoom: 13 },
  ];

  async function fetchMapConfig(id: number = 1): Promise<MapConfig> {
    // Simula latencia de red
    await new Promise(r => setTimeout(r, 600));
    return db.find(m => m.id === id) ?? db[0];
  }
  // ────────────────────────────────────────────────────────────────────────────

  let mapContainer: HTMLDivElement;
  let leafletMap:   ReturnType<typeof L.map> | null = null;
  let config:       MapConfig  | null = null;
  let loading:      boolean           = true;
  let error:        string     | null = null;
  let selectedId:   number            = 1;

  async function initMap(): Promise<void> {
    loading = true;
    error   = null;

    try {
      config = await fetchMapConfig(selectedId);

      // Si ya existe un mapa previo, destrúyelo
      if (leafletMap) { leafletMap.remove(); leafletMap = null; }

      leafletMap = L.map(mapContainer, {
        center:      [config.lat, config.lng],
        zoom:        config.zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMap);

      // Marcador central con popup
      L.marker([config.lat, config.lng])
        .addTo(leafletMap)
        .bindPopup(`<strong>${config.titulo}</strong>`)
        .openPopup();

    } catch (e) {
      error = 'No se pudo cargar el mapa. Verifica tu conexión.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(initMap);
  onDestroy(() => { if (leafletMap) leafletMap.remove(); });

  function cambiarMapa(id: number): void {
    selectedId = id;
    initMap();
  }
</script>

<!-- ── Markup ──────────────────────────────────────────────────────────────── -->
<div class="wrapper">

  <!-- Barra superior con título desde la DB -->
  <header class="topbar">
    <div class="brand">
      <span class="icon">🗺</span>
      <div class="title-block">
        <span class="label">TÍTULO DESDE LA BASE DE DATOS</span>
        {#if loading}
          <span class="map-title skeleton">Cargando…</span>
        {:else if config}
          <span class="map-title">{config.titulo}</span>
        {/if}
      </div>
    </div>

    <!-- Selector de mapas (simula distintos registros en la DB) -->
    <nav class="selector">
      {#each db as item}
        <button
          class="sel-btn"
          class:active={selectedId === item.id}
          on:click={() => cambiarMapa(item.id)}
        >
          {item.id}
        </button>
      {/each}
    </nav>
  </header>

  <!-- Contenedor del mapa -->
  <div class="map-wrap">
    {#if loading}
      <div class="overlay">
        <div class="spinner"></div>
        <p>Consultando base de datos…</p>
      </div>
    {/if}

    {#if error}
      <div class="overlay error">
        <span class="err-icon">⚠️</span>
        <p>{error}</p>
        <button on:click={initMap}>Reintentar</button>
      </div>
    {/if}

    <div bind:this={mapContainer} class="leaflet-container"></div>
  </div>

  <!-- Pie con datos técnicos -->
  {#if config && !loading}
  <footer class="footer">
    <span>📍 {config.lat.toFixed(4)}, {config.lng.toFixed(4)}</span>
    <span>🔍 Zoom {config.zoom}</span>
    <span>OpenStreetMap © colaboradores</span>
  </footer>
  {/if}
</div>

<!-- ── Estilos ─────────────────────────────────────────────────────────────── -->
<style>
  /* Variables de tema */
  :root {
    --bg:       #0f1117;
    --surface:  #1a1d27;
    --border:   #2e3248;
    --accent:   #4f8ef7;
    --accent2:  #7c5cfc;
    --text:     #e8eaf6;
    --muted:    #7880a0;
    --radius:   12px;
    --font:     'Segoe UI', system-ui, sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wrapper {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 500px;
  }

  /* ── Topbar ── */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    gap: 12px;
    flex-shrink: 0;
  }

  .brand { display: flex; align-items: center; gap: 12px; }

  .icon { font-size: 1.6rem; }

  .title-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--accent);
    text-transform: uppercase;
  }

  .map-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    transition: opacity 0.3s;
  }

  .skeleton {
    opacity: 0.4;
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }

  /* ── Selector botones ── */
  .selector { display: flex; gap: 6px; }

  .sel-btn {
    width: 34px; height: 34px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
  }
  .sel-btn:hover   { border-color: var(--accent); color: var(--accent); }
  .sel-btn.active  {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-color: transparent;
    color: #fff;
    box-shadow: 0 0 12px rgba(79,142,247,.45);
  }

  /* ── Map wrap ── */
  .map-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
  }

  .leaflet-container {
    width: 100%;
    height: 100%;
  }

  /* ── Overlay (loading / error) ── */
  .overlay {
    position: absolute;
    inset: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    background: rgba(15,17,23,.82);
    backdrop-filter: blur(4px);
    color: var(--text);
  }

  .overlay p { font-size: .95rem; color: var(--muted); }

  .spinner {
    width: 42px; height: 42px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .overlay.error { gap: 10px; }
  .err-icon { font-size: 2rem; }
  .overlay button {
    margin-top: 6px;
    padding: 8px 20px;
    border-radius: 8px;
    border: 1px solid var(--accent);
    background: transparent;
    color: var(--accent);
    cursor: pointer;
    font-size: .9rem;
    transition: all .2s;
  }
  .overlay button:hover { background: var(--accent); color: #fff; }

  /* ── Footer ── */
  .footer {
    display: flex;
    gap: 20px;
    padding: 8px 20px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    font-size: 0.72rem;
    color: var(--muted);
    flex-shrink: 0;
    flex-wrap: wrap;
  }
</style>