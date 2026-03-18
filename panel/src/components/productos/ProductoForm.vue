<template>
  <div class="producto-form">
    <div class="mb-7">
      <div class="row justify-content-between align-items-center">
        <div class="col">
          <div class="row align-items-center">
            <div class="col-auto">
              <div class="avatar avatar-xxl">
                <img class="avatar-img rounded" :src="portadaPreview" alt="Portada del producto" />
              </div>
            </div>
            <div class="col ms-n2">
              <h4 class="mb-1"><b>Portada</b></h4>
              <small class="text-muted d-block">Solo WebP, maximo 500 KB.</small>
              <small class="text-muted d-block" v-if="portadaFile">{{ portadaFile.name }}</small>
              <p v-if="errors.portada" class="text-danger small mt-2 mb-0">{{ errors.portada }}</p>
            </div>
          </div>
        </div>
        <div class="col-auto">
          <div class="d-flex align-items-center gap-2">
            <label for="producto-portada" class="btn btn-sm btn-primary">Subir WebP</label>
            <button v-if="canResetPortada" type="button" class="btn btn-sm btn-outline-danger" @click="resetPortada">Quitar</button>
          </div>
          <input id="producto-portada" ref="portada" class="d-none" type="file" accept="image/webp" @change="onPortadaChange" />
        </div>
      </div>

      <hr class="my-5" />

      <div class="row g-3">
        <div class="col-12">
          <label class="form-label">Titulo del producto</label>
          <input ref="titulo" v-model="form.titulo" type="text" class="form-control" placeholder="Ej: Compresor de piston Serie K" />
          <p v-if="errors.titulo" class="text-danger small mt-1">{{ errors.titulo }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">Categoria</label>
          <select ref="categoria" v-model="form.categoria" class="form-select" @change="onCategoriaChange">
            <option value="" disabled>Seleccionar</option>
            <option v-for="item in categorias" :key="item.categoria._id" :value="item.categoria.titulo">{{ item.categoria.titulo }}</option>
          </select>
          <p v-if="errors.categoria" class="text-danger small mt-1">{{ errors.categoria }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">Subcategoria</label>
          <select ref="subcategoria" v-model="form.subcategoria" class="form-select" :disabled="!subcategorias.length">
            <option value="" disabled>{{ subcategorias.length ? 'Seleccionar' : 'Primero elige categoria' }}</option>
            <option v-for="sub in subcategorias" :key="sub._id" :value="sub.titulo">{{ sub.titulo }}</option>
          </select>
          <p v-if="errors.subcategoria" class="text-danger small mt-1">{{ errors.subcategoria }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">Marca</label>
          <select ref="marca" v-model="form.marca" class="form-select">
            <option value="" disabled>Seleccionar</option>
            <option v-for="marca in marcasActivas" :key="marca._id" :value="marca.nombre">{{ marca.nombre }}</option>
          </select>
          <p v-if="errors.marca" class="text-danger small mt-1">{{ errors.marca }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">Serie</label>
          <input ref="serie" v-model="form.serie" type="text" class="form-control" placeholder="Ej: Serie K" />
          <p v-if="errors.serie" class="text-danger small mt-1">{{ errors.serie }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">Modelo</label>
          <input ref="modelo" v-model="form.modelo" type="text" class="form-control" placeholder="Ej: K 40 bar" />
          <p v-if="errors.modelo" class="text-danger small mt-1">{{ errors.modelo }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">URL de ficha tecnica (opcional)</label>
          <input v-model="form.ficha_tecnica" type="url" class="form-control" placeholder="https://..." />
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">PDF de ficha tecnica (opcional)</label>
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <label for="producto-ficha-pdf" class="btn btn-sm btn-outline-primary">Subir PDF</label>
            <button v-if="canResetFichaPdf" type="button" class="btn btn-sm btn-outline-danger" @click="resetFichaPdf">Quitar</button>
            <a v-if="currentFichaPdfUrl && !fichaPdfFile" :href="currentFichaPdfUrl" target="_blank" rel="noopener" class="btn btn-sm btn-outline-secondary pdf-current-button">Ver PDF</a>
          </div>
          <small class="text-muted d-block mt-2">Solo PDF, maximo 5 MB.</small>
          <small class="text-muted d-block" v-if="fichaPdfName">{{ fichaPdfName }}</small>
          <p v-if="errors.ficha_pdf" class="text-danger small mt-1">{{ errors.ficha_pdf }}</p>
          <input id="producto-ficha-pdf" ref="fichaPdf" class="d-none" type="file" accept="application/pdf,.pdf" @change="onFichaPdfChange" />
        </div>

        <div class="col-12">
          <label class="form-label">Extracto</label>
          <textarea ref="extracto" v-model="form.extracto" class="form-control" rows="3" placeholder="Resumen corto para la vista general"></textarea>
          <p v-if="errors.extracto" class="text-danger small mt-1">{{ errors.extracto }}</p>
        </div>

        <div class="col-12">
          <label class="form-label">Descripcion</label>
          <textarea ref="descripcion" v-model="form.descripcion" class="form-control" rows="5" placeholder="Descripcion completa del equipo"></textarea>
          <p v-if="errors.descripcion" class="text-danger small mt-1">{{ errors.descripcion }}</p>
        </div>
      </div>

      <hr class="my-5" />

      <div v-if="currentSpecLayout.fields.length">
        <div class="d-flex flex-column flex-lg-row align-items-start justify-content-between gap-2 mb-4">
          <div>
            <h3 class="h5 mb-1">{{ currentSpecLayout.title }}</h3>
            <p class="text-muted mb-0">{{ currentSpecLayout.description }}</p>
          </div>
          <span class="spec-badge">{{ currentSpecLayout.badge }}</span>
        </div>

        <div v-for="(group, groupIndex) in currentSpecLayout.groups" :key="'spec-group-' + groupIndex" class="row g-3 mb-1">
          <div v-for="field in group" :key="field" :class="fieldMeta(field).colClass">
            <label class="form-label">{{ fieldMeta(field).label }}</label>
            <input
              v-if="fieldMeta(field).type !== 'textarea'"
              :ref="field"
              v-model="form[field]"
              :type="fieldMeta(field).type"
              class="form-control"
              :placeholder="fieldMeta(field).placeholder"
            />
            <textarea
              v-else
              :ref="field"
              v-model="form[field]"
              class="form-control"
              :rows="fieldMeta(field).rows || 3"
              :placeholder="fieldMeta(field).placeholder"
            ></textarea>
            <p v-if="errors[field]" class="text-danger small mt-1">{{ errors[field] }}</p>
          </div>
        </div>
      </div>
      <div v-else class="spec-empty-state">
        <h3 class="h5 mb-1">Especificaciones tecnicas</h3>
        <p class="text-muted mb-0">Selecciona una categoria para mostrar los campos tecnicos que corresponden a ese tipo de producto.</p>
      </div>

      <hr class="my-5" />

      <div class="row g-3 align-items-center">
        <div class="col-12 col-md-4">
          <label class="mb-1">Disponible para arriendo</label>
          <div class="form-check form-switch">
            <input v-model="form.arriendo" class="form-check-input" type="checkbox" />
            <label class="form-check-label">Si</label>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label class="mb-1">Publicado</label>
          <div class="form-check form-switch">
            <input v-model="form.estado" class="form-check-input" type="checkbox" />
            <label class="form-check-label">Activo</label>
          </div>
        </div>
        <div class="col-12 col-md-4 text-md-end">
          <div class="d-flex align-items-center justify-content-md-end gap-2">
            <router-link v-if="cancelLink" :to="cancelLink" class="btn btn-danger cancel-button">Cancelar</router-link>
            <button type="button" class="btn btn-primary" @click="submitForm">{{ submitLabel }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const MAX_WEBP = 500 * 1024;
const MAX_PDF = 5 * 1024 * 1024;
const SPEC_FIELDS = [
  'tecnologia',
  'potencia',
  'presion',
  'caudal',
  'aplicacion',
  'industria',
  'orientacion',
  'material',
  'volumen',
  'pureza',
  'str_variedad'
];

const CATEGORY_RULES = {
  'Compresores de Tornillo Lubricados': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Compresores Oil-Free': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Compresores de Piston': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Tratamiento Aire Comprimido': ['tecnologia', 'presion', 'caudal', 'str_variedad'],
  'Estanques / Acumuladores': ['presion', 'orientacion', 'material', 'volumen', 'str_variedad'],
  'Generadores de Nitrogeno': ['tecnologia', 'pureza', 'caudal', 'presion'],
  'Generadores de Oxigeno': ['tecnologia', 'pureza', 'caudal', 'presion'],
  'Turbo Compresores BOGE': ['tecnologia', 'potencia', 'presion', 'caudal'],
  'Monitoreo / Control': ['str_variedad'],
  'Instrumentos de Medicion': ['str_variedad'],
  'Repuestos, Insumos y Otros': ['str_variedad']
};

const FIELD_META = {
  tecnologia: { label: 'Tecnologia', placeholder: 'Oil-Free, lubricado, PSA...', colClass: 'col-12 col-md-4', type: 'text' },
  potencia: { label: 'Potencia', placeholder: 'Ej: 50 HP', colClass: 'col-12 col-md-4', type: 'text' },
  presion: { label: 'Presion', placeholder: 'Ej: 12 bar', colClass: 'col-12 col-md-4', type: 'text' },
  caudal: { label: 'Caudal', placeholder: 'Ej: 6.2 m3/min', colClass: 'col-12 col-md-4', type: 'text' },
  aplicacion: { label: 'Aplicacion', placeholder: 'Industria, laboratorio, taller...', colClass: 'col-12 col-md-4', type: 'text' },
  industria: { label: 'Industria', placeholder: 'Alimentos, mineria, salud...', colClass: 'col-12 col-md-4', type: 'text' },
  orientacion: { label: 'Orientacion', placeholder: 'Vertical, horizontal...', colClass: 'col-12 col-md-4', type: 'text' },
  material: { label: 'Material', placeholder: 'Acero carbono, inoxidable...', colClass: 'col-12 col-md-4', type: 'text' },
  volumen: { label: 'Volumen', placeholder: 'Ej: 500 L', colClass: 'col-12 col-md-4', type: 'text' },
  pureza: { label: 'Pureza', placeholder: 'Ej: 95%, 99.99%', colClass: 'col-12 col-md-4', type: 'text' },
  str_variedad: { label: 'Texto tecnico adicional', placeholder: 'Detalle tecnico relevante para este producto', colClass: 'col-12', type: 'textarea', rows: 3 }
};

const CATEGORY_LAYOUTS = {
  'Compresores de Tornillo Lubricados': {
    title: 'Datos del compresor de tornillo',
    description: 'Segun Danair, esta familia trabaja principalmente con potencia, presion, caudal y tipo de tecnologia.',
    badge: 'Compresor',
    groups: [['tecnologia', 'potencia'], ['presion', 'caudal']]
  },
  'Compresores Oil-Free': {
    title: 'Datos del compresor oil-free',
    description: 'Para esta familia se priorizan potencia, presion, caudal y tecnologia del equipo.',
    badge: 'Compresor',
    groups: [['tecnologia', 'potencia'], ['presion', 'caudal']]
  },
  'Compresores de Piston': {
    title: 'Datos del compresor de piston',
    description: 'Para piston Danair destaca potencia, presion, caudal y tipo de tecnologia.',
    badge: 'Compresor',
    groups: [['tecnologia', 'potencia'], ['presion', 'caudal']]
  },
  'Turbo Compresores BOGE': {
    title: 'Datos del turbo compresor',
    description: 'Completa solo los datos tecnicos de operacion del equipo.',
    badge: 'Compresor',
    groups: [['tecnologia', 'potencia'], ['presion', 'caudal']]
  },
  'Estanques / Acumuladores': {
    title: 'Datos del estanque',
    description: 'Danair publica orientacion, material, volumen, presion y detalles tecnicos del estanque.',
    badge: 'Estanque',
    groups: [['presion', 'volumen'], ['orientacion', 'material'], ['str_variedad']]
  },
  'Generadores de Nitrogeno': {
    title: 'Datos del generador de nitrogeno',
    description: 'Danair publica para esta familia tecnologia, pureza, caudal y presion.',
    badge: 'Generador',
    groups: [['tecnologia', 'pureza'], ['caudal', 'presion']]
  },
  'Generadores de Oxigeno': {
    title: 'Datos del generador de oxigeno',
    description: 'Danair publica para esta familia tecnologia, pureza, caudal y presion.',
    badge: 'Generador',
    groups: [['tecnologia', 'pureza'], ['caudal', 'presion']]
  },
  'Tratamiento Aire Comprimido': {
    title: 'Datos del tratamiento de aire',
    description: 'En Danair esta familia cambia segun secador, filtro o purga, pero siempre se repiten presion, caudal y un dato tecnico complementario.',
    badge: 'Tratamiento',
    groups: [['tecnologia', 'presion'], ['caudal', 'str_variedad']]
  },
  'Monitoreo / Control': {
    title: 'Dato tecnico principal',
    description: 'Para control y monitoreo conviene cargar una sola observacion tecnica clara.',
    badge: 'Control',
    groups: [['str_variedad']]
  },
  'Instrumentos de Medicion': {
    title: 'Dato tecnico principal',
    description: 'Para instrumentos conviene registrar un solo dato tecnico clave.',
    badge: 'Instrumento',
    groups: [['str_variedad']]
  },
  'Repuestos, Insumos y Otros': {
    title: 'Dato tecnico principal',
    description: 'Para repuestos e insumos se deja solo un detalle tecnico o compatibilidad.',
    badge: 'Insumo',
    groups: [['str_variedad']]
  }
};

const DEFAULT_FORM = () => ({
  titulo: '',
  categoria: '',
  subcategoria: '',
  marca: '',
  serie: '',
  modelo: '',
  extracto: '',
  descripcion: '',
  ficha_tecnica: '',
  tecnologia: '',
  potencia: '',
  presion: '',
  caudal: '',
  aplicacion: '',
  industria: '',
  orientacion: '',
  material: '',
  volumen: '',
  pureza: '',
  str_variedad: '',
  ficha_pdf: '',
  arriendo: false,
  estado: true
});

export default {
  name: 'ProductoForm',
  props: {
    initialValue: {
      type: Object,
      default: () => ({})
    },
    portadaUrl: {
      type: String,
      default: '/assets/img/productosubido.png'
    },
    fichaPdfUrl: {
      type: String,
      default: ''
    },
    cancelLink: {
      type: String,
      default: ''
    },
    submitLabel: {
      type: String,
      default: 'Guardar'
    },
    requirePortada: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: DEFAULT_FORM(),
      categorias: [],
      subcategorias: [],
      marcas: [],
      portadaFile: null,
      fichaPdfFile: null,
      portadaPreview: this.portadaUrl,
      currentFichaPdfUrl: this.fichaPdfUrl,
      errors: {}
    };
  },
  computed: {
    marcasActivas() {
      return this.marcas.filter((marca) => marca.estado !== false);
    },
    canResetPortada() {
      return !!this.portadaFile;
    },
    canResetFichaPdf() {
      return !!this.fichaPdfFile || !!this.form.ficha_pdf;
    },
    fichaPdfName() {
      if (this.fichaPdfFile) return this.fichaPdfFile.name;
      if (this.form.ficha_pdf) return this.form.ficha_pdf;
      return '';
    },
    activeSpecFields() {
      return CATEGORY_RULES[this.form.categoria] || [];
    },
    currentSpecLayout() {
      const layout = CATEGORY_LAYOUTS[this.form.categoria];
      if (!layout) {
        return {
          title: 'Especificaciones tecnicas',
          description: '',
          badge: '',
          groups: [],
          fields: []
        };
      }
      const groups = layout.groups.map((group) => group.filter((field) => this.activeSpecFields.includes(field))).filter((group) => group.length);
      return {
        ...layout,
        groups,
        fields: groups.flat()
      };
    }
  },
  watch: {
    initialValue: {
      immediate: true,
      deep: true,
      handler(value) {
        this.form = { ...DEFAULT_FORM(), ...(value || {}) };
        this.syncSubcategorias();
        this.clearInactiveSpecFields();
      }
    },
    portadaUrl: {
      immediate: true,
      handler(value) {
        this.portadaPreview = value || '/assets/img/productosubido.png';
      }
    },
    fichaPdfUrl: {
      immediate: true,
      handler(value) {
        this.currentFichaPdfUrl = value || '';
      }
    },
    categorias: {
      deep: true,
      handler() {
        this.syncSubcategorias();
      }
    },
    'form.categoria'() {
      this.syncSubcategorias();
      this.clearInactiveSpecFields();
    }
  },
  methods: {
    fetchCategorias() {
      return axios.get(this.$url + '/listar_categorias_admin/', {
        headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
      }).then((result) => {
        this.categorias = result.data || [];
        this.syncSubcategorias();
      });
    },
    fetchMarcas() {
      return axios.get(this.$url + '/marca-producto').then((result) => {
        this.marcas = result.data || [];
      });
    },
    syncSubcategorias() {
      const selected = this.categorias.find((item) => item.categoria.titulo === this.form.categoria);
      if (!selected) {
        this.subcategorias = [];
        return;
      }
      this.subcategorias = selected.subcategorias || [];
      if (this.form.subcategoria && !this.subcategorias.some((item) => item.titulo === this.form.subcategoria)) {
        this.form.subcategoria = '';
      }
    },
    onCategoriaChange() {
      this.form.subcategoria = '';
      this.syncSubcategorias();
      this.clearInactiveSpecFields();
    },
    showField(field) {
      return this.activeSpecFields.includes(field);
    },
    fieldMeta(field) {
      return FIELD_META[field] || { label: field, placeholder: '', colClass: 'col-12 col-md-4', type: 'text' };
    },
    clearInactiveSpecFields() {
      SPEC_FIELDS.forEach((field) => {
        if (!this.activeSpecFields.includes(field)) {
          this.form[field] = '';
        }
      });
    },
    onPortadaChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.type !== 'image/webp') {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Solo se permite imagen WebP', type: 'error' });
        this.$refs.portada.value = null;
        return;
      }
      if (file.size > MAX_WEBP) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'La imagen debe pesar 500KB o menos', type: 'error' });
        this.$refs.portada.value = null;
        return;
      }
      this.portadaFile = file;
      this.portadaPreview = URL.createObjectURL(file);
      this.errors.portada = '';
    },
    resetPortada() {
      this.portadaFile = null;
      this.portadaPreview = this.portadaUrl || '/assets/img/productosubido.png';
      if (this.$refs.portada) this.$refs.portada.value = null;
    },
    onFichaPdfChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      const mime = (file.type || '').toLowerCase();
      const name = (file.name || '').toLowerCase();
      const ok = mime === 'application/pdf' || name.endsWith('.pdf');
      if (!ok) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Solo se permite PDF', type: 'error' });
        this.$refs.fichaPdf.value = null;
        return;
      }
      if (file.size > MAX_PDF) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'El PDF debe pesar 5MB o menos', type: 'error' });
        this.$refs.fichaPdf.value = null;
        return;
      }
      this.fichaPdfFile = file;
      this.form.ficha_pdf = file.name;
      this.errors.ficha_pdf = '';
    },
    resetFichaPdf() {
      this.fichaPdfFile = null;
      this.form.ficha_pdf = '';
      this.currentFichaPdfUrl = '';
      if (this.$refs.fichaPdf) this.$refs.fichaPdf.value = null;
    },
    validate() {
      this.errors = {};
      if (!this.form.titulo || !this.form.titulo.trim()) this.errors.titulo = 'Ingresa el titulo';
      if (!this.form.categoria || !this.form.categoria.trim()) this.errors.categoria = 'Selecciona categoria';
      if (!this.form.subcategoria || !this.form.subcategoria.trim()) this.errors.subcategoria = 'Selecciona subcategoria';
      if (!this.form.marca || !this.form.marca.trim()) this.errors.marca = 'Selecciona marca';
      if (!this.form.serie || !this.form.serie.trim()) this.errors.serie = 'Ingresa la serie';
      if (!this.form.modelo || !this.form.modelo.trim()) this.errors.modelo = 'Ingresa el modelo';
      if (!this.form.extracto || !this.form.extracto.trim()) this.errors.extracto = 'Ingresa el extracto';
      if (!this.form.descripcion || !this.form.descripcion.trim()) this.errors.descripcion = 'Ingresa la descripcion';
      if (this.showField('tecnologia') && (!this.form.tecnologia || !this.form.tecnologia.trim())) this.errors.tecnologia = 'Ingresa la tecnologia';
      if (this.showField('potencia') && (!this.form.potencia || !this.form.potencia.trim())) this.errors.potencia = 'Ingresa la potencia';
      if (this.showField('presion') && (!this.form.presion || !this.form.presion.trim())) this.errors.presion = 'Ingresa la presion';
      if (this.showField('caudal') && (!this.form.caudal || !this.form.caudal.trim())) this.errors.caudal = 'Ingresa el caudal';
      if (this.showField('aplicacion') && (!this.form.aplicacion || !this.form.aplicacion.trim())) this.errors.aplicacion = 'Ingresa la aplicacion';
      if (this.showField('industria') && (!this.form.industria || !this.form.industria.trim())) this.errors.industria = 'Ingresa la industria';
      if (this.showField('orientacion') && (!this.form.orientacion || !this.form.orientacion.trim())) this.errors.orientacion = 'Ingresa la orientacion';
      if (this.showField('material') && (!this.form.material || !this.form.material.trim())) this.errors.material = 'Ingresa el material';
      if (this.showField('volumen') && (!this.form.volumen || !this.form.volumen.trim())) this.errors.volumen = 'Ingresa el volumen';
      if (this.showField('pureza') && (!this.form.pureza || !this.form.pureza.trim())) this.errors.pureza = 'Ingresa la pureza';
      if (this.showField('str_variedad') && (!this.form.str_variedad || !this.form.str_variedad.trim())) this.errors.str_variedad = 'Ingresa el texto tecnico adicional';
      if (this.requirePortada && !this.portadaFile) this.errors.portada = 'Debes subir una portada WebP';
      return !Object.keys(this.errors).length;
    },
    focusFirstError() {
      const order = ['titulo', 'categoria', 'subcategoria', 'marca', 'serie', 'modelo', 'extracto', 'descripcion', 'tecnologia', 'potencia', 'presion', 'caudal', 'aplicacion', 'industria', 'orientacion', 'material', 'volumen', 'pureza', 'str_variedad'];
      const firstKey = order.find((key) => this.errors[key]);
      if (!firstKey) return;
      this.$nextTick(() => {
        const ref = this.$refs[firstKey];
        const target = Array.isArray(ref) ? ref[0] : ref;
        if (!target) return;
        const container = target.closest('.col-12, .col-md-4, .col-md-6') || target;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof target.focus === 'function') target.focus();
      });
    },
    submitForm() {
      if (!this.validate()) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Falta completar campos obligatorios', type: 'error' });
        this.focusFirstError();
        return;
      }
      this.$emit('submit', {
        form: { ...this.form },
        portada: this.portadaFile,
        fichaPdf: this.fichaPdfFile
      });
    }
  },
  mounted() {
    this.fetchCategorias();
    this.fetchMarcas();
  }
};
</script>

<style scoped>
.avatar-xxl {
  width: 5rem;
  height: 5rem;
}


.spec-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: #eef2ff;
  color: #3b5bdb;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.spec-empty-state {
  padding: 1.25rem 1.5rem;
  border: 1px dashed #d2ddec;
  border-radius: 0.875rem;
  background: #f9fbff;
}

.pdf-current-button,
.pdf-current-button:visited {
  color: #6e84a3 !important;
  border-color: #d2ddec !important;
}

.pdf-current-button:hover,
.pdf-current-button:focus,
.pdf-current-button:active {
  color: #fff !important;
  background-color: #6e84a3 !important;
  border-color: #6e84a3 !important;
}

.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
