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
                    <h6 class="header-pretitle">Cuenta</h6>
                    <h1 class="header-title">Perfil</h1>
                  </div>
                </div>
              </div>
            </div>

            <div class="card profile-card shadow-sm">
              <div class="card-body p-0">
                <div class="profile-hero">
                  <div class="profile-hero__glow"></div>
                  <div class="profile-hero__content">
                    <div class="profile-avatar-wrap">
                      <img class="profile-avatar" :src="avatarPreview" alt="avatar">
                    </div>

                    <div class="profile-heading text-center text-md-start">
                      <h2 class="profile-name mb-1">{{ displayName }}</h2>
                      <p class="profile-role mb-1">{{ perfil.rol || 'Usuario' }}</p>
                      <p class="profile-email mb-0">{{ perfil.email || 'Sin correo registrado' }}</p>
                    </div>

                    <div class="profile-actions">
                      <small class="profile-upload-help">Solo WebP, maximo 500KB.</small>
                      <div class="profile-action-buttons">
                        <button class="btn btn-sm btn-light-primary" type="button" @click="$refs.avatar.click()">Subir WebP</button>
                        <button v-if="showRemove" class="btn btn-sm btn-outline-light" type="button" @click="removeAvatar">Quitar</button>
                      </div>
                    </div>
                  </div>
                  <input ref="avatar" type="file" class="d-none" @change="onAvatarChange" accept="image/webp">
                </div>

                <div class="profile-body p-4 p-md-5">
                  <div class="row g-3">
                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label class="form-label">Nombres</label>
                        <input ref="nombres" type="text" class="form-control" v-model="perfil.nombres" placeholder="Nombres completos">
                        <p v-if="errors.nombres" class="text-danger small mt-1">{{ errors.nombres }}</p>
                      </div>
                    </div>

                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label class="form-label">Apellidos</label>
                        <input ref="apellidos" type="text" class="form-control" v-model="perfil.apellidos" placeholder="Apellidos completos">
                        <p v-if="errors.apellidos" class="text-danger small mt-1">{{ errors.apellidos }}</p>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-group">
                        <label class="mb-1">Correo electronico</label>
                        <small class="form-text text-muted">Se usa para iniciar sesion.</small>
                        <input ref="email" type="email" class="form-control" v-model="perfil.email" placeholder="Correo electronico">
                        <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
                      </div>
                    </div>

                    <div class="col-12 col-md-6">
                      <div class="form-group">
                        <label class="form-label">Cargo</label>
                        <input type="text" class="form-control" :value="perfil.rol || '-'" disabled>
                      </div>
                    </div>
                  </div>

                  <hr class="my-5">

                  <div class="d-flex align-items-center gap-3 flex-wrap">
                    <button type="button" class="btn btn-primary" @click="guardar">Guardar cambios</button>
                    <router-link to="/dashboard" class="btn btn-danger cancel-button">Cancelar</router-link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';

const MAX_WEBP = 500 * 1024;

