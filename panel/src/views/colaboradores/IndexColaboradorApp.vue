<template>
  <div>
    <Sidebar />
    <div class="main-content">

      <TopNav />

      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">

            <!-- Header -->
            <div class="header mt-md-5">
              <div class="header-body">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">Colaboradores</h6>
                    <h1 class="header-title">Colaboradores</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <a class="nav-link active">Todos los colaboradores</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/colaborador/create" class="nav-link">Nuevo colaborador</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de colaboradores -->
            <div class="tab-content">
              <div class="tab-pane fade show active" id="contactsListPane" role="tabpanel">

                <div class="card" id="contactsList">
                  <div class="card-header">
                    <div class="row align-items-center">
                      <div class="col">
                        <form>
                          <div class="input-group input-group-flush input-group-merge input-group-reverse">
                            <input class="form-control list-search" type="search" v-model="Filtro"
                              placeholder="Buscar Colaborador">
                            <span class="input-group-text"><i class="fe fe-search"></i></span>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <table class="table table-sm table-hover table-nowrap card-table">
                      <thead>
                        <tr>
                          <th>Nombres</th>
                          <th>Cargo</th>
                          <th>Email</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>

                      <paginate :key="filterKey" tag="tbody" ref="colaboradores" name="colaboradores" :list="colaboradores"
                        :per="perPage" class="list fs-base">
                        <tr v-if="!load_data" v-for="item in paginated('colaboradores')" :key="item._id">
                          <td>
                            <div class="avatar avatar-xs align-middle me-2">
                              <img class="avatar-img rounded-circle" :src="getAvatarUrl(item.avatar)" alt="...">
                            </div>
                            <a class="item-name text-reset">{{ item.nombres }} {{ item.apellidos }}</a>
                          </td>
                          <td>{{ item.rol }}</td>
                          <td>{{ item.email }}</td>
                          <td>
                            <span v-if="item.estado" class="badge bg-success-soft text-success">Activo</span>
                            <span v-else class="badge bg-danger-soft text-danger">Desactivado</span>
                          </td>
                          <td class="text-end">
                            <div class="dropdown">
                              <a class="dropdown-ellipses dropdown-toggle" href="#" role="button"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fe fe-more-vertical"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                                <router-link :to="{ name: 'colaborador-edit', params: { id: item._id } }"
                                  class="dropdown-item">Editar</router-link>
                                <a style="cursor:pointer" class="dropdown-item" v-b-modal="'toggle-' + item._id">
                                  <span v-if="item.estado">Desactivar</span>
                                  <span v-else>Activar</span>
                                </a>
                                <a style="cursor:pointer" class="dropdown-item" v-b-modal="'reset-' + item._id">
                                  Resetear contraseña
                                </a>
                              </div>
                            </div>

                            <!-- Modal activar/desactivar -->
                            <b-modal centered :id="'toggle-' + item._id" hide-footer
                              :title-html="`<h4 class='card-header-title ${item.estado ? 'text-danger' : 'text-success'}'><b>${item.estado ? '¿Desactivar usuario?' : '¿Activar usuario?'}</b></h4>`">
                              <div class="text-center my-4">
                                <b-icon icon="exclamation-triangle-fill"
                                  :variant="item.estado ? 'danger' : 'success'" font-scale="2.5"></b-icon>
                                <h5 class="mt-3">
                                  {{ item.estado ? '¿Seguro que quieres desactivar al usuario ' : '¿Seguro que quieres activar al usuario ' }}
                                  <strong :class="item.estado ? 'text-danger' : 'text-success'">{{ item.nombres }} {{ item.apellidos }}</strong>?
                                </h5>
                                <p class="text-muted mt-2">
                                  {{ item.estado ? 'Si lo haces, no podrá iniciar sesión en el sistema.' : 'Si lo haces, podrá volver a iniciar sesión en el sistema.' }}
                                </p>
                                <div class="mt-4 d-flex justify-content-center gap-2">
                                  <b-button variant="primary" class="text-white"
                                    @click="$bvModal.hide('toggle-' + item._id)">Cancelar</b-button>
                                  <b-button :variant="item.estado ? 'danger' : 'success'"
                                    @click="eliminar(item._id, item.estado)">
                                    {{ item.estado ? 'Desactivar' : 'Activar' }}
                                  </b-button>
                                </div>
                              </div>
                            </b-modal>

                            <!-- Modal reset password -->
                            <b-modal centered :id="'reset-' + item._id" hide-footer
                              title="Resetear contraseña">
                              <div class="mb-3">
                                <label class="form-label">Nueva contraseña</label>
                                <input type="password" class="form-control" v-model="resetPass[item._id]" placeholder="Mínimo 6 caracteres">
                              </div>
                              <div class="d-flex justify-content-end gap-2">
                                <b-button variant="secondary" @click="$bvModal.hide('reset-' + item._id)">Cancelar</b-button>
                                <b-button variant="primary" @click="resetPassword(item._id)">Guardar</b-button>
                              </div>
                            </b-modal>

                          </td>
                        </tr>
                        <tr v-if="load_data">
                          <td colspan="5" class="text-center">
                            <div class="spinner-border mt-5 mb-5" role="status">
                              <span class="visually-hidden">Cargando...</span>
                            </div>
                          </td>
                        </tr>
                      </paginate>

                    </table>
                  </div>

                  <div class="card-footer d-flex justify-content-between">
                    <ul class="list-pagination-prev pagination pagination-tabs card-pagination">
                      <li class="page-item">
                        <a class="page-link ps-0 pe-4 border-end" style="cursor:pointer" @click="goPrev()">
                          <i class="fe fe-arrow-left me-1"></i> Anterior
                        </a>
                      </li>
                    </ul>

                    <paginate-links @change="onLangsPageChange" for="colaboradores" style="cursor:pointer"
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
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';

