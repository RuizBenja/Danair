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
                    <h6 class="header-pretitle">Productos</h6>
                    <h1 class="header-title">Productos</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <router-link to="/producto" class="nav-link">Todos los productos</router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/producto/create" class="nav-link">Nuevo producto</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Editar producto</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <ProductoForm
              v-if="producto"
              :initial-value="producto"
              :portada-url="portadaUrl"
              :ficha-pdf-url="fichaPdfUrl"
              cancel-link="/producto"
              submit-label="Guardar cambios"
              @submit="actualizar"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";
import ProductoForm from "@/components/productos/ProductoForm.vue";
import axios from "axios";

export default {
  name: "EditProductoApp",
  components: { Sidebar, TopNav, ProductoForm },
  data() {
    return {
      producto: null,
      portadaUrl: "/assets/img/productosubido.png",
      fichaPdfUrl: ""
    };
  },
  methods: {
    initProducto() {
      axios.get(this.$url + "/obtener_producto_admin/" + this.$route.params.id, {
        headers: { "Content-Type": "application/json", Authorization: this.$store.state.token }
      }).then((res) => {
        this.producto = res.data;
        if (res.data && res.data.portada) {
          this.portadaUrl = this.$url + "/obtener_portada_producto/" + res.data.portada;
        }
        if (res.data && res.data.ficha_pdf) {
          this.fichaPdfUrl = this.$url + "/obtener_ficha_pdf_producto/" + res.data.ficha_pdf + "?t=" + Date.now();
        }
      });
    },
    actualizar(payload) {
      const data = new FormData();
      Object.entries(payload.form).forEach(([key, value]) => {
        data.append(key, value === null || value === undefined ? "" : value);
      });
      if (payload.portada) data.append("portada", payload.portada);
      if (payload.fichaPdf) data.append("ficha_pdf", payload.fichaPdf);

      axios.put(this.$url + "/actualizar_producto_admin/" + this.$route.params.id, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: this.$store.state.token }
      }).then((result) => {
        if (result.data.data) {
          this.$notify({ group: "foo", title: "EXITO", text: "Producto actualizado", type: "success" });
          this.$router.push({ name: "producto-index" });
        } else {
          this.$notify({ group: "foo", title: "ERROR", text: result.data.message, type: "error" });
        }
      }).catch(() => {
        this.$notify({ group: "foo", title: "ERROR", text: "No se pudo actualizar el producto", type: "error" });
      });
    }
  },
  beforeMount() {
    this.initProducto();
  }
};
</script>