export default {
  name: 'PerfilApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      perfil: { rol: '' },
      avatarFile: null,
      avatarPreview: '/assets/media/usuario.png',
      errors: {}
    };
  },
  computed: {
    usuarioLocal() {
      try {
        return JSON.parse(localStorage.getItem('usuario')) || null;
      } catch (e) {
        return null;
      }
    },
    userId() {
      return this.usuarioLocal?._id || '';
    },
    showRemove() {
      return !!(this.avatarFile || (this.perfil && this.perfil.avatar && this.perfil.avatar !== 'default.jpg'));
    },
    displayName() {
      const n = (this.perfil.nombres || '').trim();
      const a = (this.perfil.apellidos || '').trim();
      return (n + ' ' + a).trim() || 'Usuario';
    }
  },
  methods: {
    notifyErr(text) {
      this.$notify({ group: 'foo', title: 'ERROR', text, type: 'error' });
    },
    initData() {
      if (!this.userId) {
        this.$router.push({ name: 'dashboard' });
        return;
      }
      axios.get(this.$url + '/obtener_usuario_admin/' + this.userId, {
        headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
      }).then((result) => {
        if (!result.data) {
          this.$router.push({ name: 'dashboard' });
          return;
        }
        this.perfil = result.data;
        const hasAvatar = result.data.avatar && result.data.avatar !== 'default.jpg';
        this.avatarPreview = hasAvatar ? this.$url + '/obtener_avatar_usuario/' + result.data.avatar + '?t=' + Date.now() : '/assets/media/usuario.png';
      }).catch(() => {
        this.notifyErr('No se pudo cargar el perfil');
      });
    },
    onAvatarChange(e) {
      const file = e.target.files[0];
      if (!file) {
        this.resetAvatar();
        return;
      }
      if (file.type !== 'image/webp') {
        this.notifyErr('Solo WebP');
        this.resetAvatar();
        return;
      }
      if (file.size > MAX_WEBP) {
        this.notifyErr('La imagen debe pesar 500KB o menos');
        this.resetAvatar();
        return;
      }
      this.avatarFile = file;
      this.avatarPreview = URL.createObjectURL(file);
    },
    resetAvatar() {
      this.avatarFile = null;
      this.perfil.avatar = null;
      this.avatarPreview = '/assets/media/usuario.png';
      if (this.$refs.avatar) this.$refs.avatar.value = null;
    },
    removeAvatar() {
      this.resetAvatar();
    },
    validateForm() {
      this.errors = {};
      if (!this.perfil.nombres || !this.perfil.nombres.trim()) this.errors.nombres = 'Ingresa los nombres';
      if (!this.perfil.apellidos || !this.perfil.apellidos.trim()) this.errors.apellidos = 'Ingresa los apellidos';
      if (!this.perfil.email || !this.perfil.email.trim()) this.errors.email = 'Ingresa el email';
      else if (!(new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')).test(this.perfil.email.trim())) this.errors.email = 'Ingresa un email valido';
      return !Object.keys(this.errors).length;
    },
    focusFirstError() {
      const order = ['nombres', 'apellidos', 'email'];
      const firstKey = order.find((key) => this.errors[key]);
      if (!firstKey) return;
      this.$nextTick(() => {
        const ref = this.$refs[firstKey];
        const target = Array.isArray(ref) ? ref[0] : ref;
        if (!target) return;
        const container = target.closest('.col-12, .col-md-6') || target;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof target.focus === 'function') target.focus();
      });
    },
    guardar() {
      if (!this.validateForm()) {
        this.notifyErr('Falta completar campos obligatorios');
        this.focusFirstError();
        return;
      }

      const fd = new FormData();
      fd.append('nombres', this.perfil.nombres);
      fd.append('apellidos', this.perfil.apellidos);
      fd.append('email', this.perfil.email);
      fd.append('rol', this.perfil.rol);
      if (this.avatarFile) fd.append('avatar', this.avatarFile);
      if (!this.avatarFile && !this.perfil.avatar) fd.append('avatar', '');

      axios.put(this.$url + '/actualizar_usuario_admin/' + this.userId, fd, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: this.$store.state.token }
      }).then((result) => {
        localStorage.setItem('usuario', JSON.stringify(result.data));
        window.dispatchEvent(new Event('usuario-updated'));
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Perfil actualizado', type: 'success' });
        this.perfil = result.data;
        const hasAvatar = result.data.avatar && result.data.avatar !== 'default.jpg';
        this.avatarPreview = hasAvatar ? this.$url + '/obtener_avatar_usuario/' + result.data.avatar + '?t=' + Date.now() : '/assets/media/usuario.png';
        this.avatarFile = null;
      }).catch((error) => {
        this.notifyErr(error.response?.data?.message || 'No se pudo actualizar el perfil');
      });
    }
  },
  beforeMount() {
    this.initData();
  }
};
</script>

<style scoped>
.profile-card {
  overflow: hidden;
  border: 1px solid #e9eef9;
}

.profile-hero {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  background: linear-gradient(135deg, #17396b 0%, #235a9f 58%, #3f86d1 100%);
}

.profile-hero__glow {
  position: absolute;
  inset: auto -40px -80px auto;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  filter: blur(8px);
}

.profile-hero__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.profile-avatar-wrap {
  flex-shrink: 0;
}

.profile-avatar {
  width: 124px;
  height: 124px;
  object-fit: cover;
  border-radius: 999px;
  border: 4px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 14px 34px rgba(10, 30, 60, 0.28);
  background: #fff;
}

.profile-heading {
  flex: 1 1 280px;
  min-width: 220px;
  color: #fff;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
}

.profile-role {
  color: rgba(255, 255, 255, 0.84);
  font-weight: 600;
}

.profile-email {
  color: rgba(255, 255, 255, 0.72);
}

.profile-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.profile-action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.profile-upload-help {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.82rem;
}

.btn-light-primary {
  background: #fff;
  color: #235a9f;
  border-color: #fff;
}

.btn-light-primary:hover,
.btn-light-primary:focus,
.btn-light-primary:active {
  background: #f3f7fe !important;
  color: #17396b !important;
  border-color: #f3f7fe !important;
}

.profile-actions .btn-outline-light:hover,
.profile-actions .btn-outline-light:focus,
.profile-actions .btn-outline-light:active {
  color: #17396b !important;
  background: #fff !important;
}

.profile-body {
  background: #fff;
}

.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}

@media (max-width: 767.98px) {
  .profile-hero {
    padding: 1.5rem;
  }

  .profile-hero__content {
    justify-content: center;
    text-align: center;
  }

  .profile-actions,
  .profile-action-buttons {
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .profile-avatar {
    width: 108px;
    height: 108px;
  }
}
</style>
