<template>
  <div class="card">
    <div class="card-body">
      <form novalidate @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input
            ref="nombre"
            v-model="form.nombre"
            type="text"
            class="form-control"
            placeholder="Ej: Anest Iwata SCR"
          >
          <p v-if="error" class="text-danger small mt-1">{{ error }}</p>
        </div>

        <div class="form-check form-switch mb-4">
          <input id="marca-producto-estado" v-model="form.estado" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="marca-producto-estado">Visible</label>
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
  name: 'MarcaProductoForm',
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
      default: '/marcas-producto'
    }
  },
  data() {
    return {
      form: {
        nombre: '',
        estado: true
      },
      error: ''
    };
  },
  watch: {
    initialValue: {
      immediate: true,
      deep: true,
      handler(value) {
        this.form = {
          nombre: value?.nombre || '',
          estado: typeof value?.estado === 'boolean' ? value.estado : true
        };
        this.error = '';
      }
    }
  },
  methods: {
    handleSubmit() {
      this.error = '';
      if (!this.form.nombre.trim()) {
        this.error = 'Ingresa el nombre de la marca';
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Ingresa el nombre de la marca', type: 'error' });
        this.$nextTick(() => this.$refs.nombre && this.$refs.nombre.focus());
        return;
      }

      this.$emit('submit', { ...this.form });
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
