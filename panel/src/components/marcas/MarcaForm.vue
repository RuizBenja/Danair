<template>
  <div class="card">
    <div class="card-body">
      <form novalidate @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-12 col-md-4 mb-4">
            <label class="form-label">Logo WebP</label>
            <div class="marca-logo-card">
              <div class="marca-logo-preview mb-3">
                <img v-if="logoPreview" :src="logoPreview" alt="Logo marca">
                <span v-else>Sin logo</span>
              </div>

              <div class="d-flex flex-wrap justify-content-center gap-2">
                <button type="button" class="btn btn-white" @click="$refs.logo.click()">Subir WebP</button>
                <button v-if="logoPreview" type="button" class="btn btn-white text-danger" @click="removeLogo">Quitar</button>
              </div>

              <p class="text-muted small mt-3 mb-0 text-center">
                {{ logoName }}<br>Solo WebP, maximo 500 KB.
              </p>
              <p v-if="errors.logo" class="text-danger small mt-2 mb-0 text-center">{{ errors.logo }}</p>
            </div>
            <input ref="logo" type="file" class="d-none" accept="image/webp" @change="onLogoChange">
          </div>

          <div class="col-12 col-md-8">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input ref="nombre" v-model="form.nombre" type="text" class="form-control" placeholder="Ej: Atlas Copco">
              <p v-if="errors.nombre" class="text-danger small mt-1">{{ errors.nombre }}</p>
            </div>

            <div class="mb-3">
              <label class="form-label">Descripcion</label>
              <textarea v-model="form.descripcion" class="form-control" rows="5" placeholder="Resumen corto de la marca"></textarea>
            </div>

            <div class="form-check form-switch">
              <input id="marca-estado" v-model="form.estado" class="form-check-input" type="checkbox">
              <label class="form-check-label" for="marca-estado">Visible</label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-2">
          <router-link :to="cancelLink" class="btn btn-danger cancel-button">Cancelar</router-link>
          <button type="submit" class="btn btn-primary">{{ submitLabel }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarcaForm',
  props: {
    initialValue: {
      type: Object,
      default: () => ({})
    },
    submitLabel: {
      type: String,
      default: 'Guardar'
    },
    cancelLink: {
      type: String,
      default: '/marcas'
    },
    requireLogo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        nombre: '',
        descripcion: '',
        estado: true
      },
      logo: null,
      logoPreview: '',
      logoName: 'Sin archivo',
      errors: {}
    };
  },
  watch: {
    initialValue: {
      immediate: true,
      deep: true,
      handler(value) {
        this.form = {
          nombre: value?.nombre || '',
          descripcion: value?.descripcion || '',
          estado: typeof value?.estado === 'boolean' ? value.estado : true
        };
        this.errors = {};
      }
    }
  },
  methods: {
    notifyError(text) {
      this.$notify({ group: 'foo', title: 'ERROR', text, type: 'error' });
    },
    onLogoChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      if (file.type !== 'image/webp') {
        this.errors.logo = 'El logo debe estar en formato WebP';
        this.notifyError('El logo debe estar en formato WebP');
        event.target.value = null;
        return;
      }

      if (file.size > 500 * 1024) {
        this.errors.logo = 'El logo no puede superar los 500 KB';
        this.notifyError('El logo no puede superar los 500 KB');
        event.target.value = null;
        return;
      }

      this.logo = file;
      this.logoPreview = URL.createObjectURL(file);
      this.logoName = file.name;
      this.errors.logo = '';
    },
    removeLogo() {
      this.logo = null;
      this.logoPreview = '';
      this.logoName = 'Sin archivo';
      this.errors.logo = '';
      if (this.$refs.logo) this.$refs.logo.value = null;
    },
    handleSubmit() {
      this.errors = {};
      if (!this.form.nombre.trim()) {
        this.errors.nombre = 'Ingresa el nombre de la marca';
        this.notifyError('Ingresa el nombre de la marca');
        this.$nextTick(() => this.$refs.nombre && this.$refs.nombre.focus());
        return;
      }

      if (this.requireLogo && !this.logoPreview && !this.logo) {
        this.errors.logo = 'Debes subir un logo WebP';
        this.notifyError('Debes subir un logo WebP');
        return;
      }

      this.$emit('submit', {
        form: { ...this.form },
        logo: this.logo
      });
    }
  }
};
</script>

<style scoped>
.marca-logo-card {
  border: 1px dashed #d7def0;
  border-radius: 16px;
  padding: 1.25rem;
}

.marca-logo-preview {
  width: 100%;
  min-height: 160px;
  border-radius: 12px;
  background: #f9fbff;
  border: 1px solid #edf2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}

.marca-logo-preview img {
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
}

.marca-logo-preview span {
  color: #95aac9;
  font-size: 0.9rem;
}

.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
