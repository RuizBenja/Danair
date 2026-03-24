<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
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
                        <router-link to="/referencias" class="nav-link">Todas las referencias</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Categorías de referencias</a>
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
              <div class="card-body border-bottom">
                <div class="row g-3 align-items-end">
                  <div class="col-12 col-lg-5">
                    <label class="form-label">Nombre</label>
                    <input ref="nombre" class="form-control" v-model="form.nombre" placeholder="Ej: Agroindustria" />
                    <p v-if="errors.nombre" class="text-danger small mt-1">{{ errors.nombre }}</p>
                  </div>

                  <div class="col-12 col-lg-4">
                    <label class="form-label">Tipo</label>
                    <select ref="tipo" class="form-select" v-model="form.tipo">
                      <option value="industria">Industria</option>
                      <option value="producto">Producto</option>
                    </select>
                    <p v-if="errors.tipo" class="text-danger small mt-1">{{ errors.tipo }}</p>
                  </div>

                  <div class="col-12 col-lg-3">
                    <div class="form-check form-switch mt-lg-4 pt-lg-2">
                      <input class="form-check-input" type="checkbox" v-model="form.estado" />
                      <label class="form-check-label">Visible</label>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2 mt-3">
                  <button v-if="form._id" class="btn btn-danger" type="button" @click="resetForm">Cancelar</button>
                  <button class="btn btn-primary" type="button" @click="save">
                    {{ form._id ? 'Actualizar categoría' : 'Crear categoría' }}
                  </button>
                </div>
              </div>

              <div class="card-header">
                <div class="row align-items-center g-3">
                  <div class="col-12 col-lg">
                    <div class="input-group input-group-flush input-group-merge input-group-reverse">
                      <input
                        class="form-control list-search"
                        type="search"
                        v-model="filtro"
                        placeholder="Buscar categoría"
                      >
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>

                  <div class="col-12 col-md-4 col-lg-3">
                    <select v-model="filtroTipo" class="form-select">
                      <option value="">Todos los tipos</option>
                      <option value="industria">Industria</option>
                      <option value="producto">Producto</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Orden</th>
                      <th>Estado</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>

                  <paginate
                    :key="filterKey"
                    tag="tbody"
                    ref="categoriasPaginate"
                    name="categoriasPaginate"
                    :list="filteredCategorias"
                    :per="perPage"
                    class="list fs-base"
                  >
                    <tr v-for="categoria in paginated('categoriasPaginate')" :key="categoria._id">
                      <td>{{ categoria.nombre }}</td>
                      <td class="text-capitalize">{{ categoria.tipo }}</td>
                      <td class="text-nowrap">
                        <div class="d-flex align-items-center gap-2 reference-order-actions">
                          <button class="btn btn-sm btn-outline-secondary" @click="move(categoria, 'up')" title="Subir" aria-label="Subir">
                            <i class="fe fe-chevron-up"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" @click="move(categoria, 'down')" title="Bajar" aria-label="Bajar">
                            <i class="fe fe-chevron-down"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <span :class="['badge', categoria.estado ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">
                          {{ categoria.estado ? 'Visible' : 'Oculto' }}
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
                            <a class="dropdown-item" style="cursor: pointer;" @click="edit(categoria)">Editar</a>
                            <a class="dropdown-item text-danger" style="cursor: pointer;" v-b-modal="'delete-categoria-referencia-' + categoria._id">
                              Eliminar
                            </a>
                          </div>
                        </div>

                        <b-modal centered :id="'delete-categoria-referencia-' + categoria._id" hide-footer title-html="<h4 class='card-header-title text-danger'><b>Eliminar categoría?</b></h4>">
                          <div class="text-center my-4">
                            <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                            <h5 class="mt-3">
                              Seguro que quieres eliminar
                              <strong class="text-danger">{{ categoria.nombre }}</strong>?
                            </h5>
                            <p class="text-muted mt-2">
                              Si esta categoría tiene referencias asociadas, primero conviene reasignarlas.
                            </p>
                            <div class="mt-4 d-flex justify-content-center gap-2">
                              <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-categoria-referencia-' + categoria._id)">Cancelar</b-button>
                              <b-button variant="danger" @click="confirmRemove(categoria._id)">Eliminar</b-button>
                            </div>
                          </div>
                        </b-modal>
                      </td>
                    </tr>

                    <tr v-if="!filteredCategorias.length">
                      <td colspan="5" class="text-center text-muted py-3">Sin categorías</td>
                    </tr>
                  </paginate>
                </table>
              </div>

              <div class="card-footer" v-if="filteredCategorias.length">
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
                    for="categoriasPaginate"
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

