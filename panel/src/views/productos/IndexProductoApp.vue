<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <div class="header mt-md-5">
              <div class="header-body">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">Productos</h6>
                    <h1 class="header-title">Productos</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item"><a class="nav-link active">Todos los productos</a></li>
                      <li class="nav-item"><router-link to="/producto/create" class="nav-link">Nuevo producto</router-link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col-12 col-md">
                    <div class="input-group input-group-flush input-group-merge input-group-reverse">
                      <input class="form-control list-search" type="search" placeholder="Buscar por titulo, categoria, subcategoria, marca o modelo" v-model="Filtro">
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>
                  <div class="col-12 col-md-auto mt-3 mt-md-0">
                    <div class="d-flex gap-2">
                      <button class="btn btn-white btn-sm" type="button" @click="downloadCsv">
                        <i class="fe fe-download me-1"></i> CSV
                      </button>
                      <button class="btn btn-white btn-sm" type="button" @click="printTable">
                        <i class="fe fe-printer me-1"></i> Imprimir
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-body">
                <template v-if="loadData">
                  <div class="text-center py-5"><div class="spinner-border" role="status"></div></div>
                </template>
                <template v-else>
                  <paginate v-if="filteredProductos.length" :key="filterKey" tag="ul" ref="productos" name="productos" :list="filteredProductos" :per="perPage" class="list-group list-group-flush">
                    <li class="list-group-item" v-for="item in paginated('productos')" :key="item._id">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <a class="avatar avatar-lg">
                            <img :src="$url + '/obtener_portada_producto/' + item.portada" alt="portada" class="avatar-img rounded">
                          </a>
                        </div>
                        <div class="col ms-n2">
                          <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                            <h4 class="mb-0 name">{{ item.titulo }}</h4>
                            <span :class="['badge', item.estado ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">
                              {{ item.estado ? 'Publicado' : 'Oculto' }}
                            </span>
                            <span v-if="item.arriendo" class="badge bg-info-soft text-info">
                              Arriendo
                            </span>
                          </div>
                          <p class="card-text small text-muted mb-1">
                            {{ item.categoria }}
                            <span v-if="item.subcategoria"> - {{ item.subcategoria }}</span>
                            <span v-if="item.marca"> - {{ item.marca }}</span>
                            <span v-if="item.serie"> - {{ item.serie }}</span>
                            <span v-if="item.modelo"> - {{ item.modelo }}</span>
                          </p>
                          <p class="card-text small text-muted mb-1">
                            <span v-if="item.tecnologia">Tecnologia: {{ item.tecnologia }}</span>
                            <span v-if="item.potencia" class="ms-2">Potencia: {{ item.potencia }}</span>
                            <span v-if="item.presion" class="ms-2">Presion: {{ item.presion }}</span>
                          </p>
                          <p class="card-text small text-muted mb-0">Creacion {{ convertDate(item.createdAt) }}</p>
                        </div>
                        <div class="col-auto">
                          <div class="dropdown">
                            <a href="#" class="dropdown-ellipses dropdown-toggle" data-bs-toggle="dropdown">
                              <i class="fe fe-more-vertical"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                              <router-link :to="{ name: 'producto-edit', params: { id: item._id } }" class="dropdown-item">Editar</router-link>
                              <router-link :to="{ name: 'producto-galeria', params: { id: item._id } }" class="dropdown-item">Galeria</router-link>
                              <a class="dropdown-item text-danger" style="cursor:pointer" v-b-modal="'delete-' + item._id">Eliminar</a>
                              <b-modal centered :id="'delete-' + item._id" hide-footer title-html="<h4 class='card-header-title text-danger'><b>Eliminar producto?</b></h4>">
                                <div class="text-center my-4">
                                  <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                                  <h5 class="mt-3">Seguro que quieres eliminar <strong class="text-danger">{{ item.titulo }}</strong>?</h5>
                                  <div class="mt-4 d-flex justify-content-center gap-2">
                                    <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-' + item._id)">Cancelar</b-button>
                                    <b-button variant="danger" @click="eliminarProducto(item._id)">Eliminar</b-button>
                                  </div>
                                </div>
                              </b-modal>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </paginate>
                  <div v-else class="text-center py-4 text-danger">No hay productos para mostrar.</div>
                </template>
              </div>
              <div class="card-footer">
                <div class="d-flex justify-content-between">
                  <ul class="list-pagination-prev pagination pagination-tabs card-pagination">
                    <li class="page-item">
                      <a class="page-link ps-0 pe-4 border-end" style="cursor:pointer" @click="goPrev()">
                        <i class="fe fe-arrow-left me-1"></i> Anterior
                      </a>
                    </li>
                  </ul>

                  <paginate-links @change="onPageChange" for="productos" style="cursor:pointer"
                    :classes="{ 'ul': ['list-pagination', 'pagination', 'pagination-tabs', 'card-pagination'], 'a': ['page'] }"></paginate-links>

                  <ul class="list-pagination-next pagination pagination-tabs card-pagination">
                    <li class="page-item">
                      <a class="page-link ps-4 pe-0 border-start" style="cursor:pointer" @click="goNext()">
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
import moment from 'moment';

