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

            <div class="card">
              <div class="card-body">
                <div class="row g-4 align-items-start">
                  <div class="col-12 col-lg-4">
                    <label class="form-label">Nombre</label>
                    <input ref="nombre" class="form-control" v-model="form.nombre" placeholder="Ej: BOGE" />
                    <p v-if="errors.nombre" class="text-danger small">{{ errors.nombre }}</p>
                  </div>
                  <div class="col-12 col-lg-5">
                    <label class="form-label">Extracto</label>
                    <textarea ref="descripcion" class="form-control extracto-input" rows="1" v-model="form.descripcion" placeholder="Texto breve para la web"></textarea>
                    <p v-if="errors.descripcion" class="text-danger small mt-1">{{ errors.descripcion }}</p>
                  </div>
                  <div class="col-12 col-lg-3">
                    <label class="form-label">Logo (webp)</label>
                    <div>
                      <button type="button" class="btn btn-outline-primary w-100" @click="$refs.logoInput.click()">Seleccionar logo</button>
                      <small class="text-muted d-block mt-2 text-truncate">{{ logoName }}</small>
                      <p v-if="errors.logo" class="text-danger small mt-1">{{ errors.logo }}</p>
                      <input ref="logoInput" type="file" class="d-none" accept="image/webp" @change="onFile" />
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 border-top pt-3">
                  <div class="form-check form-switch m-0">
                    <input class="form-check-input" type="checkbox" v-model="form.estado" />
                    <label class="form-check-label">Visible</label>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <router-link to="/marcas" class="btn btn-danger cancel-button">Cancelar</router-link>
                    <button class="btn btn-primary px-4" @click="save">Crear</button>
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
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';

export default {
  name: 'CreateMarcaApp',
  components:{ Sidebar, TopNav },
  data(){
    return {
      form:{ nombre:'', descripcion:'', estado:true },
      logo:null,
      errors:{}
    }
  },
  methods:{
    validateWebp(file){
      if(!file) return false;
      if(file.type!=='image/webp'){ this.$notify({group:'foo',title:'ERROR',text:'Solo WebP',type:'error'}); return false; }
      if(file.size>500*1024){ this.$notify({group:'foo',title:'ERROR',text:'Max 500KB',type:'error'}); return false; }
      return true;
    },
    onFile(e){ const f=e.target.files[0]; if(!f) return; if(!this.validateWebp(f)) return; this.logo=f; this.errors.logo=''; },
    validate(){
      this.errors={};
      if(!this.form.nombre || !this.form.nombre.trim()) this.errors.nombre='Ingresa el nombre';
      if(!this.form.descripcion || !this.form.descripcion.trim()) this.errors.descripcion='Ingresa el extracto';
      if(!this.logo) this.errors.logo='Debes subir el logo WebP';
      return Object.keys(this.errors).length===0;
    },
    focusFirstError(){
      const order = ['nombre','descripcion'];
      const firstKey = order.find((key) => this.errors[key]);
      if (!firstKey) return;
      this.$nextTick(() => {
        const ref = this.$refs[firstKey];
        const target = Array.isArray(ref) ? ref[0] : ref;
        if (!target) return;
        const container = target.closest('.col-12, .col-lg-4, .col-lg-5, .col-lg-3') || target;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof target.focus === 'function') target.focus();
      });
    },
    save(){
      if(!this.validate()) {
        this.$notify({group:'foo',title:'ERROR',text:'Falta completar campos obligatorios',type:'error'});
        this.focusFirstError();
        return;
      }
      let data;
      const hasFile = !!this.logo;
      if(hasFile){
        data = new FormData();
        Object.entries(this.form).forEach(([k,v])=>data.append(k,v));
        data.append('logo', this.logo);
      } else {
        data = { ...this.form };
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
  },
  computed: {
    logoName() {
      return this.logo ? this.logo.name : 'Sin archivo seleccionado';
    }
  }
}
</script>

<style scoped>
.extracto-input {
  min-height: 50px;
  resize: vertical;
}

.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
