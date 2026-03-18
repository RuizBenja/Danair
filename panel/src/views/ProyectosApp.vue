<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <div class="header mt-md-5 d-flex justify-content-between align-items-center">
              <div>
                <h6 class="header-pretitle">Proyectos destacados</h6>
                <h1 class="header-title">Listado</h1>
              </div>
              <button class="btn btn-primary" @click="resetForm">Nuevo</button>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="row g-3 align-items-end">
                  <div class="col-md-6">
                    <label class="form-label">Título</label>
                    <input class="form-control" v-model="form.titulo" />
                    <p v-if="errors.titulo" class="text-danger small">{{ errors.titulo }}</p>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Imagen (webp)</label>
                    <input type="file" class="form-control" @change="onFile" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Extracto</label>
                    <input class="form-control" v-model="form.extracto" />
                    <p v-if="errors.extracto" class="text-danger small">{{ errors.extracto }}</p>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" rows="3" v-model="form.descripcion"></textarea>
                  </div>
                </div>
                <div class="form-check form-switch mt-3">
                  <input class="form-check-input" type="checkbox" v-model="form.estado" />
                  <label class="form-check-label">Visible</label>
                </div>
                <div class="form-check form-switch mt-1">
                  <input class="form-check-input" type="checkbox" v-model="form.destacado" />
                  <label class="form-check-label">Destacado</label>
                </div>
                <button class="btn btn-success mt-3" @click="save">{{ form._id ? 'Actualizar' : 'Crear' }}</button>
              </div>

              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead><tr><th>Img</th><th>Título</th><th>Estado</th><th></th></tr></thead>
                  <tbody>
                    <tr v-for="p in proyectos" :key="p._id">
                      <td style="width:80px"><img v-if="p.imagen" :src="$url + '/proyecto/imagen/' + p.imagen" style="height:40px;object-fit:cover"></td>
                      <td>{{ p.titulo }}</td>
                      <td><span :class="['badge', p.estado ? 'bg-success-soft':'bg-secondary']">{{ p.estado ? 'Activo':'Oculto' }}</span></td>
                      <td class="text-end">
                        <button class="btn btn-sm btn-link" @click="edit(p)">Editar</button>
                        <button class="btn btn-sm btn-link text-danger" @click="remove(p._id)">Borrar</button>
                      </td>
                    </tr>
                    <tr v-if="!proyectos.length"><td colspan="4" class="text-center text-muted py-3">Sin proyectos</td></tr>
                  </tbody>
                </table>
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
  name:'ProyectosApp',
  components:{Sidebar,TopNav},
  data(){return{ proyectos:[], form:{titulo:'', extracto:'', descripcion:'', estado:true, destacado:true}, imagen:null, errors:{} }} ,
  methods:{
    fetch(){ axios.get(this.$url + '/proyecto').then(r=>{this.proyectos=r.data||[]}); },
    onFile(e){ const f=e.target.files[0]; if(!f) return; if(f.type!=='image/webp'){ this.$notify({group:'foo',title:'ERROR',text:'Solo WebP',type:'error'}); return;} if(f.size>500*1024){ this.$notify({group:'foo',title:'ERROR',text:'Máx 500KB',type:'error'}); return;} this.imagen=f; },
    resetForm(){ this.form={titulo:'', extracto:'', descripcion:'', estado:true, destacado:true}; this.imagen=null; this.errors={}; },
    validate(){ this.errors={}; if(!this.form.titulo) this.errors.titulo='Obligatorio'; if(!this.form.extracto) this.errors.extracto='Obligatorio'; return Object.keys(this.errors).length===0; },
    save(){ if(!this.validate()) return; let data; const hasFile=!!this.imagen; if(hasFile){ data=new FormData(); Object.entries(this.form).forEach(([k,v])=>data.append(k,v)); data.append('imagen',this.imagen);} else { data={...this.form}; }
      const opts={ headers: hasFile? {'Content-Type':'multipart/form-data',Authorization:this.$store.state.token}:{Authorization:this.$store.state.token} };
      const url=this.form._id? this.$url + '/proyecto/' + this.form._id : this.$url + '/proyecto';
      const method=this.form._id? 'put':'post';
      axios[method](url,data,opts).then(()=>{ this.$notify({group:'foo',title:'OK',text:'Guardado',type:'success'}); this.resetForm(); this.fetch(); }).catch(()=> this.$notify({group:'foo',title:'ERROR',text:'No se pudo guardar',type:'error'}));
    },
    edit(p){ this.form={...p}; this.imagen=null; this.errors={}; },
    remove(id){ axios.delete(this.$url + '/proyecto/' + id, { headers:{Authorization:this.$store.state.token}}).then(()=>{ this.fetch(); this.$notify({group:'foo',title:'OK',text:'Eliminado',type:'success'}); }).catch(()=>this.$notify({group:'foo',title:'ERROR',text:'No se pudo eliminar',type:'error'})); }
  },
  mounted(){ this.fetch(); }
}
</script>
