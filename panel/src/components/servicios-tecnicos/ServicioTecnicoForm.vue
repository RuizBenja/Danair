<template>
  <div class="card">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <label class="form-label">Titulo</label>
          <input
            ref="titulo"
            class="form-control"
            v-model="form.titulo"
            placeholder="Ej: Mantencion y soporte especializado"
          />
          <p v-if="errors.titulo" class="text-danger small mt-1">{{ errors.titulo }}</p>
        </div>

        <div class="col-12">
          <label class="form-label">Imagen WebP</label>
          <div class="service-file-box d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <button type="button" class="btn btn-outline-primary" @click="$refs.imagen.click()">
                Subir WebP
              </button>
              <small class="text-muted text-break">{{ imageName }}</small>
            </div>
            <div class="text-muted small service-file-help">
              Solo WebP, maximo 500 KB.
            </div>
            <input
              ref="imagen"
              type="file"
              class="d-none"
              accept="image/webp"
              @change="$emit('file-change', $event)"
            />
          </div>
          <p v-if="errors.imagen" class="text-danger small mt-1">{{ errors.imagen }}</p>
        </div>

        <div class="col-12">
          <label class="form-label">Extracto</label>
          <textarea
            ref="extracto"
            class="form-control"
            rows="2"
            v-model="form.extracto"
            placeholder="Resumen corto para cards y vistas generales"
          ></textarea>
          <p v-if="errors.extracto" class="text-danger small mt-1">{{ errors.extracto }}</p>
        </div>

        <div class="col-12">
          <label class="form-label">Descripcion</label>
          <textarea
            ref="descripcion"
            class="form-control"
            rows="5"
            v-model="form.descripcion"
            placeholder="Contenido principal de la pagina del servicio tecnico"
          ></textarea>
          <p v-if="errors.descripcion" class="text-danger small mt-1">{{ errors.descripcion }}</p>
        </div>

        <div class="col-12">
          <button
            class="btn btn-link px-0 text-decoration-none"
            type="button"
            @click="$emit('toggle-advanced')"
          >
            {{ showAdvanced ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas' }}
          </button>
        </div>
      </div>

      <div v-if="showAdvanced" class="advanced-box mt-2">
        <p class="text-muted small mb-3">
          Si dejas estos campos vacios, la web podra usar el titulo y el extracto como valores por defecto.
        </p>
        <div class="row g-3">
          <div class="col-12 col-lg-6">
            <label class="form-label">SEO title (opcional)</label>
            <input class="form-control" v-model="form.seo_title" placeholder="Si se deja vacio, se usa el titulo" />
          </div>
          <div class="col-12 col-lg-6">
            <label class="form-label">SEO description (opcional)</label>
            <textarea
              class="form-control"
              rows="2"
              v-model="form.seo_description"
              placeholder="Si se deja vacio, se puede usar el extracto"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 border-top pt-3">
        <div class="form-check form-switch m-0">
          <input class="form-check-input" type="checkbox" v-model="form.estado" />
          <label class="form-check-label">Visible</label>
        </div>

        <div class="d-flex align-items-center gap-2">
          <router-link v-if="showCancel" to="/servicios-tecnicos" class="btn btn-danger cancel-button">
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
export default {
  name: 'ServicioTecnicoForm',
  props: {
    form: { type: Object, required: true },
    errors: { type: Object, default: () => ({}) },
    imageName: { type: String, default: 'Sin archivo seleccionado' },
    showAdvanced: { type: Boolean, default: false },
    submitLabel: { type: String, default: 'Guardar servicio tecnico' },
    showCancel: { type: Boolean, default: true }
  }
}
</script>

<style scoped>
.advanced-box {
  padding: 1rem 1.25rem;
  border: 1px dashed #d2ddec;
  border-radius: 0.875rem;
  background: #f9fbff;
}

.service-file-box {
  padding: 0.9rem 1rem;
  border: 1px solid #e6ebf1;
  border-radius: 0.875rem;
  background: #fff;
}

.service-file-help {
  white-space: nowrap;
}

.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