export default {
  name: 'IndexColaboradorApp',
  components: { Sidebar, TopNav },

  data() {
    return {
      colaboradores: [],
      colaboradores_const: [],
      paginate: ['colaboradores'],
      currentPage: 1,
      perPage: 5,
      Filtro: '',
      filterKey: 0,
      load_data: true,
      resetPass: {}
    }
  },

  methods: {
    onLangsPageChange(toPage) { this.currentPage = toPage; },
    goPrev() { if (this.currentPage >= 2) this.$refs.colaboradores.goToPage(this.currentPage--); else this.$refs.colaboradores.goToPage(1); },
    goNext() { if (this.currentPage <= Math.ceil(this.colaboradores.length / this.perPage)) this.$refs.colaboradores.goToPage(this.currentPage++); else this.$refs.colaboradores.goToPage(Math.ceil(this.colaboradores.length / this.perPage)); },

    init_data() {
      this.load_data = true;
      axios.get(this.$url + '/listar_usuario_admin/', {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then(res => {
        this.colaboradores = res.data;
        this.colaboradores_const = res.data;
        this.load_data = false;
        this.applyFilter();
      }).catch(err => {
        console.log(err);
        this.load_data = false;
      });
    },

    applyFilter() {
      const q = (this.Filtro || '').trim().toLowerCase();
      if (!q) {
        this.colaboradores = this.colaboradores_const.slice();
        this.currentPage = 1;
        if (this.$refs.colaboradores && this.$refs.colaboradores.goToPage) {
          this.$refs.colaboradores.goToPage(1);
        }
        this.filterKey++;
        return;
      }
      this.colaboradores = this.colaboradores_const.filter((c) => {
        return [c.nombres, c.apellidos, c.email, c.rol]
          .filter(Boolean)
          .map(v => v.toLowerCase())
          .some(v => v.includes(q));
      });
      this.currentPage = 1;
      if (this.$refs.colaboradores && this.$refs.colaboradores.goToPage) {
        this.$refs.colaboradores.goToPage(1);
      }
      this.filterKey++;
    },

    eliminar(id, estado) {
      axios.put(this.$url + '/cambiar_estado_usuario/' + id, { estado: estado }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then(() => {
        this.$bvModal.hide('toggle-' + id);
        this.init_data();
        this.$notify({
          group: 'foo',
          title: estado ? 'DESACTIVADO' : 'ACTIVADO',
          type: estado ? 'error' : 'success',
          text: `Usuario ${estado ? 'desactivado' : 'activado'} correctamente`
        });
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', type: 'error', text: 'No se pudo cambiar el estado del colaborador' });
      });
    },

    resetPassword(id) {
      const pass = (this.resetPass[id] || '').trim();
      if (!pass || pass.length < 6) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
        return;
      }
      axios.put(this.$url + '/reset_password_admin/' + id, { new_password: pass }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then(() => {
        this.$bvModal.hide('reset-' + id);
        this.$notify({ group: 'foo', title: 'ÉXITO', text: 'contraseña reseteada', type: 'success' });
        this.resetPass[id] = '';
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo resetear la contraseña', type: 'error' });
      });
    },

    getAvatarUrl(avatar) {
      if (!avatar || avatar === 'default.jpg' || avatar === 'default.png') {
        return '/assets/media/usuario.png';
      }
      return this.$url + '/obtener_avatar_usuario/' + avatar;
    }

  },

  watch: {
    '$store.state.token'(val) {
      if (val && !this.colaboradores.length && !this.load_data) {
        this.init_data();
      }
    },
    '$route.name'(name) {
      if (name === 'colaborador-index') {
        this.init_data();
      }
    },
    Filtro() {
      this.applyFilter();
    }
  },

  mounted() {
    this.init_data();
  }
}
</script>


