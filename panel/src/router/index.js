import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index";
import LoginApp from "../views/auth/LoginApp.vue";
import CreateColaboradorApp from "../views/colaboradores/CreateColaboradorApp.vue";
import IndexColaboradorApp from "../views/colaboradores/IndexColaboradorApp.vue";
import IndexProveedorApp from "../views/proveedores/IndexProveedorApp.vue";
import CreateProveedorApp from "../views/proveedores/CreateProveedorApp.vue";
import jwt_decode from "jwt-decode";

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'login', component: LoginApp, meta: { requiresAuth: false, guest: true }},
  { path: '/colaborador', name: 'colaborador-index', component: IndexColaboradorApp, meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/colaborador/create', name: 'colaborador-create', component: CreateColaboradorApp, meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/colaborador/edit/:id', name: 'colaborador-edit', component: ()=> import('@/views/colaboradores/EditColaboradorApp.vue'),meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/dashboard', name: 'dashboard', component: ()=> import('@/views/dashboard/DashboardApp.vue'), meta: { requiresAuth: true, roles: ['Administrador','Vendedor','Inventariado'] }},
  { path: '/perfil', name: 'perfil', component: ()=> import('@/views/perfil/PerfilApp.vue'), meta: { requiresAuth: true, roles: ['Administrador','Vendedor','Inventariado'] }},
  { path: '/proveedor', name: 'proveedor-index', component: IndexProveedorApp, meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/proveedor/create', name: 'proveedor-create', component: CreateProveedorApp, meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/proveedor/edit/:id', name: 'proveedor-edit', component: ()=> import('@/views/proveedores/EditProveedorApp.vue'), meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},

  { path: '/producto', name: 'producto-index', component:()=>import ('@/views/productos/IndexProductoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/producto/create', name: 'producto-create', component:()=>import ('@/views/productos/CreateProductoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/producto/edit/:id', name: 'producto-edit', component: ()=> import('@/views/productos/EditProductoApp.vue'),meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/producto/galeria/:id', name: 'producto-galeria', component: ()=> import('@/views/productos/GaleriaProductoApp.vue'),meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},

  { path: '/categorias', name: 'categorias', component:()=>import ('@/views/categorias/IndexCategoriaApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/categorias/create', name: 'categorias-create', component:()=>import ('@/views/categorias/CreateCategoriaApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/marcas', name: 'marcas', component:()=>import ('@/views/marcas/MarcasApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/marcas/create', name: 'marcas-create', component:()=>import ('@/views/marcas/CreateMarcaApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/marcas-producto', name: 'marcas-producto', component:()=>import ('@/views/marcas-producto/MarcasProductoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/marcas-producto/create', name: 'marcas-producto-create', component:()=>import ('@/views/marcas-producto/CreateMarcaProductoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador','Inventariado'] }},
  { path: '/servicios', name: 'servicios', component:()=>import ('@/views/servicios/ServiciosApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/servicios/create', name: 'servicios-create', component:()=>import ('@/views/servicios/CreateServicioApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/servicios/edit/:id', name: 'servicios-edit', component:()=>import ('@/views/servicios/EditServicioApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/servicios-tecnicos', name: 'servicios-tecnicos', component:()=>import ('@/views/servicios-tecnicos/ServiciosTecnicosApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/servicios-tecnicos/create', name: 'servicios-tecnicos-create', component:()=>import ('@/views/servicios-tecnicos/CreateServicioTecnicoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/servicios-tecnicos/edit/:id', name: 'servicios-tecnicos-edit', component:()=>import ('@/views/servicios-tecnicos/EditServicioTecnicoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/proyectos', name: 'proyectos', component:()=>import ('@/views/proyectos/ProyectosApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/proyectos/create', name: 'proyectos-create', component:()=>import ('@/views/proyectos/CreateProyectoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/proyectos/edit/:id', name: 'proyectos-edit', component:()=>import ('@/views/proyectos/EditProyectoApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/referencias', name: 'referencias', component:()=>import ('@/views/referencias/ReferenciasApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/referencias/create', name: 'referencias-create', component:()=>import ('@/views/referencias/CreateReferenciaApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/referencias/edit/:id', name: 'referencias-edit', component:()=>import ('@/views/referencias/EditReferenciaApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
  { path: '/referencias/categorias', name: 'referencias-categorias', component:()=>import ('@/views/referencias/ReferenciasCategoriasApp.vue') , meta: { requiresAuth: true, roles: ['Administrador'] }},
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(item => item.meta.requiresAuth);
  const isGuestRoute = to.matched.some(item => item.meta.guest);

  const token = store.state.token;
  const usuarioRaw = localStorage.getItem('usuario');
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;

  if (requiresAuth) {
    if (!token || !usuario) return next({ name: 'login' });

    let decodedToken;
    try { decodedToken = jwt_decode(token); } catch (error) { return next({ name: 'login' }); }

    if (decodedToken.exp * 1000 <= new Date().getTime()) {
      store.dispatch('logout');
      return next({ name: 'login' });
    }

    const userRol = usuario.rol;
    const rolesPermitidos = to.meta.roles;
    if (rolesPermitidos && rolesPermitidos.length > 0 && !rolesPermitidos.includes(userRol)) {
      store.dispatch('logout');
      return next({ name: 'login' });
    }

    return next();
  }

  if (isGuestRoute && usuario) return next({ name: 'dashboard' });

  return next();
});

export default router;
