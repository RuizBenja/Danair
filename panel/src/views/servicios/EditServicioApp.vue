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
                        <router-link to="/servicios" class="nav-link">Todos los servicios</router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/servicios/create" class="nav-link">Nuevo servicio</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Editar servicio</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <ServicioForm
              ref="servicioForm"
              :form="form"
              :errors="errors"
              :image-name="imageName"
              :show-advanced="showAdvanced"
              submit-label="Actualizar servicio"
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
import ServicioForm from '@/components/servicios/ServicioForm.vue';
import axios from 'axios';

export default {
  name: 'EditServicioApp',
  components: { Sidebar, TopNav, ServicioForm },
  data() {
    return {
      form: {
        _id: '',
        titulo: '',
        extracto: '',
        descripcion: '',
        seo_title: '',
        seo_description: '',
        estado: true,
        imagen: ''
      },
      imagen: null,
      errors: {},
      showAdvanced: false
    };
  },
  computed: {
    imageName() {
      if (this.imagen) return this.imagen.name;
      if (this.form.imagen) return this.form.imagen;
      return 'Sin archivo seleccionado';
    }
  },
  methods: {
    load() {
      axios.get(this.$url + '/servicio/' + this.$route.params.id).then((response) => {
        const servicio = response.data;
        this.form = {
          _id: servicio._id,
          titulo: servicio.titulo || '',
          extracto: servicio.extracto || '',
          descripcion: servicio.descripcion || '',
          seo_title: servicio.seo_title || '',
          seo_description: servicio.seo_description || '',
          estado: servicio.estado,
          imagen: servicio.imagen || ''
        };
        this.showAdvanced = !!(servicio.seo_title || servicio.seo_description);
      });
    },
    onFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.type !== 'image/webp') {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Solo WebP', type: 'error' });
        if (this.$refs.servicioForm.$refs.imagen) this.$refs.servicioForm.$refs.imagen.value = '';
        return;
      }
      if (file.size > 500 * 1024) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Max 500KB', type: 'error' });
        if (this.$refs.servicioForm.$refs.imagen) this.$refs.servicioForm.$refs.imagen.value = '';
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
      return Object.keys(this.errors).length === 0;
    },
    focusFirstError() {
      const order = ['titulo', 'extracto', 'descripcion'];
      const firstKey = order.find((key) => this.errors[key]);
      if (!firstKey) return;
      this.$nextTick(() => {
        const refsSource = this.$refs.servicioForm && this.$refs.servicioForm.$refs ? this.$refs.servicioForm.$refs : {};
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

      let data;
      const hasFile = !!this.imagen;
      if (hasFile) {
        data = new FormData();
        Object.entries(this.form).forEach(([key, value]) => data.append(key, value));
        data.append('imagen', this.imagen);
      } else {
        data = { ...this.form };
      }

      axios.put(this.$url + '/servicio/' + this.form._id, data, {
        headers: hasFile
          ? { 'Content-Type': 'multipart/form-data', Authorization: this.$store.state.token }
          : { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Servicio actualizado', type: 'success' });
        this.$router.push({ name: 'servicios' });
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error.response?.data?.message || 'No se pudo actualizar',
          type: 'error'
        });
      });
    }
  },
  mounted() {
    this.load();
  }
}
</script>
