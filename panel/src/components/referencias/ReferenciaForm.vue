<template>
  <div class="card">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-12 col-lg-4">
          <label class="form-label">Clasificar por</label>
          <select ref="clasificacion" class="form-select" :value="classificationMode" @change="$emit('classification-change', $event.target.value)">
            <option value="industria">Industria</option>
            <option value="producto">Producto</option>
            <option value="ambas">Ambas</option>
          </select>
          <p class="text-muted small mt-1 mb-0">
            Elige si esta ficha se asociará a industria, producto o ambas.
          </p>
        </div>

        <div v-if="showIndustriaField" class="col-12 col-lg-4">
          <label class="form-label">
            Categoría de industria
            <span class="text-muted">{{ classificationMode === 'ambas' ? '(opcional)' : '' }}</span>
          </label>
          <select ref="industria_categoria" class="form-select" v-model="form.industria_categoria">
            <option value="">Sin categoría de industria</option>
            <option v-for="categoria in categoriasIndustria" :key="categoria._id" :value="categoria._id">
              {{ categoria.nombre }}
            </option>
          </select>
          <p v-if="errors.industria_categoria" class="text-danger small mt-1">{{ errors.industria_categoria }}</p>
        </div>

        <div v-if="showProductoField" class="col-12 col-lg-4">
          <label class="form-label">
            Categoría de producto
            <span class="text-muted">{{ classificationMode === 'ambas' ? '(opcional)' : '' }}</span>
          </label>
          <select ref="producto_categoria" class="form-select" v-model="form.producto_categoria">
            <option value="">Sin categoría de producto</option>
            <option v-for="categoria in categoriasProducto" :key="categoria._id" :value="categoria._id">
              {{ categoria.nombre }}
            </option>
          </select>
          <p v-if="errors.producto_categoria" class="text-danger small mt-1">{{ errors.producto_categoria }}</p>
        </div>

        <div class="col-12">
          <p v-if="errors.categorias" class="text-danger small mb-0">{{ errors.categorias }}</p>
        </div>

        <div class="col-12 col-lg-6">
          <label class="form-label">Título</label>
          <input
            ref="titulo"
            class="form-control"
            v-model="form.titulo"
            placeholder="Ej: Industria construcción"
          />
          <p v-if="errors.titulo" class="text-danger small mt-1">{{ errors.titulo }}</p>
        </div>

        <div class="col-12 col-lg-6">
          <label class="form-label">Imagen WebP</label>
          <div class="reference-file-inline">
            <button type="button" class="btn btn-outline-primary reference-file-button" @click="$refs.imagen.click()">
              Subir WebP
            </button>
            <div class="reference-file-meta">
              <small class="text-muted d-block reference-file-name">{{ imageName }}</small>
              <small class="text-muted d-block">Solo WebP, máximo 500 KB.</small>
            </div>
          </div>
          <input
            ref="imagen"
            type="file"
            class="d-none"
            accept="image/webp"
            @change="$emit('file-change', $event)"
          />
          <p v-if="errors.imagen" class="text-danger small mt-1">{{ errors.imagen }}</p>
        </div>

        <div class="col-12 col-lg-4">
          <label class="form-label">Comuna</label>
          <div class="reference-select-shell">
            <span class="reference-select-shell__icon"><i class="fe fe-map-pin"></i></span>
            <BasicSelect
              ref="comuna"
              :options="comunaOptions"
              :selected-option="selectedComuna"
              placeholder="Busca o selecciona una comuna"
              @select="$emit('comuna-select', $event)"
            />
          </div>
          <p v-if="errors.comuna" class="text-danger small mt-1">{{ errors.comuna }}</p>
        </div>

        <div class="col-12 col-lg-4">
          <label class="form-label">Región</label>
          <div class="icon-field-shell">
            <span class="icon-field-shell__icon"><i class="fe fe-globe"></i></span>
            <input ref="region" class="icon-field-shell__input" :value="form.region" readonly />
          </div>
          <p v-if="errors.region" class="text-danger small mt-1">{{ errors.region }}</p>
        </div>

        <div class="col-12 col-lg-4">
          <label class="form-label">Año</label>
          <div class="icon-field-shell icon-field-shell--date">
            <span class="icon-field-shell__icon"><i class="fe fe-calendar"></i></span>
            <input
              ref="anio"
              class="icon-field-shell__input"
              type="date"
              :value="selectedDate"
              @input="$emit('year-date-input', $event.target.value)"
            />
          </div>
          <p class="text-muted small mt-1 mb-0">Se guardará solo el año.</p>
          <p v-if="errors.anio" class="text-danger small mt-1">{{ errors.anio }}</p>
        </div>

        <div class="col-12 col-lg-4">
          <label class="form-label">Marca</label>
          <select ref="marca" class="form-select" v-model="form.marca">
            <option value="">Selecciona una marca</option>
            <option v-for="marca in marcasActivas" :key="marca._id" :value="marca.nombre">
              {{ marca.nombre }}
            </option>
          </select>
          <p v-if="errors.marca" class="text-danger small mt-1">{{ errors.marca }}</p>
        </div>

        <div class="col-12 col-lg-4">
          <label class="form-label">Modelo</label>
          <input ref="modelo" class="form-control" v-model="form.modelo" />
          <p v-if="errors.modelo" class="text-danger small mt-1">{{ errors.modelo }}</p>
        </div>

        <div class="col-12 col-lg-4">
          <label class="form-label">Potencia (opcional)</label>
          <input class="form-control" v-model="form.potencia" placeholder="Ej: 15 kW" />
        </div>

        <div class="col-12 col-lg-6">
          <label class="form-label">Caudal (opcional)</label>
          <input class="form-control" v-model="form.caudal" placeholder="Ej: 6,5 Nm3/min" />
        </div>

        <div class="col-12 col-lg-6">
          <label class="form-label">Presión (opcional)</label>
          <input class="form-control" v-model="form.presion" placeholder="Ej: 10 bar" />
        </div>
      </div>

      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 border-top pt-3">
        <div class="form-check form-switch m-0">
          <input class="form-check-input" type="checkbox" v-model="form.estado" />
          <label class="form-check-label">Visible</label>
        </div>

        <div class="d-flex align-items-center gap-2">
          <router-link v-if="showCancel" to="/referencias" class="btn btn-danger cancel-button">
            Cancelar
          </router-link>
          <button class="btn btn-primary px-4" type="button" @click="$emit('submit')">
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BasicSelect } from 'vue-search-select';

