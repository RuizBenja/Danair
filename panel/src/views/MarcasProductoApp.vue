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
                    <h6 class="header-pretitle">Catalogo</h6>
                    <h1 class="header-title">Marcas de producto</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <a class="nav-link active">Todas las marcas</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/marcas-producto/create" class="nav-link">Nueva marca de producto</router-link>
                      </li>
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
                      <input class="form-control list-search" type="search" v-model="filtro" placeholder="Buscar marca de producto">
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr><th>Nombre</th><th>Estado</th><th class="text-end">Acciones</th></tr>
                  </thead>
                  <paginate :key="filterKey" tag="tbody" ref="marcasProducto" name="marcasProducto" :list="filteredMarcas" :per="perPage" class="list fs-base">
                    <tr v-for="item in paginated('marcasProducto')" :key="item._id">
                      <td>
                        <template v-if="editingId === item._id">
                          <input class="form-control form-control-sm" v-model="editForm.nombre" />
                        </template>
                        <template v-else>
                          {{ item.nombre }}
                        </template>
                      </td>
                      <td>
                        <template v-if="editingId === item._id">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" v-model="editForm.estado" />
                            <label class="form-check-label">{{ editForm.estado ? 'Activa' : 'Oculta' }}</label>
                          </div>
                        </template>
                        <template v-else>
                          <span :class="['badge', item.estado ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">{{ item.estado ? 'Activa' : 'Oculta' }}</span>
                        </template>
                      </td>
                      <td class="text-end">
                        <template v-if="editingId === item._id">
                          <div class="d-flex align-items-center justify-content-end gap-2">
                            <button class="btn btn-sm btn-primary" @click="saveInline">Guardar</button>
                            <button class="btn btn-sm btn-outline-secondary" @click="cancelInline">Cancelar</button>
                          </div>
                        </template>
                        <template v-else>
                          <div class="dropdown">
                            <a class="dropdown-ellipses dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="fe fe-more-vertical"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item" style="cursor:pointer" @click="edit(item)">Editar</a>
                              <a class="dropdown-item text-danger" style="cursor:pointer" v-b-modal="'delete-product-brand-' + item._id">Eliminar</a>
                            </div>
                          </div>

                          <b-modal centered :id="'delete-product-brand-' + item._id" hide-footer :title-html="`<h4 class='card-header-title text-danger'><b>Eliminar marca?</b></h4>`">
                            <div class="text-center my-4">
                              <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                              <h5 class="mt-3">
                                Seguro que quieres eliminar la marca
                                <strong class="text-danger">{{ item.nombre }}</strong>?
                              </h5>
                              <p class="text-muted mt-2">
                                Si lo haces, dejara de estar disponible en el selector de productos.
                              </p>
                              <div class="mt-4 d-flex justify-content-center gap-2">
                                <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-product-brand-' + item._id)">Cancelar</b-button>
                                <b-button variant="danger" @click="confirmRemove(item._id)">Eliminar</b-button>
                              </div>
                            </div>
                          </b-modal>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="!filteredMarcas.length"><td colspan="3" class="text-center text-muted py-3">Sin marcas de producto</td></tr>
                  </paginate>
                </table>
              </div>

              <div class="card-footer" v-if="filteredMarcas.length">
                <div class="d-flex justify-content-between">
                  <ul class="list-pagination-prev pagination pagination-tabs card-pagination">
                    <li class="page-item">
                      <a class="page-link ps-0 pe-4 border-end" style="cursor:pointer" @click="goPrev()">
                        <i class="fe fe-arrow-left me-1"></i> Anterior
                      </a>
                    </li>
                  </ul>

                  <paginate-links @change="onPageChange" for="marcasProducto" style="cursor:pointer"
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

export default {
  name: 'MarcasProductoApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      marcas: [],
      filtro: '',
      paginate: ['marcasProducto'],
      currentPage: 1,
      perPage: 5,
      filterKey: 0,
      editingId: null,
      editForm: { nombre: '', estado: true }
    };
  },
  methods: {
    fetch() {
      axios.get(this.$url + '/marca-producto').then((r) => {
        this.marcas = r.data || [];
        this.currentPage = 1;
        if (this.$refs.marcasProducto && this.$refs.marcasProducto.goToPage) this.$refs.marcasProducto.goToPage(1);
        this.filterKey += 1;
      });
    },
    onPageChange(toPage) { this.currentPage = toPage; },
    goPrev() { if (this.currentPage >= 2) this.$refs.marcasProducto.goToPage(this.currentPage--); else this.$refs.marcasProducto.goToPage(1); },
    goNext() { if (this.currentPage <= Math.ceil(this.filteredMarcas.length / this.perPage)) this.$refs.marcasProducto.goToPage(this.currentPage++); else this.$refs.marcasProducto.goToPage(Math.max(1, Math.ceil(this.filteredMarcas.length / this.perPage))); },
    edit(item) {
      this.editingId = item._id;
      this.editForm = { _id: item._id, nombre: item.nombre, estado: item.estado };
    },
    cancelInline() {
      this.editingId = null;
      this.editForm = { nombre: '', estado: true };
    },
    saveInline() {
      if (!this.editForm.nombre) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Ingresa el nombre', type: 'error' });
        return;
      }
      axios.put(this.$url + '/marca-producto/' + this.editingId, this.editForm, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Marca de producto actualizada', type: 'success' });
        this.cancelInline();
        this.fetch();
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error?.response?.data?.message || 'No se pudo actualizar',
          type: 'error'
        });
      });
    },
    remove(id) {
      axios.delete(this.$url + '/marca-producto/' + id, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.fetch();
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Marca de producto eliminada', type: 'success' });
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo eliminar', type: 'error' });
      });
    },
    confirmRemove(id) {
      this.$bvModal.hide('delete-product-brand-' + id);
      this.remove(id);
    }
  },
  computed: {
    filteredMarcas() {
      const term = this.filtro.trim().toLowerCase();
      if (!term) return this.marcas;
      return this.marcas.filter((item) => (item.nombre || '').toLowerCase().includes(term));
    },
  },
  watch: {
    filtro() {
      this.currentPage = 1;
      if (this.$refs.marcasProducto && this.$refs.marcasProducto.goToPage) this.$refs.marcasProducto.goToPage(1);
      this.filterKey += 1;
    }
  },
  mounted() {
    this.fetch();
  }
};
</script>
