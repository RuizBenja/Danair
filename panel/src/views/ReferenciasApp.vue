<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-10">
            <div class="header mt-md-5 d-flex justify-content-between align-items-center">
              <div>
                <h6 class="header-pretitle">Referencias</h6>
                <h1 class="header-title">Listado</h1>
              </div>
              <button class="btn btn-primary" @click="resetForm">Nueva</button>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="row g-3 align-items-end">
                  <div class="col-md-4">
                    <label class="form-label">Título / Industria</label>
                    <input class="form-control" v-model="form.titulo" />
                    <p v-if="errors.titulo" class="text-danger small">{{ errors.titulo }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Industria (para filtro)</label>
                    <input class="form-control" v-model="form.industria" />
                    <p v-if="errors.industria" class="text-danger small">{{ errors.industria }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Familia (categoría)</label>
                    <input class="form-control" v-model="form.familia" />
                    <p v-if="errors.familia" class="text-danger small">{{ errors.familia }}</p>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Comuna</label>
                    <input class="form-control" v-model="form.comuna" />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Región</label>
                    <input class="form-control" v-model="form.region" />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label">Año</label>
                    <input class="form-control" type="number" v-model="form.anio" />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label">Marca</label>
                    <input class="form-control" v-model="form.marca" />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label">Modelo</label>
                    <input class="form-control" v-model="form.modelo" />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label">Potencia</label>
                    <input class="form-control" v-model="form.potencia" placeholder="Ej: 50 HP" />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label">Presión</label>
                    <input class="form-control" v-model="form.presion" placeholder="Ej: 12 bar" />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Imagen (webp)</label>
                    <input type="file" class="form-control" @change="onFile" />
                  </div>
                </div>
                <div class="form-check form-switch mt-3">
                  <input class="form-check-input" type="checkbox" v-model="form.estado" />
                  <label class="form-check-label">Visible</label>
                </div>
                <button class="btn btn-success mt-3" @click="save">{{ form._id ? 'Actualizar' : 'Crear' }}</button>
              </div>

              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead><tr><th>Img</th><th>Título</th><th>Industria</th><th>Familia</th><th></th></tr></thead>
                  <tbody>
                    <tr v-for="r in referencias" :key="r._id">
                      <td style="width:80px"><img v-if="r.imagen" :src="$url + '/referencia/imagen/' + r.imagen" style="height:40px;object-fit:cover"></td>
                      <td>{{ r.titulo }}</td>
                      <td>{{ r.industria }}</td>
                      <td>{{ r.familia }}</td>
                      <td class="text-end">
                        <button class="btn btn-sm btn-link" @click="edit(r)">Editar</button>
                        <button class="btn btn-sm btn-link text-danger" @click="remove(r._id)">Borrar</button>
                      </td>
                    </tr>
                    <tr v-if="!referencias.length"><td colspan="5" class="text-center text-muted py-3">Sin referencias</td></tr>
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
  name:'ReferenciasApp',
  components:{Sidebar,TopNav},
  data(){return{ referencias:[], form:{titulo:'', industria:'', familia:'', comuna:'', region:'', anio:'', marca:'', modelo:'', potencia:'', presion:'', estado:true}, imagen:null, errors:{} }} ,
  methods:{
    fetch(){ axios.get(this.$url + '/referencia').then(r=>{this.referencias=r.data||[]}); },
    onFile(e){ const f=e.target.files[0]; if(!f) return; if(f.type!=='image/webp'){ this.$notify({group:'foo',title:'ERROR',text:'Solo WebP',type:'error'}); return;} if(f.size>500*1024){ this.$notify({group:'foo',title:'ERROR',text:'Máx 500KB',type:'error'}); return;} this.imagen=f; },
    resetForm(){ this.form={titulo:'', industria:'', familia:'', comuna:'', region:'', anio:'', marca:'', modelo:'', potencia:'', presion:'', estado:true}; this.imagen=null; this.errors={}; },
    validate(){ this.errors={}; if(!this.form.titulo) this.errors.titulo='Obligatorio'; if(!this.form.industria) this.errors.industria='Obligatorio'; if(!this.form.familia) this.errors.familia='Obligatorio'; return Object.keys(this.errors).length===0; },
    save(){ if(!this.validate()) return; let data; const hasFile=!!this.imagen; if(hasFile){ data=new FormData(); Object.entries(this.form).forEach(([k,v])=>data.append(k,v)); data.append('imagen',this.imagen);} else { data={...this.form}; }
      const opts={ headers: hasFile? {'Content-Type':'multipart/form-data',Authorization:this.$store.state.token}:{Authorization:this.$store.state.token} };
      const url=this.form._id? this.$url + '/referencia/' + this.form._id : this.$url + '/referencia';
      const method=this.form._id? 'put':'post';
      axios[method](url,data,opts).then(()=>{ this.$notify({group:'foo',title:'OK',text:'Guardado',type:'success'}); this.resetForm(); this.fetch(); }).catch(()=> this.$notify({group:'foo',title:'ERROR',text:'No se pudo guardar',type:'error'}));
    },
    edit(r){ this.form={...r}; this.imagen=null; this.errors={}; },
    remove(id){ axios.delete(this.$url + '/referencia/' + id, { headers:{Authorization:this.$store.state.token}}).then(()=>{ this.fetch(); this.$notify({group:'foo',title:'OK',text:'Eliminado',type:'success'}); }).catch(()=>this.$notify({group:'foo',title:'ERROR',text:'No se pudo eliminar',type:'error'})); }
  },
  mounted(){ this.fetch(); }
}
</script>