export default {
  name: 'ReferenciaForm',
  components: { BasicSelect },
  props: {
    form: { type: Object, required: true },
    categorias: { type: Array, default: () => [] },
    marcas: { type: Array, default: () => [] },
    comunaOptions: { type: Array, default: () => [] },
    selectedComuna: { type: Object, default: () => ({}) },
    selectedDate: { type: String, default: '' },
    errors: { type: Object, default: () => ({}) },
    imageName: { type: String, default: 'Sin archivo seleccionado' },
    submitLabel: { type: String, default: 'Guardar referencia' },
    showCancel: { type: Boolean, default: true },
    classificationMode: { type: String, default: 'ambas' }
  },
  computed: {
    categoriasIndustria() {
      return this.categorias.filter((categoria) => categoria.tipo === 'industria' && categoria.estado);
    },
    categoriasProducto() {
      return this.categorias.filter((categoria) => categoria.tipo === 'producto' && categoria.estado);
    },
    marcasActivas() {
      return this.marcas.filter((marca) => marca.estado !== false);
    },
    showIndustriaField() {
      return this.classificationMode === 'industria' || this.classificationMode === 'ambas';
    },
    showProductoField() {
      return this.classificationMode === 'producto' || this.classificationMode === 'ambas';
    }
  }
}
</script>

<style scoped>
.reference-file-inline {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-height: calc(1.5em + 1rem + 2px);
}

.reference-file-button {
  min-width: 124px;
  padding-top: 0.42rem;
  padding-bottom: 0.42rem;
  flex-shrink: 0;
}

.reference-file-meta {
  min-width: 0;
  line-height: 1.2;
}

.reference-file-name {
  max-width: 100%;
  word-break: break-word;
}

.reference-select-shell {
  position: relative;
}

.reference-select-shell__icon {
  position: absolute;
  top: 50%;
  left: 0.95rem;
  transform: translateY(-50%);
  color: #95aac9;
  pointer-events: none;
  z-index: 2;
}

.reference-select-shell :deep(.vue-search-select),
.reference-select-shell :deep(.ui.selection.dropdown) {
  width: 100%;
}

.reference-select-shell :deep(.ui.selection.dropdown) {
  min-height: calc(1.5em + 1rem + 2px);
  padding: 0.5rem 0.875rem 0.5rem 2.6rem;
  border: 1px solid #d2ddec;
  border-radius: 0.5rem;
  background: #fff;
  color: #12263f;
  box-shadow: none;
  display: flex;
  align-items: center;
}

.reference-select-shell :deep(.ui.selection.dropdown:focus),
.reference-select-shell :deep(.ui.selection.dropdown.active),
.reference-select-shell :deep(.ui.selection.dropdown.visible) {
  border-color: #2c7be5;
  box-shadow: 0 0 0 0.2rem rgba(44, 123, 229, 0.15);
}

.reference-select-shell :deep(.ui.selection.dropdown > .text),
.reference-select-shell :deep(.ui.selection.dropdown > input.search) {
  min-height: auto;
  line-height: 1.5;
  color: #12263f !important;
}

.reference-select-shell :deep(.ui.selection.dropdown > .dropdown.icon) {
  display: none !important;
}

.reference-select-shell :deep(.menu.transition.visible) {
  border-radius: 0.5rem;
  border-color: #d2ddec;
}

.icon-field-shell {
  position: relative;
}

.icon-field-shell__icon {
  position: absolute;
  top: 50%;
  left: 0.95rem;
  transform: translateY(-50%);
  color: #95aac9;
  pointer-events: none;
  z-index: 1;
}

.icon-field-shell__input {
  width: 100%;
  min-height: calc(1.5em + 1rem + 2px);
  padding: 0.5rem 0.875rem 0.5rem 2.6rem;
  border: 1px solid #d2ddec;
  border-radius: 0.5rem;
  background: #fff;
  color: #12263f;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.icon-field-shell__input:focus {
  outline: 0;
  border-color: #2c7be5;
  box-shadow: 0 0 0 0.2rem rgba(44, 123, 229, 0.15);
}

.icon-field-shell__input[readonly] {
  color: #12263f;
}

.icon-field-shell__input::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

.icon-field-shell--date .icon-field-shell__input {
  padding-right: 0.75rem;
}

.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
