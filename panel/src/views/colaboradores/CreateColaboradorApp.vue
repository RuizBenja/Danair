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
                            <h6 class="header-pretitle">Colaboradores</h6>
                            <h1 class="header-title">Colaboradores</h1>
                        </div>
                        </div>
                        <div class="row align-items-center">
                        <div class="col">
                            <ul class="nav nav-tabs nav-overflow header-tabs">
                            <li class="nav-item">
                                <router-link to="/colaborador" class="nav-link ">Todos los colaboradores</router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active">Nuevo colaborador</a>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label class="form-label">Nombres</label>
                            <input ref="nombres" type="text" class="form-control" v-model="colaborador.nombres" placeholder="Nombres completos">
                            <p v-if="errors.nombres" class="text-danger small mt-1">{{ errors.nombres }}</p>
                        </div>
                        </div>
                        <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label class="form-label">Apellidos</label>
                            <input ref="apellidos" type="text" class="form-control" v-model="colaborador.apellidos" placeholder="Apellidos completos">
                            <p v-if="errors.apellidos" class="text-danger small mt-1">{{ errors.apellidos }}</p>
                        </div>
                        </div>
                        <div class="col-12">
                        <div class="form-group">
                            <label class="mb-1">Correo electronico</label>
                            <small class="form-text text-muted">Se usa para iniciar sesion.</small>
                            <input ref="email" type="email" class="form-control"  v-model="colaborador.email" placeholder="Correo electronico">
                            <p v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</p>
                        </div>
                        </div>                      
                        <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label class="form-label">Cargo</label>
                            <select ref="rol" class="form-select" v-model="colaborador.rol">
                                <option value="" disabled selected>Seleccionar</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Inventariado">Inventariado</option>
                            </select>
                            <p v-if="errors.rol" class="text-danger small mt-1">{{ errors.rol }}</p>
                        </div>
                        </div>

                        <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label class="form-label">Foto de perfil (opcional)</label>
                            <div class="d-flex align-items-start flex-wrap gap-3 mb-2">
                              <div class="avatar avatar-md flex-shrink-0">
                                <img class="avatar-img rounded-circle" :src="avatarPreview" alt="avatar">
                              </div>
                              <div class="d-flex flex-column gap-2">
                                <div class="d-flex align-items-center gap-2 flex-wrap">
                                  <button class="btn btn-sm btn-outline-primary" type="button" @click="$refs.avatar.click()">Subir WebP</button>
                                  <button v-if="avatarFile" class="btn btn-sm btn-outline-danger" type="button" @click="resetAvatar">Quitar</button>
                                </div>
                                <span class="text-muted small">{{ avatarName }}</span>
                              </div>
                            </div>
                            <small class="form-text text-muted d-block">Solo WebP, maximo 500KB.</small>
                            <input ref="avatar" type="file" class="d-none" @change="onAvatarChange" accept="image/webp">
                        </div>
                        </div>

                    </div> 

                    <hr class="my-5">

                    <div class="d-flex align-items-center gap-3">
                      <button type="button" class="btn btn-primary" @click="validar">Crear colaborador</button>
                      <router-link to="/colaborador" class="btn btn-danger cancel-button">Cancelar</router-link>
                    </div>

                    <br><br>

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

const MAX_WEBP = 500 * 1024;

export default {
  name: 'CreateColaboradorApp',
  data(){
    return {
        colaborador : { rol: '' },
        avatarFile: null,
        avatarPreview: '/assets/media/usuario.png',
        avatarName: 'Sin archivo',
        errors: {}
    }
  },
  methods:{
    onAvatarChange(e){
        const file = e.target.files[0];
        if(!file) { this.resetAvatar(); return; }
        if(file.type !== 'image/webp'){ this.notifyErr('Solo se permite imagen WebP'); this.resetAvatar(); return; }
        if(file.size > MAX_WEBP){ this.notifyErr('La imagen debe pesar 500KB o menos'); this.resetAvatar(); return; }
        this.avatarFile = file;
        this.avatarPreview = URL.createObjectURL(file);
        this.avatarName = file.name;
    },
    resetAvatar(){ this.avatarFile=null; this.avatarPreview='/assets/media/usuario.png'; this.avatarName='Sin archivo'; this.$refs.avatar.value=null; },
    notifyErr(text){ this.$notify({ group:'foo', title:'ERROR', text, type:'error' }); },
    validateForm(){
        this.errors = {};
        if (!this.colaborador.nombres || !this.colaborador.nombres.trim()) this.errors.nombres = 'Ingresa los nombres';
        if (!this.colaborador.apellidos || !this.colaborador.apellidos.trim()) this.errors.apellidos = 'Ingresa los apellidos';
        if (!this.colaborador.email || !this.colaborador.email.trim()) this.errors.email = 'Ingresa el email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.colaborador.email.trim())) this.errors.email = 'Ingresa un email valido';
        if (!this.colaborador.rol) this.errors.rol = 'Selecciona un cargo';
        return !Object.keys(this.errors).length;
    },
    focusFirstError(){
        const order = ['nombres','apellidos','email','rol'];
        const firstKey = order.find((key) => this.errors[key]);
        if (!firstKey) return;
        this.$nextTick(() => {
          const ref = this.$refs[firstKey];
          const target = Array.isArray(ref) ? ref[0] : ref;
          if (!target) return;
          const container = target.closest('.col-12, .col-md-6') || target;
          container.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (typeof target.focus === 'function') target.focus();
        });
    },
    validar(){
        if (!this.validateForm()) {
          this.notifyErr('Falta completar campos obligatorios');
          this.focusFirstError();
          return;
        }
        this.crear_colaborador();
    },
    crear_colaborador(){
        let fd = new FormData();
        fd.append('nombres', this.colaborador.nombres);
        fd.append('apellidos', this.colaborador.apellidos);
        fd.append('email', this.colaborador.email);
        fd.append('rol', this.colaborador.rol);
        if(this.avatarFile){ fd.append('avatar', this.avatarFile); }
        axios.post(this.$url+'/registro_usuario_admin',fd,{
            headers:{ 'Content-Type': 'multipart/form-data', 'Authorization': this.$store.state.token }
        }).then((result)=>{
            if(!result.data.data){ return this.notifyErr(result.data.message); }
            this.$notify({ group:'foo', title:'EXITO', text:'Se registro correctamente el nuevo colaborador', type:'success' });
            this.$router.push({name:'colaborador-index'});
        }).catch((error)=>{ console.log(error); this.notifyErr('No se pudo crear'); });
    }
 },
  components: { Sidebar, TopNav }
}
</script>

<style scoped>
.cancel-button,
.cancel-button:hover,
.cancel-button:focus,
.cancel-button:active {
  color: #fff !important;
}
</style>
