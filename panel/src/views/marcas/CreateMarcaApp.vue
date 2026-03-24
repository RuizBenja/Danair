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
                    <h6 class="header-pretitle">Contenido web</h6>
                    <h1 class="header-title">Marcas representativas</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <router-link to="/marcas" class="nav-link">Todas las marcas</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Nueva marca representativa</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <MarcaForm
              :initial-value="form"
              submit-label="Crear"
              cancel-link="/marcas"
              :require-logo="true"
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
import MarcaForm from '@/components/marcas/MarcaForm.vue';
import axios from 'axios';

export default {
  name: 'CreateMarcaApp',
  components:{ Sidebar, TopNav, MarcaForm },
  data(){
    return {
      form:{ nombre:'', descripcion:'', estado:true }
    }
  },
  methods:{
    save(payload){
      let data;
      const hasFile = !!payload.logo;
      if(hasFile){
        data = new FormData();
        Object.entries(payload.form).forEach(([k,v])=>data.append(k,v));
        data.append('logo', payload.logo);
      } else {
        data = { ...payload.form };
      }
      const opts = { headers: hasFile ? { 'Content-Type':'multipart/form-data', Authorization:this.$store.state.token } : { Authorization:this.$store.state.token } };
      axios.post(this.$url + '/marca', data, opts)
        .then(()=>{
          this.$notify({group:'foo',title:'EXITO',text:'Marca guardada',type:'success'});
          this.$router.push({ name: 'marcas' });
        })
        .catch((error)=> {
          const message = error.response?.data?.message || 'No se pudo guardar';
          this.$notify({group:'foo',title:'ERROR',text:message,type:'error'});
        });
    }
  }
}
</script>
