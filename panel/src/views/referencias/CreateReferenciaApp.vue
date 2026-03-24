<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-10">
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
                        <router-link to="/referencias/categorias" class="nav-link">Categorías de referencias</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Nueva referencia</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <ReferenciaForm
              ref="referenciaForm"
              :form="form"
              :categorias="categorias"
              :marcas="marcas"
              :comuna-options="comunaOptions"
              :selected-comuna="selectedComuna"
              :selected-date="selectedDate"
              :errors="errors"
              :image-name="imageName"
              :classification-mode="classificationMode"
              submit-label="Crear referencia"
              @classification-change="onClassificationChange"
              @comuna-select="onComunaSelect"
              @year-date-input="onYearDateInput"
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
import ReferenciaForm from '@/components/referencias/ReferenciaForm.vue';
import { chileComunasOptions } from '@/data/chileComunas';
import axios from 'axios';

function createInitialForm() {
  return {
    industria_categoria: '',
    producto_categoria: '',
    titulo: '',
    comuna: '',
    region: '',
    anio: '',
    marca: '',
    modelo: '',
    potencia: '',
    caudal: '',
    presion: '',
    descripcion: '',
    estado: true
  };
}

export default {
  name: 'CreateReferenciaApp',
  components: { Sidebar, TopNav, ReferenciaForm },
  data() {
    return {
      categorias: [],
      marcas: [],
      form: createInitialForm(),
      classificationMode: 'industria',
      comunaOptions: chileComunasOptions,
      selectedComuna: {},
      selectedDate: '',
      imagen: null,
      errors: {}
    };
  },
  computed: {
    imageName() {
      return this.imagen ? this.imagen.name : 'Sin archivo seleccionado';
    }
  },
  methods: {
    fetchCategorias() {
      return axios.get(this.$url + '/referencia-categoria').then((response) => {
        this.categorias = response.data || [];
      });
    },
    fetchMarcas() {
      return axios.get(this.$url + '/marca-producto').then((response) => {
        this.marcas = response.data || [];
      });
    },
    onClassificationChange(mode) {
      this.classificationMode = mode || 'industria';

      if (this.classificationMode === 'industria') {
        this.form.producto_categoria = '';
        this.errors.producto_categoria = '';
      }

      if (this.classificationMode === 'producto') {
        this.form.industria_categoria = '';
        this.errors.industria_categoria = '';
      }

      this.errors.categorias = '';
    },
    onComunaSelect(option) {
      const value = option && option.value ? option.value : '';
      this.selectedComuna = option || {};
      this.form.comuna = value;
      const match = this.comunaOptions.find((item) => item.value.toLowerCase() === String(value || '').trim().toLowerCase());
      this.form.region = match ? match.region : '';
      this.errors.comuna = '';
      this.errors.region = '';
    },
    onYearDateInput(value) {
      this.selectedDate = value || '';
      this.form.anio = value ? value.slice(0, 4) : '';
      this.errors.anio = '';
    },
    onFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.type !== 'image/webp') {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Solo WebP', type: 'error' });
        if (this.$refs.referenciaForm.$refs.imagen) this.$refs.referenciaForm.$refs.imagen.value = '';
        return;
      }
      if (file.size > 500 * 1024) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Max 500KB', type: 'error' });
        if (this.$refs.referenciaForm.$refs.imagen) this.$refs.referenciaForm.$refs.imagen.value = '';
        return;
      }
      this.imagen = file;
      this.errors.imagen = '';
    },
    validate() {
      this.errors = {};

      if (this.classificationMode === 'industria' && !this.form.industria_categoria) {
        this.errors.industria_categoria = 'Selecciona la categoría de industria';
      }

      if (this.classificationMode === 'producto' && !this.form.producto_categoria) {
        this.errors.producto_categoria = 'Selecciona la categoría de producto';
      }

      if (this.classificationMode === 'ambas' && !this.form.industria_categoria && !this.form.producto_categoria) {
        this.errors.categorias = 'Selecciona al menos una categoría: industria o producto.';
      }

      if (!this.form.titulo || !this.form.titulo.trim()) this.errors.titulo = 'Ingresa el título';
      if (!this.form.comuna || !this.form.comuna.trim()) this.errors.comuna = 'Selecciona la comuna';
      if (!this.form.region || !this.form.region.trim()) this.errors.region = 'La región se completa desde la comuna';
      if (!this.form.anio) this.errors.anio = 'Selecciona el año';
      if (!this.form.marca || !this.form.marca.trim()) this.errors.marca = 'Selecciona la marca';
      if (!this.form.modelo || !this.form.modelo.trim()) this.errors.modelo = 'Ingresa el modelo';
      if (!this.imagen) this.errors.imagen = 'Debes subir una imagen WebP';
      return Object.keys(this.errors).length === 0;
    },
    focusFirstError() {
      const order = ['industria_categoria', 'producto_categoria', 'titulo', 'imagen', 'comuna', 'anio', 'marca', 'modelo'];
      const firstKey = order.find((key) => this.errors[key]) || (this.errors.categorias ? 'clasificacion' : '');
      if (!firstKey) return;
      this.$nextTick(() => {
        const refsSource = this.$refs.referenciaForm && this.$refs.referenciaForm.$refs ? this.$refs.referenciaForm.$refs : {};
        const target = refsSource[firstKey];
        const node = Array.isArray(target) ? target[0] : target;
        if (!node) return;
        const el = node.$el || node;
        const container = el.closest('.col-12, .col-lg-4, .col-lg-6') || el;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof el.focus === 'function') el.focus();
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

      axios.post(this.$url + '/referencia', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$store.state.token
        }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Referencia guardada', type: 'success' });
        this.$router.push({ name: 'referencias' });
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error.response && error.response.data && error.response.data.message ? error.response.data.message : 'No se pudo guardar',
          type: 'error'
        });
      });
    }
  },
  mounted() {
    this.fetchCategorias();
    this.fetchMarcas();
  }
};
</script>
