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
                    <h6 class="header-pretitle">Categorias</h6>
                    <h1 class="header-title">Categorias</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <router-link to="/categorias" class="nav-link">Todas las categorias</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Nueva categoria</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Nombre de la categoria</label>
                  <input type="text" class="form-control" placeholder="Nueva categoria" v-model="nueva_categoria">
                </div>
                <hr class="my-4">
                <div class="d-flex align-items-center gap-3">
                  <button @click="crear_categoria()" class="btn btn-primary">Crear categoria</button>
                  <router-link to="/categorias" class="btn btn-danger cancel-button">Cancelar</router-link>
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

export default {
  name: 'CreateCategoriaApp',
  components: { Sidebar, TopNav },
  data() {
    return {
      nueva_categoria: ''
    };
  },
  methods: {
    crear_categoria() {
      if (!this.nueva_categoria) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Ingrese el titulo de la categoria', type: 'error' });
        return;
      }
      axios.post(this.$url + '/crear_categoria_admin/', { titulo: this.nueva_categoria }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.token,
        },
      }).then((result) => {
        if (result.data.message) {
          this.$notify({ group: 'foo', title: 'ERROR', text: result.data.message, type: 'error' });
        } else {
          this.$notify({ group: 'foo', title: 'EXITO', text: 'Categoria creada correctamente', type: 'success' });
          this.$router.push({ name: 'categorias' });
        }
      });
    }
  }
};
</script>

<style scoped>
.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
