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

            <CategoriaForm
              submit-label="Crear categoria"
              cancel-link="/categorias"
              @submit="crear_categoria"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import CategoriaForm from '@/components/categorias/CategoriaForm.vue';
import axios from 'axios';

export default {
  name: 'CreateCategoriaApp',
  components: { Sidebar, TopNav, CategoriaForm },
  methods: {
    crear_categoria(titulo) {
      axios.post(this.$url + '/crear_categoria_admin/', { titulo }, {
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
