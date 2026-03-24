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
                    <h6 class="header-pretitle">Catalogo</h6>
                    <h1 class="header-title">Marcas de producto</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <router-link to="/marcas-producto" class="nav-link">Todas las marcas</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Nueva marca de producto</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <MarcaProductoForm
              :initial-value="form"
              submit-label="Crear"
              cancel-link="/marcas-producto"
              @submit="save"
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
import MarcaProductoForm from '@/components/marcas-producto/MarcaProductoForm.vue';
import axios from 'axios';

export default {
  name: 'CreateMarcaProductoApp',
  components: { Sidebar, TopNav, MarcaProductoForm },
  data() {
    return {
      form: { nombre: '', estado: true }
    };
  },
  methods: {
    save(form) {
      axios.post(this.$url + '/marca-producto', form, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Marca de producto guardada', type: 'success' });
        this.$router.push({ name: 'marcas-producto' });
      }).catch((error) => {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: error?.response?.data?.message || 'No se pudo guardar',
          type: 'error'
        });
      });
    }
  }
};
</script>
