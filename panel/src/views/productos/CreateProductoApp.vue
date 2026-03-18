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
                        <a class="nav-link active">Nuevo producto</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <ProductoForm
              :initial-value="producto"
              cancel-link="/producto"
              :require-portada="true"
              submit-label="Crear producto"
              @submit="registro"
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
  name: "CreateProductoApp",
  components: { Sidebar, TopNav, ProductoForm },
  data() {
    return {
      producto: {
        titulo: "",
        categoria: "",
        subcategoria: "",
        marca: "",
        serie: "",
        modelo: "",
        extracto: "",
        descripcion: "",
        ficha_tecnica: "",
        ficha_pdf: "",
        tecnologia: "",
        potencia: "",
        presion: "",
        caudal: "",
        aplicacion: "",
        industria: "",
        orientacion: "",
        material: "",
        volumen: "",
        pureza: "",
        str_variedad: "",
        estado: true
      }
    };
  },
  methods: {
    registro(payload) {
      const fm = new FormData();
      Object.entries(payload.form).forEach(([key, value]) => {
        fm.append(key, value === null || value === undefined ? "" : value);
      });
      fm.append("portada", payload.portada);
      if (payload.fichaPdf) fm.append("ficha_pdf", payload.fichaPdf);

      axios.post(this.$url + "/registro_producto_admin", fm, {
        headers: { "Content-Type": "multipart/form-data", Authorization: this.$store.state.token }
      }).then((result) => {
        if (result.data.data) {
          this.$notify({ group: "foo", title: "EXITO", text: "Producto creado", type: "success" });
          this.$router.push({ name: "producto-index" });
        } else {
          this.$notify({ group: "foo", title: "ERROR", text: result.data.message, type: "error" });
        }
      }).catch(() => {
        this.$notify({ group: "foo", title: "ERROR", text: "No se pudo crear el producto", type: "error" });
      });
    }
  }
};
</script>