function createInitialForm() {
  return {
    _id: '',
    nombre: '',
    tipo: 'industria',
    estado: true
  };
}

export default {
  name: 'ReferenciasCategoriasApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      categorias: [],
      filtro: '',
      filtroTipo: '',
      form: createInitialForm(),
      errors: {},
      paginate: ['categoriasPaginate'],
      currentPage: 1,
      perPage: 4,
      filterKey: 0
    };
  },
  computed: {
    filteredCategorias() {
      const term = (this.filtro || '').trim().toLowerCase();
      return this.categorias.filter((item) => {
        const matchesText = !term || [item.nombre, item.tipo].some((value) => (value || '').toLowerCase().includes(term));
        const matchesTipo = !this.filtroTipo || item.tipo === this.filtroTipo;
        return matchesText && matchesTipo;
      });
    }
  },
  watch: {
    filtro() {
      this.resetPagination();
    },
    filtroTipo() {
      this.resetPagination();
    }
  },
  methods: {
    fetch() {
      axios.get(this.$url + '/referencia-categoria').then((response) => {
        this.categorias = response.data || [];
        this.resetPagination();
      });
    },
    resetPagination() {
      this.currentPage = 1;
      this.$nextTick(() => {
        if (this.$refs.categoriasPaginate && this.$refs.categoriasPaginate.goToPage) {
          this.$refs.categoriasPaginate.goToPage(1);
        }
        this.filterKey += 1;
      });
    },
    onPageChange(toPage) {
      this.currentPage = toPage;
    },
    goPrev() {
      if (this.currentPage >= 2) this.$refs.categoriasPaginate.goToPage(this.currentPage--);
      else this.$refs.categoriasPaginate.goToPage(1);
    },
    goNext() {
      const maxPage = Math.max(1, Math.ceil(this.filteredCategorias.length / this.perPage));
      if (this.currentPage <= maxPage) this.$refs.categoriasPaginate.goToPage(this.currentPage++);
      else this.$refs.categoriasPaginate.goToPage(maxPage);
    },
    validate() {
      this.errors = {};
      if (!this.form.nombre || !this.form.nombre.trim()) this.errors.nombre = 'Ingresa el nombre';
      if (!this.form.tipo) this.errors.tipo = 'Selecciona el tipo';
      return Object.keys(this.errors).length === 0;
    },
    focusFirstError() {
      const order = ['nombre', 'tipo'];
      const firstKey = order.find((key) => this.errors[key]);
      if (!firstKey) return;
      this.$nextTick(() => {
        const target = this.$refs[firstKey];
        const node = Array.isArray(target) ? target[0] : target;
        if (!node) return;
        const container = node.closest('.col-12, .col-lg-3, .col-lg-4, .col-lg-5') || node;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof node.focus === 'function') node.focus();
      });
    },
    save() {
      if (!this.validate()) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Falta completar campos obligatorios', type: 'error' });
        this.focusFirstError();
        return;
      }

      const url = this.form._id ? this.$url + '/referencia-categoria/' + this.form._id : this.$url + '/referencia-categoria';
      const method = this.form._id ? 'put' : 'post';

      axios[method](url, this.form, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({
          group: 'foo',
          title: 'EXITO',
          text: this.form._id ? 'Categoría actualizada' : 'Categoría creada',
          type: 'success'
        });
        this.resetForm();
        this.fetch();
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error.response && error.response.data && error.response.data.message ? error.response.data.message : 'No se pudo guardar',
          type: 'error'
        });
      });
    },
    edit(categoria) {
      this.form = {
        _id: categoria._id,
        nombre: categoria.nombre || '',
        tipo: categoria.tipo || 'industria',
        estado: categoria.estado
      };
      this.errors = {};
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    resetForm() {
      this.form = createInitialForm();
      this.errors = {};
    },
    move(item, direction) {
      axios.put(this.$url + '/referencia-categoria/' + item._id + '/reorder', { direction }, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.fetch();
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo reordenar', type: 'error' });
      });
    },
    remove(id) {
      axios.delete(this.$url + '/referencia-categoria/' + id, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Categoría eliminada', type: 'success' });
        if (this.form._id === id) this.resetForm();
        this.fetch();
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error.response && error.response.data && error.response.data.message ? error.response.data.message : 'No se pudo eliminar',
          type: 'error'
        });
      });
    },
    confirmRemove(id) {
      this.$bvModal.hide('delete-categoria-referencia-' + id);
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
