<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />

      <div class="container-fluid py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-xxl-11">
            <div class="dashboard-shell">
              <section class="dashboard-hero">
                <div class="row align-items-center g-4">
                  <div class="col-12 col-xl-7">
                    <p class="dashboard-eyebrow mb-2">Panel de inicio</p>
                    <h1 class="dashboard-title mb-2">Hola, {{ nombreMostrar || 'equipo Danair' }}</h1>
                    <p class="dashboard-subtitle mb-4">
                      Una vista clara del catálogo técnico y del contenido web administrable.
                    </p>

                    <div class="hero-meta">
                      <span class="hero-chip">
                        <i class="fe fe-shield me-2"></i>{{ rol || 'Sin rol' }}
                      </span>
                      <span class="hero-chip hero-chip--soft">
                        <i class="fe fe-calendar me-2"></i>{{ fechaLarga }}
                      </span>
                    </div>
                  </div>

                  <div class="col-12 col-xl-5">
                    <div class="hero-focus-card">
                      <p class="hero-focus-label mb-2">Resumen rápido</p>
                      <div class="hero-focus-grid">
                        <div>
                          <span class="hero-focus-value">{{ totalRegistros }}</span>
                          <span class="hero-focus-text">registros en módulos visibles para tu perfil</span>
                        </div>
                        <div>
                          <span class="hero-focus-value">{{ totalPublicados }}</span>
                          <span class="hero-focus-text">elementos publicados o activos</span>
                        </div>
                        <div>
                          <span class="hero-focus-value">{{ quickLinks.length }}</span>
                          <span class="hero-focus-text">secciones clave listas para administrar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="row g-3 mb-4">
                <div v-for="stat in statsCards" :key="stat.label" class="col-12 col-sm-6 col-xl-3">
                  <article class="metric-card h-100">
                    <div class="metric-card__icon" :class="`metric-card__icon--${stat.tone}`">
                      <i :class="`fe fe-${stat.icon}`"></i>
                    </div>
                    <div class="metric-card__body">
                      <p class="metric-card__label mb-1">{{ stat.label }}</p>
                      <h3 class="metric-card__value mb-1">{{ stat.value }}</h3>
                      <p class="metric-card__hint mb-0">{{ stat.hint }}</p>
                    </div>
                  </article>
                </div>
              </section>

              <section class="row g-4 mb-4" v-if="showCharts">
                <div class="col-12 col-xl-7">
                  <div class="dashboard-card chart-card h-100">
                    <div class="dashboard-card__head">
                      <div>
                        <p class="dashboard-card__eyebrow mb-1">Productos</p>
                        <h4 class="dashboard-card__title mb-0">Estado y disponibilidad del catálogo</h4>
                      </div>
                    </div>

                    <div class="chart-card__layout">
                      <div class="chart-card__canvas">
                        <canvas ref="modulesChart"></canvas>
                      </div>

                      <div class="chart-legend-list">
                        <div v-for="item in productChartItems" :key="item.label" class="chart-legend-item">
                          <span class="chart-legend-swatch" :style="{ backgroundColor: item.color }"></span>
                          <div class="chart-legend-copy">
                            <strong>{{ item.value }}</strong>
                            <span>{{ item.label }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-xl-5">
                  <div class="dashboard-card chart-card h-100">
                    <div class="dashboard-card__head">
                      <div>
                        <p class="dashboard-card__eyebrow mb-1">Estado</p>
                        <h4 class="dashboard-card__title mb-0">Publicación del contenido web</h4>
                      </div>
                    </div>

                    <div class="chart-card__stack">
                      <div class="chart-card__canvas chart-card__canvas--sm">
                        <canvas ref="visibilityChart"></canvas>
                      </div>

                      <div class="visibility-summary">
                        <div class="visibility-pill">
                          <span class="visibility-pill__dot visibility-pill__dot--visible"></span>
                          <span>{{ totalPublicados }} visibles</span>
                        </div>
                        <div class="visibility-pill">
                          <span class="visibility-pill__dot visibility-pill__dot--hidden"></span>
                          <span>{{ totalOcultos }} ocultos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="row g-4">
                <div class="col-12 col-xl-7">
                  <div class="dashboard-card h-100">
                    <div class="dashboard-card__head">
                      <div>
                        <p class="dashboard-card__eyebrow mb-1">Accesos rápidos</p>
                        <h4 class="dashboard-card__title mb-0">Secciones clave del panel</h4>
                      </div>
                    </div>

                    <div class="quick-grid">
                      <router-link
                        v-for="link in quickLinks"
                        :key="link.label"
                        :to="{ name: link.route }"
                        class="quick-card"
                      >
                        <div class="quick-card__top">
                          <span class="quick-card__icon" :class="`quick-card__icon--${link.tone}`">
                            <i :class="`fe fe-${link.icon}`"></i>
                          </span>
                          <span class="quick-card__count">{{ link.total }}</span>
                        </div>
                        <h5 class="quick-card__title">{{ link.label }}</h5>
                        <p class="quick-card__text mb-0">{{ link.description }}</p>
                      </router-link>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-xl-5">
                  <div class="dashboard-card h-100">
                    <div class="dashboard-card__head">
                      <div>
                        <p class="dashboard-card__eyebrow mb-1">Prioridades</p>
                        <h4 class="dashboard-card__title mb-0">Qué revisar primero</h4>
                      </div>
                    </div>

                    <div v-if="priorityItems.length" class="priority-list">
                      <article v-for="item in priorityItems" :key="item.label" class="priority-item">
                        <div class="priority-item__count">{{ item.total }}</div>
                        <div class="priority-item__copy">
                          <h5 class="priority-item__title mb-1">{{ item.label }}</h5>
                          <p class="priority-item__text mb-0">{{ item.message }}</p>
                        </div>
                      </article>
                    </div>

                    <div v-else class="empty-state">
                      <i class="fe fe-layout"></i>
                      <p class="mb-0">Tu perfil no tiene módulos administrativos adicionales aparte del acceso al dashboard.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';

export default {
  name: 'DashboardApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      dashboardData: {
        colaboradores: [],
        productos: [],
        categorias: [],
        marcasRepresentativas: [],
        marcasProducto: [],
        servicios: [],
        serviciosTecnicos: [],
        proyectos: [],
        referencias: [],
        referenciasCategorias: []
      },
      loading: false,
      modulesChart: null,
      visibilityChart: null
    };
  },
  computed: {
    usuario() {
      try {
        return JSON.parse(localStorage.getItem('usuario')) || null;
      } catch (e) {
        return null;
      }
    },
    nombreMostrar() {
      return this.usuario ? `${this.usuario.nombres} ${this.usuario.apellidos}` : '';
    },
    rol() {
      return this.usuario ? this.usuario.rol : '';
    },
    isAdmin() {
      return this.rol === 'Administrador';
    },
    isVendedor() {
      return this.rol === 'Vendedor';
    },
    isInventariado() {
      return this.rol === 'Inventariado';
    },
    authHeaders() {
      return {
        headers: {
          Authorization: this.$store.state.token
        }
      };
    },
    fechaLarga() {
      return new Intl.DateTimeFormat('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date());
    },
    quickLinks() {
      const links = [];

      if (this.isAdmin) {
        links.push({
          label: 'Colaboradores',
          route: 'colaborador-index',
          total: this.dashboardData.colaboradores.length,
          icon: 'users',
          tone: 'violet',
          description: 'Usuarios, permisos y acceso al panel.'
        });
      }

      if (this.isAdmin || this.isInventariado) {
        links.push(
          {
            label: 'Productos',
            route: 'producto-index',
            total: this.dashboardData.productos.length,
            icon: 'package',
            tone: 'blue',
            description: 'Catálogo técnico y fichas de producto.'
          },
          {
            label: 'Categorías',
            route: 'categorias',
            total: this.dashboardData.categorias.length,
            icon: 'grid',
            tone: 'amber',
            description: 'Familias y organización del catálogo.'
          },
          {
            label: 'Marcas de producto',
            route: 'marcas-producto',
            total: this.dashboardData.marcasProducto.length,
            icon: 'bookmark',
            tone: 'cyan',
            description: 'Marcas disponibles en referencias y productos.'
          },
          {
            label: 'Marcas representativas',
            route: 'marcas',
            total: this.dashboardData.marcasRepresentativas.length,
            icon: 'star',
            tone: 'mint',
            description: 'Bloques editoriales y logos corporativos.'
          }
        );
      }

      if (this.isAdmin) {
        links.push(
          {
            label: 'Servicios',
            route: 'servicios',
            total: this.dashboardData.servicios.length,
            icon: 'layers',
            tone: 'slate',
            description: 'Páginas principales de servicios.'
          },
          {
            label: 'Servicios técnicos',
            route: 'servicios-tecnicos',
            total: this.dashboardData.serviciosTecnicos.length,
            icon: 'tool',
            tone: 'teal',
            description: 'Bloques técnicos y mantenimientos.'
          },
          {
            label: 'Proyectos destacados',
            route: 'proyectos',
            total: this.dashboardData.proyectos.length,
            icon: 'briefcase',
            tone: 'rose',
            description: 'Casos destacados y experiencias.'
          },
          {
            label: 'Referencias',
            route: 'referencias',
            total: this.dashboardData.referencias.length,
            icon: 'aperture',
            tone: 'indigo',
            description: 'Fichas por industria y por producto.'
          }
        );
      }

      return links;
    },
    productosPublicados() {
      return (this.dashboardData.productos || []).filter((item) => item && item.estado !== false).length;
    },
    productosOcultos() {
      return (this.dashboardData.productos || []).filter((item) => item && item.estado === false).length;
    },
    productosArriendo() {
      return (this.dashboardData.productos || []).filter((item) => item && item.arriendo === true).length;
    },
    productChartItems() {
      return [
        { label: 'Publicados', value: this.productosPublicados, color: '#2563eb' },
        { label: 'Ocultos', value: this.productosOcultos, color: '#cbd5e1' },
        { label: 'Arriendo', value: this.productosArriendo, color: '#14b8a6' }
      ].filter((item) => item.value > 0);
    },
    totalRegistros() {
      return this.quickLinks.reduce((acc, item) => acc + item.total, 0);
    },
    totalPublicados() {
      const totals = [
        this.countPublished(this.dashboardData.productos),
        this.countPublished(this.dashboardData.categorias),
        this.countPublished(this.dashboardData.marcasRepresentativas),
        this.countPublished(this.dashboardData.marcasProducto),
        this.countPublished(this.dashboardData.servicios),
        this.countPublished(this.dashboardData.serviciosTecnicos),
        this.countPublished(this.dashboardData.proyectos),
        this.countPublished(this.dashboardData.referencias),
        this.countPublished(this.dashboardData.referenciasCategorias),
        this.countPublished(this.dashboardData.colaboradores)
      ];
      return totals.reduce((acc, value) => acc + value, 0);
    },
    totalOcultos() {
      const totals = [
        this.countHidden(this.dashboardData.productos),
        this.countHidden(this.dashboardData.categorias),
        this.countHidden(this.dashboardData.marcasRepresentativas),
        this.countHidden(this.dashboardData.marcasProducto),
        this.countHidden(this.dashboardData.servicios),
        this.countHidden(this.dashboardData.serviciosTecnicos),
        this.countHidden(this.dashboardData.proyectos),
        this.countHidden(this.dashboardData.referencias),
        this.countHidden(this.dashboardData.referenciasCategorias),
        this.countHidden(this.dashboardData.colaboradores)
      ];
      return totals.reduce((acc, value) => acc + value, 0);
    },
    statsCards() {
      return [
        {
          label: 'Registros totales',
          value: this.totalRegistros,
          hint: 'Suma de módulos visibles para tu rol.',
          icon: 'database',
          tone: 'blue'
        },
        {
          label: 'Publicados',
          value: this.totalPublicados,
          hint: 'Contenido visible o activo actualmente.',
          icon: 'eye',
          tone: 'green'
        },
        {
          label: 'Ocultos',
          value: this.totalOcultos,
          hint: 'Elementos pendientes o desactivados.',
          icon: 'eye-off',
          tone: 'amber'
        },
        {
          label: 'Categorías',
          value: this.dashboardData.categorias.length + this.dashboardData.referenciasCategorias.length,
          hint: 'Taxonomías de catálogo y referencias.',
          icon: 'layers',
          tone: 'violet'
        }
      ];
    },
    priorityItems() {
      return this.quickLinks
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 4)
        .map((item) => ({
          label: item.label,
          total: item.total,
          message: `Hay ${item.total} registros actualmente en esta sección.`
        }));
    },
    showCharts() {
      return this.quickLinks.length > 0;
    }
  },
  methods: {
    countPublished(items) {
      return (items || []).filter((item) => item && item.estado !== false).length;
    },
    countHidden(items) {
      return (items || []).filter((item) => item && item.estado === false).length;
    },
    async safeGet(url, config = {}) {
      try {
        const response = await axios.get(this.$url + url, config);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        return [];
      }
    },
    async fetchDashboardData() {
      this.loading = true;

      const requests = {
        colaboradores: this.isAdmin ? this.safeGet('/listar_usuario_admin/', this.authHeaders) : Promise.resolve([]),
        productos: (this.isAdmin || this.isInventariado) ? this.safeGet('/listar_productos_admin', this.authHeaders) : Promise.resolve([]),
        categorias: (this.isAdmin || this.isInventariado) ? this.safeGet('/listar_categorias_admin', this.authHeaders) : Promise.resolve([]),
        marcasRepresentativas: (this.isAdmin || this.isInventariado) ? this.safeGet('/marca') : Promise.resolve([]),
        marcasProducto: (this.isAdmin || this.isInventariado) ? this.safeGet('/marca-producto') : Promise.resolve([]),
        servicios: this.isAdmin ? this.safeGet('/servicio') : Promise.resolve([]),
        serviciosTecnicos: this.isAdmin ? this.safeGet('/servicio_tecnico') : Promise.resolve([]),
        proyectos: this.isAdmin ? this.safeGet('/proyecto') : Promise.resolve([]),
        referencias: this.isAdmin ? this.safeGet('/referencia') : Promise.resolve([]),
        referenciasCategorias: this.isAdmin ? this.safeGet('/referencia-categoria') : Promise.resolve([])
      };

      const entries = await Promise.all(
        Object.entries(requests).map(async ([key, promise]) => [key, await promise])
      );

      this.dashboardData = Object.fromEntries(entries);
      this.loading = false;

      this.$nextTick(() => {
        this.renderCharts();
      });
    },
    renderCharts() {
      this.destroyCharts();

      if (this.$refs.modulesChart && this.productChartItems.length) {
        this.modulesChart = new Chart(this.$refs.modulesChart, {
          type: 'doughnut',
          data: {
            labels: this.productChartItems.map((item) => item.label),
            datasets: [{
              data: this.productChartItems.map((item) => item.value),
              backgroundColor: this.productChartItems.map((item) => item.color),
              borderWidth: 0,
              hoverOffset: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#12263f',
                padding: 12,
                displayColors: false
              }
            }
          }
        });
      }

      if (this.$refs.visibilityChart) {
        this.visibilityChart = new Chart(this.$refs.visibilityChart, {
          type: 'doughnut',
          data: {
            labels: ['Visibles', 'Ocultos'],
            datasets: [{
              data: [this.totalPublicados, this.totalOcultos],
              backgroundColor: ['#0f766e', '#e5e7eb'],
              borderWidth: 0,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '74%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#12263f',
                padding: 12,
                displayColors: false
              }
            }
          }
        });
      }
    },
    destroyCharts() {
      if (this.modulesChart) {
        this.modulesChart.destroy();
        this.modulesChart = null;
      }
      if (this.visibilityChart) {
        this.visibilityChart.destroy();
        this.visibilityChart = null;
      }
    }
  },
  mounted() {
    this.fetchDashboardData();
  },
  beforeDestroy() {
    this.destroyCharts();
  }
};
</script>

