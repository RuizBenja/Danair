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
                        <a class="nav-link active">Todas las marcas</a>
                      </li>
                      <li class="nav-item">
                        <router-link to="/marcas/create" class="nav-link">Nueva marca representativa</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <div class="input-group input-group-flush input-group-merge input-group-reverse">
                      <input class="form-control list-search" type="search" v-model="filtro" placeholder="Buscar marca representativa">
                      <span class="input-group-text"><i class="fe fe-search"></i></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr><th>Logo</th><th>Nombre</th><th>Extracto</th><th>Estado</th><th>Orden</th><th>Acciones</th></tr>
                  </thead>
                  <paginate :key="filterKey" tag="tbody" ref="marcasRepresentativas" name="marcasRepresentativas" :list="filteredMarcas" :per="perPage" class="list fs-base">
                    <tr v-for="m in paginated('marcasRepresentativas')" :key="m._id">
                      <td style="width:80px">
                        <template v-if="editingId === m._id">
                          <div class="d-flex flex-column gap-2">
                            <img v-if="editingPreview(m)" :src="editingPreview(m)" style="height:40px; object-fit:contain;">
                            <input type="file" class="form-control form-control-sm" accept="image/webp" @change="onInlineFile($event, m._id)">
                            <p v-if="inlineErrors.logo" class="text-danger small mt-1 mb-0">{{ inlineErrors.logo }}</p>
                          </div>
                        </template>
                        <img v-else-if="m.logo" :src="$url + '/marca/logo/' + m.logo" style="height:40px; object-fit:contain;">
                      </td>
                      <td>
                        <template v-if="editingId === m._id">
                          <input ref="inlineNombre" class="form-control form-control-sm" v-model="editForm.nombre" />
                          <p v-if="inlineErrors.nombre" class="text-danger small mt-1 mb-0">{{ inlineErrors.nombre }}</p>
                        </template>
                        <template v-else>
                          {{ m.nombre }}
                        </template>
                      </td>
                      <td style="min-width:320px;">
                        <template v-if="editingId === m._id">
                          <textarea ref="inlineDescripcion" class="form-control form-control-sm" rows="4" v-model="editForm.descripcion"></textarea>
                          <p v-if="inlineErrors.descripcion" class="text-danger small mt-1 mb-0">{{ inlineErrors.descripcion }}</p>
                        </template>
                        <template v-else>
                          <div class="extracto-clamp">{{ m.descripcion }}</div>
                        </template>
                      </td>
                      <td>
                        <template v-if="editingId === m._id">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" v-model="editForm.estado" />
                            <label class="form-check-label">{{ editForm.estado ? 'Activo' : 'Oculto' }}</label>
                          </div>
                        </template>
                        <template v-else>
                          <span :class="['badge', m.estado ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">{{ m.estado ? 'Activo' : 'Oculto' }}</span>
                        </template>
                      </td>
                      <td class="text-nowrap">
                        <div class="d-flex align-items-center gap-2 marcas-order-actions">
                          <button class="btn btn-sm btn-outline-secondary" @click="move(m, 'up')" title="Subir" aria-label="Subir">
                            <i class="fe fe-chevron-up"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" @click="move(m, 'down')" title="Bajar" aria-label="Bajar">
                            <i class="fe fe-chevron-down"></i>
                          </button>
                        </div>
                      </td>
                      <td class="text-end">
                        <template v-if="editingId === m._id">
                          <div class="d-flex align-items-center justify-content-end gap-2 marcas-row-actions">
                            <button class="btn btn-sm btn-primary" @click="saveInline">Guardar</button>
                            <button class="btn btn-sm btn-outline-secondary" @click="cancelInline">Cancelar</button>
                          </div>
                        </template>
                        <template v-else>
                          <div class="dropdown">
                            <a class="dropdown-ellipses dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="fe fe-more-vertical"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item" style="cursor:pointer" @click="edit(m)">Editar</a>
                              <a class="dropdown-item text-danger" style="cursor:pointer" v-b-modal="'delete-brand-' + m._id">Eliminar</a>
                            </div>
                          </div>

                          <b-modal centered :id="'delete-brand-' + m._id" hide-footer :title-html="`<h4 class='card-header-title text-danger'><b>Eliminar marca?</b></h4>`">
                            <div class="text-center my-4">
                              <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                              <h5 class="mt-3">
                                Seguro que quieres eliminar la marca
                                <strong class="text-danger">{{ m.nombre }}</strong>?
                              </h5>
                              <p class="text-muted mt-2">
                                Si lo haces, dejara de aparecer en la web y esta accion no se puede deshacer.
                              </p>
                              <div class="mt-4 d-flex justify-content-center gap-2">
                                <b-button variant="primary" class="text-white" @click="$bvModal.hide('delete-brand-' + m._id)">Cancelar</b-button>
                                <b-button variant="danger" @click="confirmRemove(m._id)">Eliminar</b-button>
                              </div>
                            </div>
                          </b-modal>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="!filteredMarcas.length"><td colspan="6" class="text-center text-muted py-3">Sin marcas</td></tr>
                  </paginate>
                </table>
              </div>

              <div class="card-footer" v-if="filteredMarcas.length">
                <div class="d-flex justify-content-between">
                  <ul class="list-pagination-prev pagination pagination-tabs card-pagination">
                    <li class="page-item">
                      <a class="page-link ps-0 pe-4 border-end" style="cursor:pointer" @click="goPrev()">
                        <i class="fe fe-arrow-left me-1"></i> Anterior
                      </a>
                    </li>
                  </ul>

                  <paginate-links @change="onPageChange" for="marcasRepresentativas" style="cursor:pointer"
                    :classes="{ 'ul': ['list-pagination', 'pagination', 'pagination-tabs', 'card-pagination'], 'a': ['page'] }"></paginate-links>

                  <ul class="list-pagination-next pagination pagination-tabs card-pagination">
                    <li class="page-item">
                      <a class="page-link ps-4 pe-0 border-start" style="cursor:pointer" @click="goNext()">
                        Siguiente <i class="fe fe-arrow-right ms-1"></i>
                      </a>
                    </li>
                  </ul>
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
  name: 'MarcasApp',
  components:{ Sidebar, TopNav },
  data(){
    return {
      marcas: [],
      filtro: '',
      paginate: ['marcasRepresentativas'],
      currentPage: 1,
      perPage: 2,
      filterKey: 0,
      editingId: null,
      editForm: { nombre:'', descripcion:'', estado:true },
      inlineLogo: null,
      inlinePreview: '',
      inlineErrors: {}
    }
  },
  methods:{
    fetch(){
      axios.get(this.$url + '/marca').then(r=>{
        this.marcas = r.data || [];
        this.currentPage = 1;
        if (this.$refs.marcasRepresentativas && this.$refs.marcasRepresentativas.goToPage) this.$refs.marcasRepresentativas.goToPage(1);
        this.filterKey += 1;
      });
    },
    onPageChange(toPage) { this.currentPage = toPage; },
    goPrev() { if (this.currentPage >= 2) this.$refs.marcasRepresentativas.goToPage(this.currentPage--); else this.$refs.marcasRepresentativas.goToPage(1); },
    goNext() { if (this.currentPage <= Math.ceil(this.filteredMarcas.length / this.perPage)) this.$refs.marcasRepresentativas.goToPage(this.currentPage++); else this.$refs.marcasRepresentativas.goToPage(Math.max(1, Math.ceil(this.filteredMarcas.length / this.perPage))); },
    validateWebp(file){
      if(!file) return false;
      if(file.type!=='image/webp'){ this.$notify({group:'foo',title:'ERROR',text:'Solo WebP',type:'error'}); return false; }
      if(file.size>500*1024){ this.$notify({group:'foo',title:'ERROR',text:'Max 500KB',type:'error'}); return false; }
      return true;
    },
    edit(m){
      this.editingId = m._id;
      this.editForm = { _id: m._id, nombre: m.nombre, descripcion: m.descripcion || '', estado: m.estado };
      this.inlineLogo = null;
      this.inlinePreview = '';
      this.inlineErrors = {};
      this.inlineErrors = {};
    },
    cancelInline(){
      this.editingId = null;
      this.editForm = { nombre:'', descripcion:'', estado:true };
      this.inlineLogo = null;
      this.inlinePreview = '';
      this.inlineErrors = {};
    },
    onInlineFile(e, id){
      const f = e.target.files[0];
      if(!f) return;
      if(!this.validateWebp(f)) return;
      this.editingId = id;
      this.inlineLogo = f;
      this.inlinePreview = URL.createObjectURL(f);
    },
    editingPreview(m){
      if(this.inlinePreview) return this.inlinePreview;
      return m.logo ? this.$url + '/marca/logo/' + m.logo : '';
    },
    saveInline(){
      this.inlineErrors = {};
      if(!this.editForm.nombre || !this.editForm.nombre.trim()) this.inlineErrors.nombre = 'Ingresa el nombre';
      if(!this.editForm.descripcion || !this.editForm.descripcion.trim()) this.inlineErrors.descripcion = 'Ingresa el extracto';
      if (Object.keys(this.inlineErrors).length) {
        this.$notify({group:'foo',title:'ERROR',text:'Falta completar campos obligatorios',type:'error'});
        this.$nextTick(() => {
          const firstKey = ['nombre','descripcion'].find((key) => this.inlineErrors[key]);
          const refName = firstKey === 'nombre' ? 'inlineNombre' : 'inlineDescripcion';
          const ref = this.$refs[refName];
          const target = Array.isArray(ref) ? ref[0] : ref;
          if (target && typeof target.focus === 'function') target.focus();
        });
        return;
      }
      let data;
      const hasFile = !!this.inlineLogo;
      if(hasFile){
        data = new FormData();
        Object.entries(this.editForm).forEach(([k,v])=>data.append(k,v));
        data.append('logo', this.inlineLogo);
      }else{
        data = { ...this.editForm };
      }
      const opts = { headers: hasFile ? { 'Content-Type':'multipart/form-data', Authorization:this.$store.state.token } : { Authorization:this.$store.state.token } };
      axios.put(this.$url + '/marca/' + this.editingId, data, opts)
        .then(()=>{
          this.$notify({group:'foo',title:'EXITO',text:'Marca actualizada',type:'success'});
          this.cancelInline();
          this.fetch();
        })
        .catch((error)=> {
          const message = error.response?.data?.message || 'No se pudo actualizar';
          this.$notify({group:'foo',title:'ERROR',text:message,type:'error'});
        });
    },
    move(item, direction) {
      axios.put(this.$url + '/marca/' + item._id + '/reorder', { direction }, {
        headers: { Authorization: this.$store.state.token }
      }).then(() => {
        this.fetch();
      }).catch(() => {
        this.$notify({ group:'foo', title:'ERROR', text:'No se pudo reordenar', type:'error' });
      });
    },
    remove(id){ axios.delete(this.$url + '/marca/' + id, { headers:{Authorization:this.$store.state.token}}).then(()=>{ this.fetch(); this.$notify({group:'foo',title:'EXITO',text:'Eliminado',type:'success'}); }).catch(()=>this.$notify({group:'foo',title:'ERROR',text:'No se pudo eliminar',type:'error'})); },
    confirmRemove(id){
      this.$bvModal.hide('delete-brand-' + id);
      this.remove(id);
    }
  },
  computed: {
    filteredMarcas() {
      const term = this.filtro.trim().toLowerCase();
      if (!term) return this.marcas;
      return this.marcas.filter((item) => {
        const nombre = (item.nombre || '').toLowerCase();
        const descripcion = (item.descripcion || '').toLowerCase();
        return nombre.includes(term) || descripcion.includes(term);
      });
    },
  },
  watch: {
    filtro() {
      this.currentPage = 1;
      if (this.$refs.marcasRepresentativas && this.$refs.marcasRepresentativas.goToPage) this.$refs.marcasRepresentativas.goToPage(1);
      this.filterKey += 1;
    }
  },
  mounted(){ this.fetch(); }
}
</script>

<style scoped>
.marcas-order-actions,
.marcas-row-actions {
  min-width: max-content;
}

.extracto-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.55;
}
</style>
