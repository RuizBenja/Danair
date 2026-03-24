<template>
  <div class="card">
    <div class="card-body">
      <form novalidate @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">Titulo</label>
          <input
            ref="titulo"
            v-model="titulo"
            type="text"
            class="form-control"
            placeholder="Ej: Compresores de tornillo"
          >
          <p v-if="error" class="text-danger small mt-1">{{ error }}</p>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <router-link :to="cancelLink" class="btn btn-danger cancel-button">Cancelar</router-link>
          <button type="submit" class="btn btn-primary">{{ submitLabel }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoriaForm',
  props: {
    initialValue: {
      type: String,
      default: ''
    },
    submitLabel: {
      type: String,
      default: 'Guardar'
    },
    cancelLink: {
      type: String,
      default: '/categorias'
    }
  },
  data() {
    return {
      titulo: this.initialValue || '',
      error: ''
    };
  },
  watch: {
    initialValue(value) {
      this.titulo = value || '';
      this.error = '';
    }
  },
  methods: {
    handleSubmit() {
      this.error = '';
      if (!this.titulo.trim()) {
        this.error = 'Ingresa el titulo de la categoria';
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Ingresa el titulo de la categoria', type: 'error' });
        this.$nextTick(() => this.$refs.titulo && this.$refs.titulo.focus());
        return;
      }

      this.$emit('submit', this.titulo.trim());
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
