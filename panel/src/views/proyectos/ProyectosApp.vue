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
                    <h6 class="header-pretitle">Contenido web</h6>
                    <h1 class="header-title">Proyectos destacados</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <a class="nav-link active">Todos los proyectos destacados</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/proyectos/create" class="nav-link">Nuevo proyecto destacado</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="row align-items-center g-3">
                  <div class="col-12 col-md">
                    <div class="input-group input-group-flush input-group-merge input-group-reverse">
                      <input
                        class="form-control list-search"
                        type="search"
                        v-model="filtro"
                        placeholder="Buscar proyecto destacado"
                      >
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>
                  <div class="col-12 col-md-auto">
                    <select v-model="filtroDestacado" class="form-select">
                      <option value="">Todos</option>
                      <option value="destacado">Solo destacados</option>
                      <option value="normal">Solo no destacados</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Titulo</th>
                      <th>Extracto</th>
                      <th>Orden</th>
                      <th>Destacado</th>
                      <th>Estado</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>

                  <paginate
                    :key="filterKey"
                    tag="tbody"
                    ref="proyectosPaginate"
                    name="proyectosPaginate"
                    :list="filteredProyectos"
                    :per="perPage"
                    class="list fs-base"
                  >
                    <tr v-for="proyecto in paginated('proyectosPaginate')" :key="proyecto._id">
                      <td style="width: 90px;">
                        <img
                          v-if="proyecto.imagen"
                          :src="$url + '/proyecto/imagen/' + proyecto.imagen"
                          style="height: 44px; width: 64px; object-fit: cover; border-radius: 0.5rem;"
                        >
                      </td>
                      <td>{{ proyecto.titulo }}</td>
                      <td style="min-width: 320px;">
                        <div class="extracto-clamp">{{ proyecto.extracto }}</div>
                      </td>
                      <td class="text-nowrap">
                        <div class="d-flex align-items-center gap-2 project-order-actions">
                          <button class="btn btn-sm btn-outline-secondary" @click="move(proyecto, 'up')" title="Subir" aria-label="Subir">
                            <i class="fe fe-chevron-up"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" @click="move(proyecto, 'down')" title="Bajar" aria-label="Bajar">
                            <i class="fe fe-chevron-down"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <span :class="['badge', proyecto.destacado ? 'bg-info-soft text-info' : 'bg-secondary-soft text-secondary']">
                          {{ proyecto.destacado ? 'Si' : 'No' }}
                        </span>
                      </td>
                      <td>
                        <span :class="['badge', proyecto.estado ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">
                          {{ proyecto.estado ? 'Visible' : 'Oculto' }}
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
                            <router-link :to="`/proyectos/edit/${proyecto._id}`" class="dropdown-item">
                              Editar
                            </router-link>
                            <a class="dropdown-item text-danger" style="cursor: pointer;" v-b-modal="'delete-proyecto-' + proyecto._id">
                              Eliminar
                            </a>
                          </div>
                        </div>

                        <b-modal centered :id="'delete-proyecto-' + proyecto._id" hide-footer title-html="<h4 class='card-header-title text-danger'><b>Eliminar proyecto?</b></h4>">
                          <div class="text-center my-4">
                            <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                            <h5 class="mt-3">
                              Seguro que quieres eliminar
                              <strong class="text-danger">{{ proyecto.titulo }}</strong>?
                            </h5>
                            <p class="text-muted mt-2">
                              Esta accion no se puede deshacer.
                            </p>
                            <div class="mt-4 d-flex justify-content-center gap-2">
                              <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-proyecto-' + proyecto._id)">Cancelar</b-button>
                              <b-button variant="danger" @click="confirmRemove(proyecto._id)">Eliminar</b-button>
                            </div>
                          </div>
                        </b-modal>
                      </td>
                    </tr>
                    <tr v-if="!filteredProyectos.length">
                      <td colspan="7" class="text-center text-muted py-3">Sin proyectos destacados</td>
                    </tr>
                  </paginate>
                </table>
              </div>

              <div class="card-footer" v-if="filteredProyectos.length">
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
                    for="proyectosPaginate"
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
  name: 'ProyectosApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      proyectos: [],
      filtro: '',
      filtroDestacado: '',
      paginate: ['proyectosPaginate'],
      currentPage: 1,
      perPage: 3,
      filterKey: 0
    };
  },
  computed: {
    filteredProyectos() {
      const term = (this.filtro || '').trim().toLowerCase();
      return this.proyectos.filter((item) => {
        const matchesText = !term || [item.titulo, item.extracto].some((value) => (value || '').toLowerCase().includes(term));
        const matchesDestacado = !this.filtroDestacado
          || (this.filtroDestacado === 'destacado' && item.destacado)
          || (this.filtroDestacado === 'normal' && !item.destacado);
        return matchesText && matchesDestacado;
      });
    }
  },
  watch: {
    filtro() {
      this.resetPagination();
    },
    filtroDestacado() {
      this.resetPagination();
    }
  },
  methods: {
    fetch() {
      axios.get(this.$url + '/proyecto').then((response) => {
        this.proyectos = response.data || [];
        this.currentPage = 1;
        if (this.$refs.proyectosPaginate && this.$refs.proyectosPaginate.goToPage) {
          this.$refs.proyectosPaginate.goToPage(1);
        }
        this.filterKey += 1;
      });
    },
    resetPagination() {
      this.currentPage = 1;
      this.$nextTick(() => {
        if (this.$refs.proyectosPaginate && this.$refs.proyectosPaginate.goToPage) {
          this.$refs.proyectosPaginate.goToPage(1);
        }
        this.filterKey += 1;
      });
    },
    onPageChange(toPage) {
      this.currentPage = toPage;
    },
    goPrev() {
      if (this.currentPage >= 2) this.$refs.proyectosPaginate.goToPage(this.currentPage--);
      else this.$refs.proyectosPaginate.goToPage(1);
    },
    goNext() {
      const maxPage = Math.max(1, Math.ceil(this.filteredProyectos.length / this.perPage));
      if (this.currentPage <= maxPage) this.$refs.proyectosPaginate.goToPage(this.currentPage++);
      else this.$refs.proyectosPaginate.goToPage(maxPage);
    },
    move(item, direction) {
      axios.put(this.$url + '/proyecto/' + item._id + '/reorder', { direction }, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.fetch();
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo reordenar', type: 'error' });
      });
    },
    remove(id) {
      axios.delete(this.$url + '/proyecto/' + id, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Proyecto eliminado', type: 'success' });
        this.fetch();
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo eliminar', type: 'error' });
      });
    },
    confirmRemove(id) {
      this.$bvModal.hide('delete-proyecto-' + id);
      this.remove(id);
    }
  },
  mounted() {
    this.fetch();
  }
}
</script>

<style scoped>
.extracto-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.55;
}

.project-order-actions {
  min-width: max-content;
}
</style>
