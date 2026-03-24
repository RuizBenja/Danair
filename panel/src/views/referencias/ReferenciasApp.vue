<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-10">
            <div class="header mt-md-5">
              <div class="header-body">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">Contenido web</h6>
                    <h1 class="header-title">Referencias</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <a class="nav-link active">Todas las referencias</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/referencias/categorias" class="nav-link">Categorías de referencias</router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/referencias/create" class="nav-link">Nueva referencia</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="row align-items-center g-3">
                  <div class="col-12 col-lg">
                    <div class="input-group input-group-flush input-group-merge input-group-reverse">
                      <input
                        class="form-control list-search"
                        type="search"
                        v-model="filtro"
                        placeholder="Buscar referencia"
                      >
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>
                  <div class="col-12 col-lg-auto">
                    <div class="d-flex gap-2">
                      <button class="btn btn-white btn-sm" type="button" @click="downloadCsv">
                        <i class="fe fe-download me-1"></i> CSV
                      </button>
                      <button class="btn btn-white btn-sm" type="button" @click="printTable">
                        <i class="fe fe-printer me-1"></i> Imprimir
                      </button>
                    </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                    <select v-model="filtroIndustria" class="form-select">
                      <option value="">Todas las industrias</option>
                      <option v-for="categoria in categoriasIndustria" :key="categoria._id" :value="categoria._id">
                        {{ categoria.nombre }}
                      </option>
                    </select>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                    <select v-model="filtroProducto" class="form-select">
                      <option value="">Todos los productos</option>
                      <option v-for="categoria in categoriasProducto" :key="categoria._id" :value="categoria._id">
                        {{ categoria.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Industria</th>
                      <th>Producto</th>
                      <th>Comuna</th>
                      <th>Ficha técnica</th>
                      <th>Orden</th>
                      <th>Estado</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>

                  <paginate
                    :key="filterKey"
                    tag="tbody"
                    ref="referenciasPaginate"
                    name="referenciasPaginate"
                    :list="filteredReferencias"
                    :per="perPage"
                    class="list fs-base"
                  >
                    <tr v-for="referencia in paginated('referenciasPaginate')" :key="referencia._id">
                      <td style="width: 90px;">
                        <img
                          v-if="referencia.imagen"
                          :src="$url + '/referencia/imagen/' + referencia.imagen"
                          style="height: 44px; width: 64px; object-fit: cover; border-radius: 0.5rem;"
                        >
                      </td>
                      <td>{{ referencia.titulo }}</td>
                      <td>{{ referencia.industria_categoria ? referencia.industria_categoria.nombre : '-' }}</td>
                      <td>{{ referencia.producto_categoria ? referencia.producto_categoria.nombre : '-' }}</td>
                      <td>{{ referencia.comuna }}</td>
                      <td>
                        <div class="reference-specs">
                          <div>{{ referencia.marca }}<span v-if="referencia.modelo"> / {{ referencia.modelo }}</span></div>
                          <small class="text-muted d-block" v-if="referencia.potencia">Potencia: {{ referencia.potencia }}</small>
                          <small class="text-muted d-block" v-if="referencia.caudal">Caudal: {{ referencia.caudal }}</small>
                          <small class="text-muted d-block" v-if="referencia.presion">Presión: {{ referencia.presion }}</small>
                        </div>
                      </td>
                      <td class="text-nowrap">
                        <div class="d-flex align-items-center gap-2 reference-order-actions">
                          <button class="btn btn-sm btn-outline-secondary" @click="move(referencia, 'up')" title="Subir" aria-label="Subir">
                            <i class="fe fe-chevron-up"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" @click="move(referencia, 'down')" title="Bajar" aria-label="Bajar">
                            <i class="fe fe-chevron-down"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <span :class="['badge', referencia.estado ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">
                          {{ referencia.estado ? 'Visible' : 'Oculto' }}
                        </span>
                      </td>
                      <td class="text-end">
                        <div class="dropdown">
                          <a
                            class="dropdown-ellipses dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <router-link :to="`/referencias/edit/${referencia._id}`" class="dropdown-item">
                              Editar
                            </router-link>
                            <a class="dropdown-item text-danger" style="cursor: pointer;" v-b-modal="'delete-referencia-' + referencia._id">
                              Eliminar
                            </a>
                          </div>
                        </div>

                        <b-modal centered :id="'delete-referencia-' + referencia._id" hide-footer title-html="<h4 class='card-header-title text-danger'><b>Eliminar referencia?</b></h4>">
                          <div class="text-center my-4">
                            <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                            <h5 class="mt-3">
                              Seguro que quieres eliminar
                              <strong class="text-danger">{{ referencia.titulo }}</strong>?
                            </h5>
                            <p class="text-muted mt-2">
                              Esta acción no se puede deshacer.
                            </p>
                            <div class="mt-4 d-flex justify-content-center gap-2">
                              <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-referencia-' + referencia._id)">Cancelar</b-button>
                              <b-button variant="danger" @click="confirmRemove(referencia._id)">Eliminar</b-button>
                            </div>
                          </div>
                        </b-modal>
                      </td>
                    </tr>
                    <tr v-if="!filteredReferencias.length">
                      <td colspan="9" class="text-center text-muted py-3">Sin referencias</td>
                    </tr>
                  </paginate>
                </table>
              </div>

              <div class="card-footer" v-if="filteredReferencias.length">
                <div class="d-flex justify-content-between">
                  <ul class="list-pagination-prev pagination pagination-tabs card-pagination">
                    <li class="page-item">
                      <a class="page-link ps-0 pe-4 border-end" style="cursor: pointer;" @click="goPrev()">
                        <i class="fe fe-arrow-left me-1"></i> Anterior
                      </a>
                    </li>
                  </ul>

                  <paginate-links
                    @change="onPageChange"
                    for="referenciasPaginate"
                    style="cursor: pointer;"
                    :classes="{ 'ul': ['list-pagination', 'pagination', 'pagination-tabs', 'card-pagination'], 'a': ['page'] }"
                  ></paginate-links>

                  <ul class="list-pagination-next pagination pagination-tabs card-pagination">
                    <li class="page-item">
                      <a class="page-link ps-4 pe-0 border-start" style="cursor: pointer;" @click="goNext()">
                        Siguiente <i class="fe fe-arrow-right ms-1"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';

export default {
  name: 'ReferenciasApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      referencias: [],
      categorias: [],
      filtro: '',
      filtroIndustria: '',
      filtroProducto: '',
      paginate: ['referenciasPaginate'],
      currentPage: 1,
      perPage: 4,
      filterKey: 0
    };
  },
  computed: {
    categoriasIndustria() {
      return this.categorias.filter((item) => item.tipo === 'industria');
    },
    categoriasProducto() {
      return this.categorias.filter((item) => item.tipo === 'producto');
    },
    filteredReferencias() {
      const term = (this.filtro || '').trim().toLowerCase();
      return this.referencias.filter((item) => {
        const matchesText = !term || [
          item.titulo,
          item.comuna,
          item.region,
          item.marca,
          item.modelo,
          item.potencia,
          item.caudal,
          item.presion,
          item.industria_categoria && item.industria_categoria.nombre,
          item.producto_categoria && item.producto_categoria.nombre
        ].some((value) => (value || '').toLowerCase().includes(term));

        const matchesIndustria = !this.filtroIndustria || (item.industria_categoria && item.industria_categoria._id === this.filtroIndustria);
        const matchesProducto = !this.filtroProducto || (item.producto_categoria && item.producto_categoria._id === this.filtroProducto);
        return matchesText && matchesIndustria && matchesProducto;
      });
    }
  },
  watch: {
    filtro() {
      this.resetPagination();
    },
    filtroIndustria() {
      this.resetPagination();
    },
    filtroProducto() {
      this.resetPagination();
    }
  },
  methods: {
    escapeCsv(value) {
      const text = String(value ?? '').replace(/"/g, '""');
      return `"${text}"`;
    },
    getExportRows() {
      return this.filteredReferencias.map((item) => ({
        titulo: item.titulo || '',
        industria: item.industria_categoria ? item.industria_categoria.nombre : '',
        producto: item.producto_categoria ? item.producto_categoria.nombre : '',
        comuna: item.comuna || '',
        region: item.region || '',
        anio: item.anio || '',
        marca: item.marca || '',
        modelo: item.modelo || '',
        potencia: item.potencia || '',
        caudal: item.caudal || '',
        presion: item.presion || '',
        estado: item.estado ? 'Visible' : 'Oculto'
      }));
    },
    fetch() {
      axios.get(this.$url + '/referencia').then((response) => {
        this.referencias = response.data || [];
        this.resetPagination();
      });
      axios.get(this.$url + '/referencia-categoria').then((response) => {
        this.categorias = response.data || [];
      });
    },
    resetPagination() {
      this.currentPage = 1;
      this.$nextTick(() => {
        if (this.$refs.referenciasPaginate && this.$refs.referenciasPaginate.goToPage) {
          this.$refs.referenciasPaginate.goToPage(1);
        }
        this.filterKey += 1;
      });
    },
    onPageChange(toPage) {
      this.currentPage = toPage;
    },
    goPrev() {
      const targetPage = Math.max(1, this.currentPage - 1);
      this.currentPage = targetPage;
      this.$refs.referenciasPaginate.goToPage(targetPage);
    },
    goNext() {
      const maxPage = Math.max(1, Math.ceil(this.filteredReferencias.length / this.perPage));
      const targetPage = Math.min(maxPage, this.currentPage + 1);
      this.currentPage = targetPage;
      this.$refs.referenciasPaginate.goToPage(targetPage);
    },
    downloadCsv() {
      const rows = this.getExportRows();
      if (!rows.length) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No hay referencias para exportar', type: 'error' });
        return;
      }

      const headers = ['Titulo', 'Industria', 'Producto', 'Comuna', 'Region', 'Ano', 'Marca', 'Modelo', 'Potencia', 'Caudal', 'Presion', 'Estado'];
      const csv = [
        headers.join(','),
        ...rows.map((row) => [
          this.escapeCsv(row.titulo),
          this.escapeCsv(row.industria),
          this.escapeCsv(row.producto),
          this.escapeCsv(row.comuna),
          this.escapeCsv(row.region),
          this.escapeCsv(row.anio),
          this.escapeCsv(row.marca),
          this.escapeCsv(row.modelo),
          this.escapeCsv(row.potencia),
          this.escapeCsv(row.caudal),
          this.escapeCsv(row.presion),
          this.escapeCsv(row.estado)
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `referencias-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
    printTable() {
      const rows = this.getExportRows();
      if (!rows.length) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No hay referencias para imprimir', type: 'error' });
        return;
      }

      const htmlRows = rows.map((row) => `
        <tr>
          <td>${row.titulo || '-'}</td>
          <td>${row.industria || '-'}</td>
          <td>${row.producto || '-'}</td>
          <td>${row.comuna || '-'}</td>
          <td>${row.marca || '-'}</td>
          <td>${row.modelo || '-'}</td>
        </tr>
      `).join('');

      const printWindow = window.open('', '_blank', 'width=1100,height=720');
      if (!printWindow) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'El navegador bloqueo la ventana de impresion', type: 'error' });
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Referencias</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; color: #12263f; }
              h1 { font-size: 24px; margin-bottom: 6px; }
              p { color: #6e84a3; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #dfe7f1; padding: 10px 12px; text-align: left; font-size: 13px; vertical-align: top; }
              th { background: #f9fbfd; font-weight: 700; }
            </style>
          </head>
          <body>
            <h1>Listado de referencias</h1>
            <p>Registros: ${rows.length}</p>
            <table>
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Industria</th>
                  <th>Producto</th>
                  <th>Comuna</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                </tr>
              </thead>
              <tbody>${htmlRows}</tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    },
    move(item, direction) {
      axios.put(this.$url + '/referencia/' + item._id + '/reorder', { direction }, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.fetch();
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo reordenar', type: 'error' });
      });
    },
    remove(id) {
      axios.delete(this.$url + '/referencia/' + id, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Referencia eliminada', type: 'success' });
        this.fetch();
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo eliminar', type: 'error' });
      });
    },
    confirmRemove(id) {
      this.$bvModal.hide('delete-referencia-' + id);
      this.remove(id);
    }
  },
  mounted() {
    this.fetch();
  }
};
</script>

<style scoped>
.reference-order-actions {
  min-width: max-content;
}
</style>
