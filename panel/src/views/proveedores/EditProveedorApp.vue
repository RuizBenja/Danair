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
                        <router-link to="/proveedor" class="nav-link">Todos los proveedores</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Editar proveedor</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <ProveedorForm ref="proveedorForm" v-model="form" :errors="errors" :show-estado="true" estado-id="prov-estado-edit" />
                <hr class="my-4">
                <div class="d-flex align-items-center gap-3">
                  <button class="btn btn-primary" @click="guardar">Actualizar proveedor</button>
                  <router-link to="/proveedor" class="btn btn-danger cancel-button">Cancelar</router-link>
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
import ProveedorForm from '@/components/proveedores/ProveedorForm.vue';
import axios from 'axios';

export default {
  name: 'EditProveedorApp',
  components: { Sidebar, TopNav, ProveedorForm },
  data() {
    return {
      form: {
        nombre: '',
        contacto: '',
        email: '',
        telefono: '',
        telefono_alt: '',
        direccion: '',
        sitio: '',
        notas: '',
        estado: true
      },
      errors: {}
    };
  },
  methods: {
    cargar() {
      axios.get(this.$url + '/obtener_proveedor_admin/' + this.$route.params.id, {
        headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
      }).then((res) => {
        this.form = { ...res.data };
      });
    },
    validateForm() {
      this.errors = {};
      if (!this.form.nombre || !this.form.nombre.trim()) this.errors.nombre = 'Ingresa el nombre';
      if (!this.form.contacto || !this.form.contacto.trim()) this.errors.contacto = 'Ingresa el contacto';
      if (!this.form.email || !this.form.email.trim()) this.errors.email = 'Ingresa el email';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim())) this.errors.email = 'Ingresa un email valido';
      if (!this.form.telefono || !this.form.telefono.trim()) this.errors.telefono = 'Ingresa el telefono';
      else if (!/^\+569\s?\d{8}$/.test(this.form.telefono.trim())) this.errors.telefono = 'Ingresa un celular chileno valido';
      if (!this.form.direccion || !this.form.direccion.trim()) this.errors.direccion = 'Ingresa la direccion';
      return !Object.keys(this.errors).length;
    },
    focusFirstError() {
      const order = ['nombre', 'contacto', 'email', 'telefono', 'direccion'];
      const firstKey = order.find((key) => this.errors[key]);
      if (!firstKey || !this.$refs.proveedorForm || !this.$refs.proveedorForm.$refs[firstKey]) return;
      this.$nextTick(() => {
        const target = this.$refs.proveedorForm.$refs[firstKey];
        const node = Array.isArray(target) ? target[0] : target;
        const container = node.closest('.col-12, .col-md-6') || node;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof node.focus === 'function') node.focus();
      });
    },
    guardar() {
      if (!this.validateForm()) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Falta completar campos obligatorios', type: 'error' });
        this.focusFirstError();
        return;
      }
      axios.put(this.$url + '/actualizar_proveedor_admin/' + this.$route.params.id, this.form, {
        headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Proveedor actualizado', type: 'success' });
        this.$router.push({ name: 'proveedor-index' });
      }).catch((error) => {
        const message = error.response?.data?.message || 'No se pudo actualizar';
        this.$notify({ group: 'foo', title: 'ERROR', text: message, type: 'error' });
      });
    }
  },
  beforeMount() {
    this.cargar();
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
