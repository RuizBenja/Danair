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
                  <div class="col">
                    <div class="input-group input-group-flush input-group-merge input-group-reverse">
                      <input class="form-control list-search" type="search" placeholder="Buscar por titulo, categoria, subcategoria, marca o modelo" v-model="Filtro">
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
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
