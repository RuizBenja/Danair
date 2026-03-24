<!-- TopNav.vue -->
<template>
  <nav class="navbar navbar-expand-md navbar-light d-md-flex">
    <div class="container-fluid">
      <form class="form-inline me-4 d-none d-md-flex"></form>

      <div class="navbar-user">
        <div class="dropdown text-center">
          <a
            href="#"
            class="d-inline-flex flex-column align-items-center text-decoration-none dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span class="avatar avatar-sm avatar-online">
              <img :src="avatarUrl" alt="avatar" class="avatar-img rounded-circle" style="-webkit-mask-image: none;">
            </span>
            <small class="text-muted mt-1">{{ displayName }}</small>
          </a>

          <div class="dropdown-menu dropdown-menu-end">
            <router-link to="/perfil" class="dropdown-item d-flex align-items-center">
              <i class="fe fe-user me-2"></i>
              <span>Perfil</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item d-flex align-items-center" @click.prevent="logout">
              <img src="/assets/media/energia.png" alt="Cerrar sesion" style="width: 16px; margin-right: 8px;">
              <span>Cerrar sesion</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopNav',
  data() {
    return {
      userTick: 0
    };
  },
  computed: {
    usuario() {
      this.userTick;
      try {
        return JSON.parse(localStorage.getItem('usuario')) || null;
      } catch (e) {
        return null;
      }
    },
    avatarUrl() {
      if (this.usuario && this.usuario.avatar && this.usuario.avatar !== 'default.jpg' && this.usuario.avatar !== 'default.png') {
        return this.$url + '/obtener_avatar_usuario/' + this.usuario.avatar + '?t=' + this.userTick;
      }
      return '/assets/media/usuario.png';
    },
    displayName() {
      if (!this.usuario) return 'Usuario';
      const n = (this.usuario.nombres || '').trim();
      const a = (this.usuario.apellidos || '').trim();
      const full = (n + ' ' + a).trim();
      return full || (this.usuario.email || 'Usuario');
    }
  },
  methods: {
    refreshUser() {
      this.userTick = Date.now();
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    }
  },
  mounted() {
    window.addEventListener('storage', this.refreshUser);
    window.addEventListener('usuario-updated', this.refreshUser);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.refreshUser);
    window.removeEventListener('usuario-updated', this.refreshUser);
  }
};
</script>
