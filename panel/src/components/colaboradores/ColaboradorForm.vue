<template>
  <div class="card">
    <div class="card-body">
      <form novalidate @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-12 col-md-4 mb-4">
            <label class="form-label">Avatar WebP</label>
            <div class="colaborador-avatar-card">
              <div class="avatar avatar-xxl mb-3">
                <img class="avatar-img rounded-circle" :src="avatarPreview" alt="Avatar colaborador">
              </div>

              <div class="d-flex flex-wrap justify-content-center gap-2">
                <button type="button" class="btn btn-white" @click="$refs.avatar.click()">Subir WebP</button>
                <button v-if="showRemoveAvatar" type="button" class="btn btn-white text-danger" @click="removeAvatar">
                  Quitar
                </button>
              </div>

              <p class="text-muted small mt-3 mb-0 text-center">
                {{ avatarName }}<br>Solo WebP, maximo 500 KB.
              </p>
              <p v-if="errors.avatar" class="text-danger small mt-2 mb-0 text-center">{{ errors.avatar }}</p>
            </div>
            <input ref="avatar" type="file" class="d-none" accept="image/webp" @change="onAvatarChange">
          </div>

          <div class="col-12 col-md-8">
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <label class="form-label">Nombres</label>
                <input ref="nombres" v-model="form.nombres" type="text" class="form-control" placeholder="Nombres del colaborador">
                <p v-if="errors.nombres" class="text-danger small mt-1">{{ errors.nombres }}</p>
              </div>

              <div class="col-12 col-md-6 mb-3">
                <label class="form-label">Apellidos</label>
                <input ref="apellidos" v-model="form.apellidos" type="text" class="form-control" placeholder="Apellidos del colaborador">
                <p v-if="errors.apellidos" class="text-danger small mt-1">{{ errors.apellidos }}</p>
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Email</label>
                <input ref="email" v-model="form.email" type="text" class="form-control" placeholder="correo@empresa.com">
                <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
              </div>

              <div class="col-12 col-md-6 mb-3">
                <label class="form-label">Rol</label>
                <select ref="rol" v-model="form.rol" class="form-select">
                  <option value="">Selecciona un rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Inventariado">Inventariado</option>
                </select>
                <p v-if="errors.rol" class="text-danger small mt-1">{{ errors.rol }}</p>
              </div>
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
const DEFAULT_AVATAR = '/assets/media/usuario.png';

export default {
  name: 'ColaboradorForm',
  props: {
    initialValue: {
      type: Object,
      default: () => ({})
    },
    initialAvatarUrl: {
      type: String,
      default: DEFAULT_AVATAR
    },
    initialAvatarName: {
      type: String,
      default: 'Sin archivo'
    },
    submitLabel: {
      type: String,
      default: 'Guardar'
    },
    cancelLink: {
      type: String,
      default: '/colaborador'
    }
  },
  data() {
    return {
      form: {
        nombres: '',
        apellidos: '',
        email: '',
        rol: ''
      },
      avatarFile: null,
      avatarPreview: this.initialAvatarUrl || DEFAULT_AVATAR,
      avatarName: this.initialAvatarName || 'Sin archivo',
      removeAvatarFlag: false,
      errors: {}
    };
  },
  computed: {
    showRemoveAvatar() {
      return !!this.avatarFile || (this.avatarPreview && this.avatarPreview !== DEFAULT_AVATAR);
    }
  },
  watch: {
    initialValue: {
      immediate: true,
      deep: true,
      handler(value) {
        this.form = {
          nombres: value?.nombres || '',
          apellidos: value?.apellidos || '',
          email: value?.email || '',
          rol: value?.rol || ''
        };
      }
    },
    initialAvatarUrl: {
      immediate: true,
      handler(value) {
        if (!this.avatarFile && !this.removeAvatarFlag) {
          this.avatarPreview = value || DEFAULT_AVATAR;
        }
      }
    },
    initialAvatarName: {
      immediate: true,
      handler(value) {
        if (!this.avatarFile && !this.removeAvatarFlag) {
          this.avatarName = value || 'Sin archivo';
        }
      }
    }
  },
  methods: {
    notifyError(text) {
      this.$notify({ group: 'foo', title: 'ERROR', text, type: 'error' });
    },
    isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
    },
    focusFirstError(refName) {
      this.$nextTick(() => {
        const field = this.$refs[refName];
        if (field && typeof field.focus === 'function') {
          field.focus();
        }
      });
    },
    onAvatarChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const validTypes = ['image/webp'];
      if (!validTypes.includes(file.type)) {
        this.errors.avatar = 'El avatar debe estar en formato WebP';
        this.notifyError('El avatar debe estar en formato WebP');
        event.target.value = null;
        return;
      }

      if (file.size > 500 * 1024) {
        this.errors.avatar = 'El avatar no puede superar los 500 KB';
        this.notifyError('El avatar no puede superar los 500 KB');
        event.target.value = null;
        return;
      }

      this.avatarFile = file;
      this.avatarPreview = URL.createObjectURL(file);
      this.avatarName = file.name;
      this.removeAvatarFlag = false;
      this.errors.avatar = '';
    },
    removeAvatar() {
      this.avatarFile = null;
      this.avatarPreview = DEFAULT_AVATAR;
      this.avatarName = 'Sin archivo';
      this.removeAvatarFlag = true;
      this.errors.avatar = '';
      if (this.$refs.avatar) this.$refs.avatar.value = null;
    },
    handleSubmit() {
      this.errors = {};

      if (!this.form.nombres.trim()) {
        this.errors.nombres = 'Ingresa los nombres';
        this.focusFirstError('nombres');
        this.notifyError('Ingresa los nombres');
        return;
      }

      if (!this.form.apellidos.trim()) {
        this.errors.apellidos = 'Ingresa los apellidos';
        this.focusFirstError('apellidos');
        this.notifyError('Ingresa los apellidos');
        return;
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'Ingresa el email';
        this.focusFirstError('email');
        this.notifyError('Ingresa el email');
        return;
      }

      if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Ingresa un email valido';
        this.focusFirstError('email');
        this.notifyError('Ingresa un email valido');
        return;
      }

      if (!this.form.rol) {
        this.errors.rol = 'Selecciona un rol';
        this.focusFirstError('rol');
        this.notifyError('Selecciona un rol');
        return;
      }

      this.$emit('submit', {
        form: { ...this.form },
        avatarFile: this.avatarFile,
        removeAvatar: this.removeAvatarFlag
      });
    }
  }
};
</script>

<style scoped>
.colaborador-avatar-card {
  border: 1px dashed #d7def0;
  border-radius: 16px;
  padding: 1.25rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar-xxl {
  width: 7rem;
  height: 7rem;
}

.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
