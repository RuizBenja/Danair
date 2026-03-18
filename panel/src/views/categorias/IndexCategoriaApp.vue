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
                    <h6 class="header-pretitle">Categorias</h6>
                    <h1 class="header-title">Categorias</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <a class="nav-link active">Todas las categorias</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/categorias/create" class="nav-link">Nueva categoria</router-link>
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
                        placeholder="Buscar categoria o subcategoria"
                        v-model="Filtro"
                      >
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-body">
                <paginate :key="filterKey" tag="ul" ref="categorias" name="categorias" :list="filteredCategorias" :per="perPage" class="list-group list-group-flush list my-n3" id="categorias-list">
                  <li class="list-group-item categoria-item" v-for="item in paginated('categorias')" :key="item.categoria._id">
                    <div class="row align-items-center g-3">
                      <div class="col-auto">
                        <a class="avatar">
                          <img :src="avatarCategoria(item)" alt="avatar" class="avatar-img rounded-circle" />
                        </a>
                      </div>
                      <div class="col">
                        <h4 class="mb-1 name">{{ item.categoria.titulo }} ({{ item.nproductos }} productos)</h4>
                        <p class="small mb-0" v-if="item.categoria.estado">
                          <span class="text-success">&#9679;</span> Publicado
                        </p>
                        <p class="small mb-0" v-else>
                          <span class="text-danger">&#9679;</span> Oculto
                        </p>
                      </div>
                      <div class="col-12 col-xl-auto">
                        <div class="d-flex flex-wrap gap-2 justify-content-xl-end categoria-actions">
                          <b-button
                            :variant="item.categoria.estado ? 'outline-danger' : 'outline-success'"
                            size="sm"
                            v-b-modal="'toggle-' + item.categoria._id"
                          >
                            <b-icon :icon="item.categoria.estado ? 'eye-slash' : 'eye'"></b-icon>
                          </b-button>
                          <button class="btn btn-sm btn-outline-primary" @click="toggleSubcategoriaForm(item.categoria._id)">
                            Subcategoria
                          </button>
                          <b-button
                            v-if="isAdmin"
                            variant="outline-danger"
                            size="sm"
                            v-b-modal="'del-' + item.categoria._id"
                          >
                            Eliminar
                          </b-button>
                        </div>

                        <b-modal
                          centered
                          :id="'del-' + item.categoria._id"
                          hide-footer
                          :title-html="`<h4 class='card-header-title text-danger'><b>Eliminar categoria?</b></h4>`"
                        >
                          <div class="text-center my-4">
                            <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                            <h5 class="mt-3">
                              Se eliminara <strong class="text-danger">{{ item.categoria.titulo }}</strong>
                              y sus subcategorias.
                            </h5>
                            <p class="text-muted mt-2">Esta accion no se puede deshacer.</p>
                            <div class="mt-4 d-flex justify-content-center gap-2">
                              <b-button variant="primary" class="text-white" @click="$bvModal.hide('del-' + item.categoria._id)">Cancelar</b-button>
                              <b-button variant="danger" class="text-white" @click="eliminar_categoria(item.categoria._id)">Eliminar</b-button>
                            </div>
                          </div>
                        </b-modal>

                        <b-modal
                          centered
                          :id="'toggle-' + item.categoria._id"
                          hide-footer
                          :title-html="`<h4 class='card-header-title ${item.categoria.estado ? 'text-danger' : 'text-success'}'><b>${item.categoria.estado ? 'Ocultar categoria?' : 'Publicar categoria?'}</b></h4>`"
                        >
                          <div class="text-center my-4">
                            <b-icon
                              icon="exclamation-triangle-fill"
                              :variant="item.categoria.estado ? 'danger' : 'success'"
                              font-scale="2.5"
                            ></b-icon>
                            <h5 class="mt-3">
                              {{ item.categoria.estado ? 'Seguro que deseas ocultar la categoria ' : 'Seguro que deseas publicar la categoria ' }}
                              <strong :class="item.categoria.estado ? 'text-danger' : 'text-success'">{{ item.categoria.titulo }}</strong>?
                            </h5>
                            <p class="text-muted mt-2">
                              {{ item.categoria.estado ? 'No se eliminara; solo dejara de mostrarse.' : 'Volvera a mostrarse en el listado.' }}
                            </p>
                            <div class="mt-4 d-flex justify-content-center gap-2">
                              <b-button variant="primary" class="text-white" @click="$bvModal.hide('toggle-' + item.categoria._id)">Cancelar</b-button>
                              <b-button
                                :variant="item.categoria.estado ? 'danger' : 'success'"
                                class="text-white"
                                @click="cambiar_estado(item.categoria._id, item.categoria.estado); $bvModal.hide('toggle-' + item.categoria._id)"
                              >
                                {{ item.categoria.estado ? 'Ocultar' : 'Publicar' }}
                              </b-button>
                            </div>
                          </div>
                        </b-modal>
                      </div>
                    </div>

                    <div v-if="activeSubcategoriaId === item.categoria._id" class="input-group mt-4">
                      <input type="text" class="form-control" placeholder="Nueva subcategoria" v-model="nueva_subcategoria" />
                      <button @click="crear_subcategoria()" class="btn btn-primary">Crear subcategoria</button>
                    </div>

                    <div class="row mb-3">
                      <div class="col-12">
                        <ul class="list-group mt-3">
                          <li
                            v-for="subitem in item.subcategorias"
                            :key="subitem._id"
                            class="list-group-item d-flex justify-content-between align-items-center"
                            style="font-size: 0.8rem; padding: 0.5rem 1.5rem"
                          >
                            {{ subitem.titulo }}

                            <button type="button" class="btn btn-sm btn-outline-danger" v-b-modal="'delete-' + subitem._id">
                              Quitar
                            </button>

                            <b-modal centered :id="'delete-' + subitem._id" hide-footer :title-html="`<h4 class='card-header-title text-danger'><b>Eliminar subcategoria?</b></h4>`">
                              <div class="text-center my-4">
                                <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                                <h5 class="mt-3">
                                  Seguro que deseas eliminar la subcategoria
                                  <strong class="text-danger">{{ subitem.titulo }}</strong>?
                                </h5>
                                <p class="text-muted mt-2">Esta accion no se puede deshacer.</p>
                                <div class="mt-4 d-flex justify-content-center gap-2">
                                  <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-' + subitem._id)">Cancelar</b-button>
                                  <b-button variant="danger" @click="eliminar_subcategorias(subitem._id)">Eliminar</b-button>
                                </div>
                              </div>
                            </b-modal>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </paginate>
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

                  <paginate-links @change="onPageChange" for="categorias" style="cursor:pointer"
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
  name: 'IndexCategoriaApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      categorias: [],
      idcategoria: '',
      nueva_subcategoria: '',
      activeSubcategoriaId: '',
      defaultAvatar: '/assets/media/usuario.png',
      paginate: ['categorias'],
      perPage: 5,
      currentPage: 1,
      Filtro: '',
      filterKey: 0
    };
  },
  methods: {
    avatarCategoria(item) {
      const user = item.categoria && item.categoria.usuario;
      const avatar = user && user.avatar;
      if (avatar && avatar !== 'default.jpg' && avatar !== 'default.png') {
        return this.$url + '/obtener_avatar_usuario/' + avatar;
      }
      return this.defaultAvatar;
    },
    init_data() {
      axios.get(this.$url + '/listar_categorias_admin/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.token
        }
      }).then((result) => {
        this.categorias = result.data;
        this.currentPage = 1;
        if (this.$refs.categorias && this.$refs.categorias.goToPage) this.$refs.categorias.goToPage(1);
        this.filterKey += 1;
      });
    },
    onPageChange(toPage) { this.currentPage = toPage; },
    goPrev() { if (this.currentPage >= 2) this.$refs.categorias.goToPage(this.currentPage--); else this.$refs.categorias.goToPage(1); },
    goNext() { if (this.currentPage <= Math.ceil(this.filteredCategorias.length / this.perPage)) this.$refs.categorias.goToPage(this.currentPage++); else this.$refs.categorias.goToPage(Math.max(1, Math.ceil(this.filteredCategorias.length / this.perPage))); },
    toggleSubcategoriaForm(id) {
      if (this.activeSubcategoriaId === id) {
        this.activeSubcategoriaId = '';
        this.idcategoria = '';
        this.nueva_subcategoria = '';
        return;
      }
      this.activeSubcategoriaId = id;
      this.idcategoria = id;
      this.nueva_subcategoria = '';
    },
    crear_subcategoria() {
      if (!this.nueva_subcategoria) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Ingrese el titulo de la subcategoria', type: 'error' });
        return;
      }
      axios.post(this.$url + '/crear_subcategoria_admin/', {
        titulo: this.nueva_subcategoria,
        categoria: this.idcategoria,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.token,
        },
      }).then((result) => {
        if (result.data.message) {
          this.$notify({ group: 'foo', title: 'ERROR', text: result.data.message, type: 'error' });
        } else {
          this.nueva_subcategoria = '';
          this.$notify({ group: 'foo', title: 'EXITO', text: 'Subcategoria creada correctamente', type: 'success' });
          this.init_data();
        }
      });
    },
    eliminar_subcategorias(id) {
      axios.delete(this.$url + '/eliminar_subcategoria_admin/' + id, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.token,
        },
      }).then((result) => {
        if (result.data.message) {
          this.$notify({ group: 'foo', title: 'ERROR', text: result.data.message, type: 'error' });
        } else {
          this.$notify({ group: 'foo', title: 'EXITO', text: 'Se elimino la subcategoria correctamente', type: 'success' });
          this.init_data();
        }
      }).catch(() => {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo eliminar la subcategoria', type: 'error' });
      });
    },
    cambiar_estado(id, estado) {
      axios.put(this.$url + '/cambiar_estado_categoria_admin/' + id, { estado }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.token
        }
      }).then(() => {
        this.init_data();
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Se cambio el estado de la categoria', type: 'success' });
      });
    },
    eliminar_categoria(id) {
      axios.delete(this.$url + '/eliminar_categoria_admin/' + id, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.token
        }
      }).then(() => {
        this.$bvModal.hide('del-' + id);
        this.init_data();
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Categoria eliminada', type: 'success' });
      }).catch((err) => {
        const msg = err?.response?.data?.message || 'No se pudo eliminar la categoria';
        this.$notify({ group: 'foo', title: 'ERROR', text: msg, type: 'error' });
      });
    }
  },
  computed: {
    filteredCategorias() {
      const q = (this.Filtro || '').trim().toLowerCase();
      if (!q) return this.categorias;
      return this.categorias.filter((it) => {
        const titulo = (it.categoria && it.categoria.titulo ? it.categoria.titulo : '').toLowerCase();
        const tieneSub = (it.subcategorias || []).some((s) => (s.titulo || '').toLowerCase().includes(q));
        return titulo.includes(q) || tieneSub;
      });
    },
    isAdmin() {
      try {
        const st = (this.$store && this.$store.state) ? this.$store.state : {};
        if (st.usuario && st.usuario.rol === 'Administrador') return true;
        if (st.user && st.user.rol === 'Administrador') return true;
        if (typeof window !== 'undefined' && window.localStorage) {
          const raw = window.localStorage.getItem('usuario');
          if (raw) {
            const u = JSON.parse(raw);
            if (u && u.rol === 'Administrador') return true;
          }
        }
      } catch (_e) {}
      return false;
    },
  },
  watch: {
    Filtro() {
      this.currentPage = 1;
      if (this.$refs.categorias && this.$refs.categorias.goToPage) this.$refs.categorias.goToPage(1);
      this.filterKey += 1;
    }
  },
  beforeMount() {
    this.init_data();
  }
};
</script>

<style scoped>
.list-group-flush > .list-group-item {
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  overflow: hidden;
}

.categoria-actions {
  min-width: max-content;
}
</style>
