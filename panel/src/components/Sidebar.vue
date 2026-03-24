<template>
  <nav class="navbar navbar-vertical fixed-start navbar-expand-md navbar-light" id="sidebar">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <router-link class="navbar-brand" to="/dashboard">
        <img src="/assets/img/Logo-DanAir-con-Banderas-Grande.webp" class="navbar-brand-img navbar-brand-danair mx-auto" alt="DanAir">
      </router-link>

      <div class="navbar-user d-md-none">
        <div class="dropdown">
          <a href="#" id="sidebarIcon" class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="avatar avatar-sm avatar-online">
              <img :src="avatarUrl" class="avatar-img rounded-circle" alt="avatar">
            </div>
          </a>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="sidebarIcon">
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

      <div class="collapse navbar-collapse" id="sidebarCollapse">
        <form class="mt-4 mb-3 d-md-none">
          <div class="input-group input-group-rounded input-group-merge input-group-reverse">
            <input class="form-control" type="search" placeholder="Search" aria-label="Search">
            <div class="input-group-text"><span class="fe fe-search"></span></div>
          </div>
        </form>

        <h6 class="navbar-heading">PRINCIPAL</h6>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active"><i class="fe fe-home"></i> Inicio</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/colaborador" class="nav-link" active-class="active"><i class="fe fe-user"></i> Colaboradores</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin || isInventariado">
            <router-link to="/proveedor" class="nav-link" active-class="active"><i class="fe fe-box"></i> Proveedores</router-link>
          </li>
        </ul>

        <hr class="navbar-divider my-3">
        <h6 class="navbar-heading">CATALOGO</h6>
        <ul class="navbar-nav mb-md-4">
          <li class="nav-item" v-if="isAdmin || isInventariado">
            <router-link to="/categorias" class="nav-link" active-class="active"><i class="fe fe-tag"></i> Categorias</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin || isInventariado">
            <router-link to="/producto" class="nav-link" active-class="active"><i class="fe fe-shopping-cart"></i> Productos</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin || isInventariado">
            <router-link to="/marcas-producto" class="nav-link" active-class="active"><i class="fe fe-star"></i> Marcas de producto</router-link>
          </li>
        </ul>

        <hr class="navbar-divider my-3">
        <h6 class="navbar-heading">CONTENIDO WEB</h6>
        <ul class="navbar-nav mb-md-4">
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/marcas" class="nav-link" active-class="active"><i class="fe fe-award"></i> Marcas representativas</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/servicios" class="nav-link" active-class="active"><i class="fe fe-layers"></i> Servicios</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/servicios-tecnicos" class="nav-link" active-class="active"><i class="fe fe-settings"></i> Servicios tecnicos</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/proyectos" class="nav-link" active-class="active"><i class="fe fe-briefcase"></i> Proyectos destacados</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/referencias" class="nav-link" active-class="active"><i class="fe fe-aperture"></i> Referencias</router-link>
          </li>
        </ul>

        <div class="mt-auto"></div>

        <div class="navbar-user d-none d-md-flex text-center" id="sidebarUser">
          <div class="dropup w-100">
            <a href="#" id="sidebarIconCopy" class="dropdown-toggle d-inline-flex flex-column align-items-center text-decoration-none" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div class="avatar avatar-sm avatar-online">
                <img :src="avatarUrl" class="avatar-img rounded-circle" alt="avatar" style="-webkit-mask-image: none;">
              </div>
              <small class="text-muted mt-1">{{ displayName }}</small>
            </a>
            <div class="dropdown-menu" aria-labelledby="sidebarIconCopy">
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
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
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
    rol() {
      return this.usuario ? this.usuario.rol : null;
    },
    displayName() {
      if (!this.usuario) return 'Usuario';
      const n = (this.usuario.nombres || '').trim();
      const a = (this.usuario.apellidos || '').trim();
      const full = (n + ' ' + a).trim();
      return full || (this.usuario.email || 'Usuario');
    },
    isAdmin() {
      return this.rol === 'Administrador';
    },
    isVendedor() {
      return this.rol === 'Vendedor';
    },
    isInventariado() {
      return this.rol === 'Inventariado';
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

<style scoped>
.navbar-brand-danair {
  max-width: 185px;
  width: 100%;
  height: auto;
}
</style>