export default {
  name: 'IndexProductoApp',
  data() {
    return {
      productos: [],
      allProductos: [],
      Filtro: '',
      loadData: false,
      paginate: ['productos'],
      currentPage: 1,
      perPage: 5,
      filterKey: 0,
    };
  },
  methods: {
    escapeCsv(value) {
      const text = String(value ?? '').replace(/"/g, '""');
      return `"${text}"`;
    },
    getExportRows() {
      return this.filteredProductos.map((item) => ({
        titulo: item.titulo || '',
        categoria: item.categoria || '',
        subcategoria: item.subcategoria || '',
        marca: item.marca || '',
        serie: item.serie || '',
        modelo: item.modelo || '',
        tecnologia: item.tecnologia || '',
        potencia: item.potencia || '',
        presion: item.presion || '',
        estado: item.estado ? 'Publicado' : 'Oculto',
        arriendo: item.arriendo ? 'Si' : 'No'
      }));
    },
    initData() {
      this.loadData = true;
      axios.get(this.$url + '/listar_productos_admin/' + (this.Filtro || ''), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.token,
        }
      }).then((result) => {
        this.productos = result.data || [];
        if (!this.Filtro) this.allProductos = result.data || [];
        this.currentPage = 1;
        if (this.$refs.productos && this.$refs.productos.goToPage) this.$refs.productos.goToPage(1);
        this.filterKey += 1;
        this.loadData = false;
      }).catch(() => {
        this.loadData = false;
      });
    },
    onPageChange(toPage) { this.currentPage = toPage; },
    goPrev() { if (this.currentPage >= 2) this.$refs.productos.goToPage(this.currentPage--); else this.$refs.productos.goToPage(1); },
    goNext() { if (this.currentPage <= Math.ceil(this.filteredProductos.length / this.perPage)) this.$refs.productos.goToPage(this.currentPage++); else this.$refs.productos.goToPage(Math.max(1, Math.ceil(this.filteredProductos.length / this.perPage))); },
    convertDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    downloadCsv() {
      const rows = this.getExportRows();
      if (!rows.length) {
        this.$notify({ group: 'foo', title: 'ERROR', type: 'error', text: 'No hay productos para exportar' });
        return;
      }

      const headers = ['Titulo', 'Categoria', 'Subcategoria', 'Marca', 'Serie', 'Modelo', 'Tecnologia', 'Potencia', 'Presion', 'Estado', 'Arriendo'];
      const csv = [
        headers.join(','),
        ...rows.map((row) => [
          this.escapeCsv(row.titulo),
          this.escapeCsv(row.categoria),
          this.escapeCsv(row.subcategoria),
          this.escapeCsv(row.marca),
          this.escapeCsv(row.serie),
          this.escapeCsv(row.modelo),
          this.escapeCsv(row.tecnologia),
          this.escapeCsv(row.potencia),
          this.escapeCsv(row.presion),
          this.escapeCsv(row.estado),
          this.escapeCsv(row.arriendo)
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productos-${moment().format('YYYY-MM-DD')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
    printTable() {
      const rows = this.getExportRows();
      if (!rows.length) {
        this.$notify({ group: 'foo', title: 'ERROR', type: 'error', text: 'No hay productos para imprimir' });
        return;
      }

      const htmlRows = rows.map((row) => `
        <tr>
          <td>${row.titulo || '-'}</td>
          <td>${row.categoria || '-'}</td>
          <td>${row.marca || '-'}</td>
          <td>${row.modelo || '-'}</td>
          <td>${row.estado}</td>
          <td>${row.arriendo}</td>
        </tr>
      `).join('');

      const printWindow = window.open('', '_blank', 'width=1100,height=720');
      if (!printWindow) {
        this.$notify({ group: 'foo', title: 'ERROR', type: 'error', text: 'El navegador bloqueo la ventana de impresion' });
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Productos</title>
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
            <h1>Listado de productos</h1>
            <p>Registros: ${rows.length}</p>
            <table>
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Categoria</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Estado</th>
                  <th>Arriendo</th>
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
    eliminarProducto(id) {
      axios.delete(this.$url + '/eliminar_producto_admin/' + id, {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then(() => {
        this.$bvModal.hide('delete-' + id);
        this.initData();
        this.$notify({ group: 'foo', title: 'EXITO', type: 'success', text: 'Producto eliminado' });
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', type: 'error', text: 'No se pudo eliminar' });
      });
    }
  },
  computed: {
    filteredProductos() {
      const q = (this.Filtro || '').trim().toLowerCase();
      if (!q) return this.productos;
      return this.productos.filter((p) => {
        return [p.titulo, p.categoria, p.subcategoria, p.marca, p.serie, p.modelo, p.tecnologia]
          .map((value) => (value || '').toLowerCase())
          .some((value) => value.includes(q));
      });
    },
  },
  watch: {
    Filtro(val) {
      this.currentPage = 1;
      if (!val) this.productos = this.allProductos;
      if (this.$refs.productos && this.$refs.productos.goToPage) this.$refs.productos.goToPage(1);
      this.filterKey += 1;
    }
  },
  beforeMount() {
    this.initData();
  },
  components: { Sidebar, TopNav }
};
</script>
