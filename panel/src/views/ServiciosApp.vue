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
                    <h1 class="header-title">Servicios</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <a class="nav-link active">Todos los servicios</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/servicios/create" class="nav-link">Nuevo servicio</router-link>
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
                      <input
                        class="form-control list-search"
                        type="search"
                        v-model="filtro"
                        placeholder="Buscar servicio"
                      >
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
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
                      <th>Estado</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>

                  <paginate
                    :key="filterKey"
                    tag="tbody"
                    ref="serviciosPaginate"
                    name="serviciosPaginate"
                    :list="filteredServicios"
                    :per="perPage"
                    class="list fs-base"
                  >
                    <tr v-for="servicio in paginated('serviciosPaginate')" :key="servicio._id">
                      <td style="width: 90px;">
                        <img
                          v-if="servicio.imagen"
                          :src="$url + '/servicio/imagen/' + servicio.imagen"
                          style="height: 44px; width: 64px; object-fit: cover; border-radius: 0.5rem;"
                        >
                      </td>
                      <td>{{ servicio.titulo }}</td>
                      <td style="min-width: 320px;">
                        <div class="extracto-clamp">{{ servicio.extracto }}</div>
                      </td>
                      <td class="text-nowrap">
                        <div class="d-flex align-items-center gap-2 service-order-actions">
                          <button class="btn btn-sm btn-outline-secondary" @click="move(servicio, 'up')" title="Subir" aria-label="Subir">
                            <i class="fe fe-chevron-up"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" @click="move(servicio, 'down')" title="Bajar" aria-label="Bajar">
                            <i class="fe fe-chevron-down"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <span :class="['badge', servicio.estado ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">
                          {{ servicio.estado ? 'Visible' : 'Oculto' }}
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
                            <router-link :to="`/servicios/edit/${servicio._id}`" class="dropdown-item">
                              Editar
                            </router-link>
                            <a class="dropdown-item text-danger" style="cursor: pointer;" v-b-modal="'delete-service-' + servicio._id">
                              Eliminar
                            </a>
                          </div>
                        </div>

                        <b-modal centered :id="'delete-service-' + servicio._id" hide-footer title-html="<h4 class='card-header-title text-danger'><b>Eliminar servicio?</b></h4>">
                          <div class="text-center my-4">
                            <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                            <h5 class="mt-3">
                              Seguro que quieres eliminar
                              <strong class="text-danger">{{ servicio.titulo }}</strong>?
                            </h5>
                            <p class="text-muted mt-2">
                              Esta accion no se puede deshacer.
                            </p>
                            <div class="mt-4 d-flex justify-content-center gap-2">
                              <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-service-' + servicio._id)">Cancelar</b-button>
                              <b-button variant="danger" @click="confirmRemove(servicio._id)">Eliminar</b-button>
                            </div>
                          </div>
                        </b-modal>
                      </td>
                    </tr>
                    <tr v-if="!filteredServicios.length">
                      <td colspan="6" class="text-center text-muted py-3">Sin servicios</td>
                    </tr>
                  </paginate>
                </table>
              </div>

              <div class="card-footer" v-if="filteredServicios.length">
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
                    for="serviciosPaginate"
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
  name: 'ServiciosApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      servicios: [],
      filtro: '',
      paginate: ['serviciosPaginate'],
      currentPage: 1,
      perPage: 3,
      filterKey: 0
    };
  },
  computed: {
    filteredServicios() {
      const term = (this.filtro || '').trim().toLowerCase();
      if (!term) return this.servicios;
      return this.servicios.filter((item) =>
        [item.titulo, item.extracto].some((value) => (value || '').toLowerCase().includes(term))
      );
    }
  },
  watch: {
    filtro() {
      this.currentPage = 1;
      this.$nextTick(() => {
        if (this.$refs.serviciosPaginate && this.$refs.serviciosPaginate.goToPage) {
          this.$refs.serviciosPaginate.goToPage(1);
        }
        this.filterKey += 1;
      });
    }
  },
  methods: {
    fetch() {
      axios.get(this.$url + '/servicio').then((response) => {
        this.servicios = response.data || [];
        this.currentPage = 1;
        if (this.$refs.serviciosPaginate && this.$refs.serviciosPaginate.goToPage) {
          this.$refs.serviciosPaginate.goToPage(1);
        }
        this.filterKey += 1;
      });
    },
    onPageChange(toPage) {
      this.currentPage = toPage;
    },
    goPrev() {
      if (this.currentPage >= 2) this.$refs.serviciosPaginate.goToPage(this.currentPage--);
      else this.$refs.serviciosPaginate.goToPage(1);
    },
    goNext() {
      const maxPage = Math.max(1, Math.ceil(this.filteredServicios.length / this.perPage));
      if (this.currentPage <= maxPage) this.$refs.serviciosPaginate.goToPage(this.currentPage++);
      else this.$refs.serviciosPaginate.goToPage(maxPage);
    },
    move(item, direction) {
      axios.put(this.$url + '/servicio/' + item._id + '/reorder', { direction }, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.fetch();
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo reordenar', type: 'error' });
      });
    },
    remove(id) {
      axios.delete(this.$url + '/servicio/' + id, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Servicio eliminado', type: 'success' });
        this.fetch();
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo eliminar', type: 'error' });
      });
    },
    confirmRemove(id) {
      this.$bvModal.hide('delete-service-' + id);
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

.service-order-actions {
  min-width: max-content;
}
</style>
