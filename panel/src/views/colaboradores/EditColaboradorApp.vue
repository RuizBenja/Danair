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
                        <router-link to="/colaborador/create" class="nav-link active">Nuevo colaborador</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <template v-if="data">
              <ColaboradorForm
                :initial-value="colaborador"
                :initial-avatar-url="avatarPreview"
                :initial-avatar-name="avatarName"
                submit-label="Guardar cambios"
                cancel-link="/colaborador"
                @submit="actualizar_colaborador"
              />
            </template>

            <template v-else>
              <ErrorNotFound />
            </template>

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
import ErrorNotFound from '@/components/ErrorNotFound.vue';
import ColaboradorForm from '@/components/colaboradores/ColaboradorForm.vue';
import axios from 'axios';

export default {
  name: 'EditColaboradorApp',
  data(){
    return {
        colaborador : { rol: '' },
        id: this.$route.params.id,
        data: false,
        avatarPreview: '/assets/media/usuario.png',
        avatarName: 'Sin archivo'
    }
  },
  methods:{
    init_data(){
      axios.get(this.$url+'/obtener_usuario_admin/'+this.id,{
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }).then((result)=>{
        if (!result.data) {
          this.data = false;
        }else{
          this.data = true;
          this.colaborador = result.data;
          const hasAvatar = result.data.avatar && result.data.avatar !== 'default.jpg';
          this.avatarPreview = hasAvatar ? this.$url + '/obtener_avatar_usuario/' + result.data.avatar : '/assets/media/usuario.png';
          this.avatarName = hasAvatar ? result.data.avatar : 'Sin archivo';
        }
      }).catch(()=>{ this.data=false; });
    },

    notifyErr(text){ this.$notify({ group:'foo', title:'ERROR', text, type:'error' }); },
    actualizar_colaborador(payload){
      let fd = new FormData();
      fd.append('nombres', payload.form.nombres);
      fd.append('apellidos', payload.form.apellidos);
      fd.append('email', payload.form.email);
      fd.append('rol', payload.form.rol);
      if(payload.avatarFile){ fd.append('avatar', payload.avatarFile); }
      if(payload.removeAvatar){ fd.append('avatar', ''); }
      axios.put(this.$url+'/actualizar_usuario_admin/'+this.id,fd,{
        headers:{ 'Content-Type': 'multipart/form-data', 'Authorization': this.$store.state.token }
      }).then((result)=>{
        try{
          let u = JSON.parse(localStorage.getItem('usuario')) || null;
          if(u && u._id === this.id){ localStorage.setItem('usuario', JSON.stringify(result.data)); }
        }catch(e){ console.log(e); }
        this.$notify({ group: 'foo', title: 'EXITO', text: 'Se actualizo correctamente el colaborador', type:'success' });
        this.$router.push({name:'colaborador-index'});
      }).catch(()=>{ this.notifyErr('No se pudo actualizar'); });
  }
  },
  beforeMount(){ this.init_data(); },
  components: { Sidebar, TopNav, ErrorNotFound, ColaboradorForm }
}
</script>
