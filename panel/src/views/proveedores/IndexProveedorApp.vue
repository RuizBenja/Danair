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
                    <h6 class="header-pretitle">Proveedores</h6>
                    <h1 class="header-title">Proveedores</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <a class="nav-link active">Todos los proveedores</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/proveedor/create" class="nav-link">Nuevo proveedor</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card" id="proveedoresList">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <div class="input-group input-group-flush input-group-merge input-group-reverse">
                      <input class="form-control list-search" type="search" v-model="search" placeholder="Buscar proveedor" @input="filtrar">
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm table-hover table-nowrap card-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Contacto</th>
                      <th>Email</th>
                      <th>Telefono</th>
                      <th>Notas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <paginate :key="filterKey" tag="tbody" ref="proveedores" name="proveedores" :list="proveedores" :per="perPage" class="list fs-base">
                    <tr v-for="prov in paginated('proveedores')" :key="prov._id">
                      <td>{{ prov.nombre }}</td>
                      <td>{{ prov.contacto || '-' }}</td>
                      <td>{{ prov.email || '-' }}</td>
                      <td>{{ prov.telefono || '-' }}</td>
                      <td class="text-truncate" style="max-width: 220px;">{{ prov.notas || '-' }}</td>
                      <td class="text-end">
                        <div class="dropdown">
                          <a class="dropdown-ellipses dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <router-link :to="`/proveedor/edit/${prov._id}`" class="dropdown-item">Editar</router-link>
                            <a class="dropdown-item text-danger" style="cursor:pointer" @click="$bvModal.show('delete-prov-' + prov._id)">
                              Eliminar
                            </a>
                          </div>
                        </div>

                        <b-modal centered :id="'delete-prov-' + prov._id" hide-footer title-html="<h4 class='card-header-title text-danger'><b>Eliminar proveedor?</b></h4>">
                          <div class="text-center my-4">
                            <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                            <h5 class="mt-3">
                              Seguro que quieres eliminar a <strong class="text-danger">{{ prov.nombre }}</strong>?
                            </h5>
                            <p class="text-muted mt-2">Esta accion no se puede deshacer.</p>
                            <div class="mt-4 d-flex justify-content-center gap-2">
                              <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-prov-' + prov._id)">Cancelar</b-button>
                              <b-button variant="danger" @click="confirmEliminar(prov)">Eliminar</b-button>
                            </div>
                          </div>
                        </b-modal>
                      </td>
                    </tr>
                    <tr v-if="!proveedores.length">
                      <td colspan="6" class="text-center text-muted">No hay proveedores</td>
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

                <paginate-links @change="onPageChange" for="proveedores" style="cursor:pointer"
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
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';

export default {
  name: 'IndexProveedorApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      proveedores: [],
      proveedores_const: [],
      search: '',
      paginate: ['proveedores'],
      currentPage: 1,
      perPage: 5,
      filterKey: 0
    };
  },
  methods: {
    onPageChange(toPage) { this.currentPage = toPage; },
    goPrev() {
      if (this.currentPage >= 2) this.$refs.proveedores.goToPage(this.currentPage--);
      else this.$refs.proveedores.goToPage(1);
    },
    goNext() {
      if (this.currentPage <= Math.ceil(this.proveedores.length / this.perPage)) this.$refs.proveedores.goToPage(this.currentPage++);
      else this.$refs.proveedores.goToPage(Math.max(1, Math.ceil(this.proveedores.length / this.perPage)));
    },
    filtrar() {
      const q = this.search.trim().toLowerCase();
      if (!q) {
        this.proveedores = [...this.proveedores_const];
        this.currentPage = 1;
        if (this.$refs.proveedores && this.$refs.proveedores.goToPage) this.$refs.proveedores.goToPage(1);
        this.filterKey += 1;
        return;
      }
      this.proveedores = this.proveedores_const.filter((p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.contacto || '').toLowerCase().includes(q) ||
        (p.telefono || '').toLowerCase().includes(q) ||
        (p.notas || '').toLowerCase().includes(q)
      );
      this.currentPage = 1;
      if (this.$refs.proveedores && this.$refs.proveedores.goToPage) this.$refs.proveedores.goToPage(1);
      this.filterKey += 1;
    },
    confirmEliminar(prov) {
      axios.delete(this.$url + '/eliminar_proveedor_admin/' + prov._id, {
        headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
      }).then(() => {
        this.proveedores = this.proveedores.filter((p) => p._id !== prov._id);
        this.proveedores_const = this.proveedores_const.filter((p) => p._id !== prov._id);
        this.$bvModal.hide('delete-prov-' + prov._id);
        this.$notify({ group: 'foo', title: 'ELIMINADO', text: 'Proveedor eliminado', type: 'success' });
      });
    }
  },
  beforeMount() {
    axios.get(this.$url + '/listar_proveedores_admin', {
      headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
    }).then((res) => {
      this.proveedores_const = res.data;
      this.proveedores = res.data;
    });
  }
};
</script>
