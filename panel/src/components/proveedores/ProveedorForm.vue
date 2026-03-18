<template>
  <div class="row g-3">
    <div class="col-12 col-md-6">
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input ref="nombre" type="text" class="form-control" :value="value.nombre" @input="updateField('nombre', $event.target.value)" placeholder="Proveedor SPA">
        <p v-if="errors.nombre" class="text-danger small mt-1">{{ errors.nombre }}</p>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <div class="form-group">
        <label class="form-label">Contacto</label>
        <input ref="contacto" type="text" class="form-control" :value="value.contacto" @input="updateField('contacto', $event.target.value)" placeholder="Nombre de contacto">
        <p v-if="errors.contacto" class="text-danger small mt-1">{{ errors.contacto }}</p>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input ref="email" type="email" class="form-control" :value="value.email" @input="updateField('email', $event.target.value)" placeholder="correo@proveedor.com">
        <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <div class="form-group">
        <label class="form-label">Telefono</label>
        <input ref="telefono" type="text" class="form-control" :value="value.telefono" @input="updateField('telefono', $event.target.value)" placeholder="+569 54759527">
        <p v-if="errors.telefono" class="text-danger small mt-1">{{ errors.telefono }}</p>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <div class="form-group">
        <label class="form-label">Telefono alterno (opcional)</label>
        <input type="text" class="form-control" :value="value.telefono_alt" @input="updateField('telefono_alt', $event.target.value)" placeholder="+569 54759527">
      </div>
    </div>
    <div class="col-12 col-md-6">
      <div class="form-group">
        <label class="form-label">Sitio web (opcional)</label>
        <input type="text" class="form-control" :value="value.sitio" @input="updateField('sitio', $event.target.value)" placeholder="https://...">
      </div>
    </div>
    <div class="col-12">
      <div class="form-group">
        <label class="form-label">Direccion</label>
        <input ref="direccion" type="text" class="form-control" :value="value.direccion" @input="updateField('direccion', $event.target.value)" placeholder="Calle 123, Ciudad">
        <p v-if="errors.direccion" class="text-danger small mt-1">{{ errors.direccion }}</p>
      </div>
    </div>
    <div class="col-12">
      <div class="form-group">
        <label class="form-label">Notas internas (opcional)</label>
        <textarea class="form-control" rows="3" :value="value.notas" @input="updateField('notas', $event.target.value)" placeholder="Condiciones, formas de pago, observaciones"></textarea>
      </div>
    </div>
    <div v-if="showEstado" class="col-12">
      <div class="form-check form-switch mt-2">
        <input class="form-check-input" type="checkbox" :checked="value.estado" @change="updateField('estado', $event.target.checked)" :id="estadoId">
        <label class="form-check-label" :for="estadoId">Activo</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProveedorForm',
  props: {
    value: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    },
    showEstado: {
      type: Boolean,
      default: false
    },
    estadoId: {
      type: String,
      default: 'prov-estado'
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('input', { ...this.value, [field]: fieldValue });
    }
  }
};
</script>
