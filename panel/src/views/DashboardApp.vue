<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <div class="header mt-md-4 mb-4">
              <div class="header-body dashboard-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="header-pretitle">PANEL DE INICIO</h6>
                    <h1 class="header-title mb-1">Bienvenido, {{ nombreMostrar }}</h1>
                    <p class="text-muted mb-0">Rol: <strong>{{ rol }}</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarjetas simples -->
            <div class="row">
              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-user"></i></span>
                      <h5 class="card-title mb-0">Colaboradores</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Gestiona los usuarios del sistema.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'colaborador-index' }">Ir a colaboradores</router-link>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin || isInventariado">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-shopping-cart"></i></span>
                      <h5 class="card-title mb-0">Productos</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Administra el catálogo de productos.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'producto-index' }">Ver productos</router-link>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin || isInventariado">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-tag"></i></span>
                      <h5 class="card-title mb-0">Categorías</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Clasifica los productos en familias.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'categorias' }">Ver categorías</router-link>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin || isInventariado">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-star"></i></span>
                      <h5 class="card-title mb-0">Marcas</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Logos y descripcion de marcas representativas.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'marcas' }">Ver marcas representativas</router-link>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-layers"></i></span>
                      <h5 class="card-title mb-0">Servicios</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Gestiona las páginas de servicios.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'servicios' }">Ver servicios</router-link>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-tool"></i></span>
                      <h5 class="card-title mb-0">Servicios técnicos</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Publica servicios técnicos disponibles.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'servicios-tecnicos' }">Ver servicios técnicos</router-link>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-briefcase"></i></span>
                      <h5 class="card-title mb-0">Proyectos</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Destaca proyectos realizados.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'proyectos' }">Ver proyectos</router-link>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 col-xl-4 mb-3" v-if="isAdmin">
                <div class="card card-dashboard h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                      <span class="icon-circle me-2"><i class="fe fe-aperture"></i></span>
                      <h5 class="card-title mb-0">Referencias</h5>
                    </div>
                    <p class="text-muted small flex-grow-1">Casos y referencias por industria.</p>
                    <router-link class="btn btn-sm dashboard-btn mt-3 align-self-start" :to="{ name: 'referencias' }">Ver referencias</router-link>
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
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";

export default {
  name: "DashboardApp",
  components: { Sidebar, TopNav },
  computed: {
    usuario() {
      try { return JSON.parse(localStorage.getItem("usuario")) || null; } catch (e) { return null; }
    },
    nombreMostrar() { return this.usuario ? `${this.usuario.nombres} ${this.usuario.apellidos}` : ""; },
    rol() { return this.usuario ? this.usuario.rol : ""; },
    isAdmin() { return this.rol === "Administrador"; },
    isVendedor() { return this.rol === "Vendedor"; },
    isInventariado() { return this.rol === "Inventariado"; }
  }
};
</script>

<style scoped>
.dashboard-header {
  background: #ffffff;
  border-radius: 22px;
  padding: 20px 24px;
  border: 1px solid #e5e7f5;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.04);
}
.header-pretitle {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 4px;
}
.header-title { font-weight: 600; }
.card-dashboard { border-radius: 22px; border: none; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.04); transition: transform 0.15s ease, box-shadow 0.15s ease; }
.card-dashboard:hover { transform: translateY(-4px); box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08); }
.icon-circle { width: 36px; height: 36px; border-radius: 999px; background: #f3f4ff; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; color: #4f46e5; }
.dashboard-btn { border-radius: 999px; padding-inline: 18px; font-weight: 500; background-color: #2563eb; color: #ffffff !important; border: none; box-shadow: 0 8px 22px rgba(37, 99, 235, 0.35); }
.dashboard-btn:hover { background-color: #1d4ed8; box-shadow: 0 12px 30px rgba(37, 99, 235, 0.45); }
</style>
