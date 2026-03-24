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

                    <ColaboradorForm
                      :initial-value="colaborador"
                      submit-label="Crear colaborador"
                      cancel-link="/colaborador"
                      @submit="crear_colaborador"
                    />

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
import ColaboradorForm from '@/components/colaboradores/ColaboradorForm.vue';
import axios from 'axios';

export default {
  name: 'CreateColaboradorApp',
  data(){
    return {
        colaborador : { rol: '' }
    }
  },
  methods:{
    notifyErr(text){ this.$notify({ group:'foo', title:'ERROR', text, type:'error' }); },
    crear_colaborador(payload){
        let fd = new FormData();
        fd.append('nombres', payload.form.nombres);
        fd.append('apellidos', payload.form.apellidos);
        fd.append('email', payload.form.email);
        fd.append('rol', payload.form.rol);
        if(payload.avatarFile){ fd.append('avatar', payload.avatarFile); }
        axios.post(this.$url+'/registro_usuario_admin',fd,{
            headers:{ 'Content-Type': 'multipart/form-data', 'Authorization': this.$store.state.token }
        }).then((result)=>{
            if(!result.data.data){ return this.notifyErr(result.data.message); }
            this.$notify({ group:'foo', title:'EXITO', text:'Se registro correctamente el nuevo colaborador', type:'success' });
            this.$router.push({name:'colaborador-index'});
        }).catch((error)=>{ console.log(error); this.notifyErr('No se pudo crear'); });
    }
 },
  components: { Sidebar, TopNav, ColaboradorForm }
}
</script>
