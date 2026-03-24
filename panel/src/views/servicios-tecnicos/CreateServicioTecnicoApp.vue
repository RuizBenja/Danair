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
                    <h1 class="header-title">Servicios tecnicos</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <router-link to="/servicios-tecnicos" class="nav-link">Todos los servicios tecnicos</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Nuevo servicio tecnico</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <ServicioTecnicoForm
              ref="servicioTecnicoForm"
              :form="form"
              :errors="errors"
              :image-name="imageName"
              :show-advanced="showAdvanced"
              submit-label="Crear servicio tecnico"
              @toggle-advanced="showAdvanced = !showAdvanced"
              @file-change="onFile"
              @submit="save"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import ServicioTecnicoForm from '@/components/servicios-tecnicos/ServicioTecnicoForm.vue';
import axios from 'axios';

function createInitialForm() {
  return {
    titulo: '',
    extracto: '',
    descripcion: '',
    seo_title: '',
    seo_description: '',
    estado: true
  };
}

export default {
  name: 'CreateServicioTecnicoApp',
  components: { Sidebar, TopNav, ServicioTecnicoForm },
  data() {
    return {
      form: createInitialForm(),
      imagen: null,
      errors: {},
      showAdvanced: false
    };
  },
  computed: {
    imageName() {
      return this.imagen ? this.imagen.name : 'Sin archivo seleccionado';
    }
  },
  methods: {
    onFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.type !== 'image/webp') {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Solo WebP', type: 'error' });
        if (this.$refs.servicioTecnicoForm.$refs.imagen) this.$refs.servicioTecnicoForm.$refs.imagen.value = '';
        return;
      }
      if (file.size > 500 * 1024) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Max 500KB', type: 'error' });
        if (this.$refs.servicioTecnicoForm.$refs.imagen) this.$refs.servicioTecnicoForm.$refs.imagen.value = '';
        return;
      }
      this.imagen = file;
      this.errors.imagen = '';
    },
    validate() {
      this.errors = {};
      if (!this.form.titulo || !this.form.titulo.trim()) this.errors.titulo = 'Ingresa el titulo';
      if (!this.form.extracto || !this.form.extracto.trim()) this.errors.extracto = 'Ingresa el extracto';
      if (!this.form.descripcion || !this.form.descripcion.trim()) this.errors.descripcion = 'Ingresa la descripcion';
      if (!this.imagen) this.errors.imagen = 'Debes subir una imagen WebP';
      return Object.keys(this.errors).length === 0;
    },
    focusFirstError() {
      const order = ['titulo', 'imagen', 'extracto', 'descripcion'];
      const firstKey = order.find((key) => this.errors[key]);
      if (!firstKey) return;
      this.$nextTick(() => {
        const refsSource = this.$refs.servicioTecnicoForm && this.$refs.servicioTecnicoForm.$refs ? this.$refs.servicioTecnicoForm.$refs : {};
        const target = refsSource[firstKey];
        const node = Array.isArray(target) ? target[0] : target;
        if (!node) return;
        const container = node.closest('.col-12, .col-lg-6, .col-lg-3') || node;
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

      const data = new FormData();
      Object.entries(this.form).forEach(([key, value]) => data.append(key, value));
      data.append('imagen', this.imagen);

      axios.post(this.$url + '/servicio_tecnico', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$store.state.token
        }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Servicio tecnico guardado', type: 'success' });
        this.$router.push({ name: 'servicios-tecnicos' });
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error.response?.data?.message || 'No se pudo guardar',
          type: 'error'
        });
      });
    }
  }
}
</script>