<style scoped>
.dashboard-shell {
  padding-bottom: 2rem;
}

.dashboard-hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
  padding: 2rem 2rem 1.85rem;
  border: 1px solid #e8edf5;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.06);
}

.dashboard-eyebrow {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #94a3b8;
}

.dashboard-title {
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 650;
  letter-spacing: -0.04em;
  color: #10233d;
}

.dashboard-subtitle {
  max-width: 44rem;
  color: #5d6b82;
  font-size: 1rem;
  line-height: 1.7;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  background: #0f172a;
  color: #fff;
  font-weight: 600;
  font-size: 0.92rem;
}

.hero-chip--soft {
  background: #eef4ff;
  color: #315177;
}

.hero-focus-card {
  padding: 1.25rem;
  border: 1px solid #dfe8f3;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.hero-focus-label {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #94a3b8;
}

.hero-focus-grid {
  display: grid;
  gap: 1rem;
}

.hero-focus-value {
  display: block;
  color: #10233d;
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.hero-focus-text {
  display: block;
  margin-top: 0.35rem;
  color: #65758f;
  line-height: 1.5;
}

.metric-card {
  display: flex;
  gap: 1rem;
  padding: 1.15rem 1.2rem;
  border: 1px solid #e8edf5;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.04);
}

.metric-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.metric-card__icon--blue { background: #eaf2ff; color: #2563eb; }
.metric-card__icon--green { background: #eafaf4; color: #0f766e; }
.metric-card__icon--amber { background: #fff7e8; color: #d97706; }
.metric-card__icon--violet { background: #f4f0ff; color: #7c3aed; }

.metric-card__label {
  color: #8b98ab;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.metric-card__value {
  color: #10233d;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
}

.metric-card__hint {
  color: #68778d;
  line-height: 1.5;
}

.dashboard-card {
  height: 100%;
  padding: 1.35rem;
  border: 1px solid #e8edf5;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.04);
}

.dashboard-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.dashboard-card__eyebrow {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.dashboard-card__title {
  color: #10233d;
  font-weight: 650;
}

.chart-card__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.9fr);
  gap: 1rem;
  align-items: center;
}

.chart-card__stack {
  display: grid;
  gap: 1rem;
  justify-items: center;
}

.chart-card__canvas {
  position: relative;
  width: 100%;
  height: 280px;
}

.chart-card__canvas--sm {
  max-width: 260px;
  height: 240px;
}

.chart-legend-list {
  display: grid;
  gap: 0.75rem;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  background: #fbfdff;
}

.chart-legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  flex-shrink: 0;
}

.chart-legend-copy {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.chart-legend-copy strong {
  color: #10233d;
  font-size: 1rem;
}

.chart-legend-copy span {
  color: #6a7a91;
}

.visibility-summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.visibility-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  background: #f8fafc;
  color: #405168;
  border: 1px solid #e5ebf3;
}

.visibility-pill__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.visibility-pill__dot--visible { background: #0f766e; }
.visibility-pill__dot--hidden { background: #cbd5e1; }

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.quick-card {
  display: block;
  padding: 1rem;
  border: 1px solid #edf2f7;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.quick-card:hover {
  transform: translateY(-3px);
  border-color: #dbe5f0;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.06);
}

.quick-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.quick-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.quick-card__icon--blue { background: #eaf2ff; color: #2563eb; }
.quick-card__icon--amber { background: #fff7e8; color: #d97706; }
.quick-card__icon--cyan { background: #ecfeff; color: #0891b2; }
.quick-card__icon--mint { background: #ecfdf5; color: #10b981; }
.quick-card__icon--slate { background: #eef2ff; color: #475569; }
.quick-card__icon--teal { background: #effcf6; color: #0f766e; }
.quick-card__icon--rose { background: #fff1f2; color: #e11d48; }
.quick-card__icon--indigo { background: #eef2ff; color: #4f46e5; }
.quick-card__icon--violet { background: #f5f3ff; color: #7c3aed; }

.quick-card__count {
  font-size: 1.35rem;
  font-weight: 700;
  color: #10233d;
  letter-spacing: -0.04em;
}

.quick-card__title {
  margin-bottom: 0.35rem;
  color: #10233d;
  font-size: 1rem;
  font-weight: 650;
}

.quick-card__text {
  color: #6c7b90;
  line-height: 1.55;
}

.priority-list {
  display: grid;
  gap: 0.95rem;
}

.priority-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #edf2f7;
  border-radius: 18px;
  background: #fbfdff;
}

.priority-item__count {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #eff6ff;
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
}

.priority-item__title {
  color: #10233d;
  font-size: 1rem;
  font-weight: 650;
}

.priority-item__text {
  color: #6c7b90;
  line-height: 1.55;
}

.empty-state {
  min-height: 220px;
  display: grid;
  place-items: center;
  gap: 0.85rem;
  text-align: center;
  color: #708099;
  border: 1px dashed #dbe4ef;
  border-radius: 20px;
  background: #fbfdff;
  padding: 1.5rem;
}

.empty-state i {
  font-size: 1.5rem;
  color: #94a3b8;
}

@media (max-width: 1199.98px) {
  .chart-card__layout {
    grid-template-columns: 1fr;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767.98px) {
  .dashboard-hero {
    padding: 1.35rem;
    border-radius: 22px;
  }

  .dashboard-card,
  .metric-card {
    border-radius: 20px;
  }

  .chart-card__canvas {
    height: 240px;
  }
}
</style>
