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
                        <router-link to="/marcas-producto" class="nav-link">Todas las marcas</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Nueva marca de producto</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="row g-3 align-items-end">
                  <div class="col-12 col-lg-8">
                    <label class="form-label">Nombre</label>
                    <input class="form-control" v-model="form.nombre" placeholder="Ej: BOGE" />
                    <p v-if="errors.nombre" class="text-danger small">{{ errors.nombre }}</p>
                  </div>
                  <div class="col-12 col-lg-4">
                    <div class="d-flex flex-wrap align-items-center justify-content-lg-end gap-3 mt-lg-4">
                      <div class="form-check form-switch m-0">
                        <input class="form-check-input" type="checkbox" v-model="form.estado" />
                        <label class="form-check-label">Activa</label>
                      </div>
                      <router-link to="/marcas-producto" class="btn btn-danger cancel-button">Cancelar</router-link>
                      <button class="btn btn-primary px-4" @click="save">Crear</button>
                    </div>
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
  name: 'CreateMarcaProductoApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      form: { nombre: '', estado: true },
      errors: {}
    };
  },
  methods: {
    validate() {
      this.errors = {};
      if (!this.form.nombre) this.errors.nombre = 'Ingresa el nombre';
      return Object.keys(this.errors).length === 0;
    },
    save() {
      if (!this.validate()) return;
      axios.post(this.$url + '/marca-producto', this.form, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Marca de producto guardada', type: 'success' });
        this.$router.push({ name: 'marcas-producto' });
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error?.response?.data?.message || 'No se pudo guardar',
          type: 'error'
        });
      });
    }
  }
};
</script>

<style scoped>
.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
