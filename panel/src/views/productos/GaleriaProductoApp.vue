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
                    <h6 class="header-pretitle">Productos</h6>
                    <h1 class="header-title">Productos</h1>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col">
                    <ul class="nav nav-tabs nav-overflow header-tabs">
                      <li class="nav-item">
                        <router-link to="/producto" class="nav-link">Todos los productos</router-link>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link active">Galeria de producto</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <template v-if="load_data">
              <div class="row">
                <div class="col-12 text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div v-if="data" class="mb-7">
                <div class="row">
                  <div class="col-12">
                    <div class="form-group">
                      <label class="mb-1">Imagen</label>
                      <div class="input-group mb-3">
                        <input id="input_file" type="file" class="form-control" accept="image/webp" placeholder="Selecciona la imagen" @change="uploadImage($event)">
                        <button class="btn btn-primary" @click="subir_imagen">
                          <i class="fe fe-upload"></i>
                        </button>
                      </div>
                      <small class="form-text text-muted">Sube un maximo de 5 imagenes WebP para la galeria del producto.</small>
                    </div>
                  </div>
                </div>

                <div class="row listAlias" v-if="!load_galeria">
                  <div class="col-12 col-md-6 col-xl-4" v-for="item in galeria" :key="item._id">
                    <div class="card">
                      <img :src="$url + '/obtener_galeria_producto/' + item.imagen" alt="Imagen de galeria" class="card-img-top">
                      <div class="card-footer card-footer-boxed">
                        <div class="row">
                          <div class="col text-center">
                            <a class="text-danger" style="cursor:pointer" v-b-modal="'eliminar-image-' + item._id">Eliminar imagen</a>
                            <b-modal centered :id="'eliminar-image-' + item._id" hide-footer title-html="<h4 class='card-header-title text-danger'><b>Eliminar imagen?</b></h4>">
                              <div class="text-center my-4">
                                <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2.5"></b-icon>
                                <h5 class="mt-3">Seguro que quieres eliminar esta imagen de la galeria?</h5>
                                <div class="mt-4 d-flex justify-content-center gap-2">
                                  <b-button variant="primary" class="text-white" @click="$bvModal.hide('eliminar-image-' + item._id)">Cancelar</b-button>
                                  <b-button variant="danger" @click="eliminar(item._id); $bvModal.hide('eliminar-image-' + item._id)">Eliminar</b-button>
                                </div>
                              </div>
                            </b-modal>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mt-5" v-if="load_galeria">
                  <div class="col-12 text-center">
                    <img src="/assets/img/reloj.gif" alt="Cargando" style="width: 80px;">
                  </div>
                </div>
              </div>

              <template v-else>
                <ErrorNotFound />
              </template>
            </template>
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
import $ from 'jquery';
import axios from 'axios';

export default {
  name: 'GaleriaProductoApp',
  components: {
    Sidebar,
    TopNav,
    ErrorNotFound
  },
  data() {
    return {
      imagen: undefined,
      data: false,
      load_data: true,
      load_galeria: true,
      galeria: [],
    };
  },
  methods: {
    init_data() {
      this.load_data = true;
      axios.get(this.$url + '/obtener_producto_admin/' + this.$route.params.id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.token,
        }
      }).then((result) => {
        this.data = !!result.data;
        this.load_data = false;
      });
    },
    uploadImage($event) {
      let image;
      if ($event.target.files.length >= 1) {
        image = $event.target.files[0];
      }

      if (!image) return;

      if (image.size <= 500 * 1024) {
        if (image.type === 'image/webp') {
          this.imagen = image;
        } else {
          this.$notify({
            group: 'foo',
            title: 'ERROR',
            text: 'Solo se permite imagen WebP',
            type: 'error'
          });
          this.imagen = undefined;
          $('#input_file').val('');
        }
      } else {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: 'La imagen debe pesar 500KB o menos',
          type: 'error'
        });
        this.imagen = undefined;
        $('#input_file').val('');
      }
    },
    subir_imagen() {
      if (!this.imagen) {
        this.$notify({
          group: 'foo',
          title: 'ERROR',
          text: 'Selecciona una imagen para subir',
          type: 'error'
        });
        return;
      }

      const fm = new FormData();
      fm.append('producto', this.$route.params.id);
      fm.append('imagen', this.imagen);

      axios.post(this.$url + '/subir_imagen_producto_admin', fm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$store.state.token,
        },
      }).then((result) => {
        if (result.data.message) {
          this.$notify({
            group: 'foo',
            title: 'ERROR',
            text: result.data.message,
            type: 'error'
          });
        } else {
          this.$notify({
            group: 'foo',
            title: 'EXITO',
            text: 'Se subio correctamente la imagen',
            type: 'success'
          });
          this.imagen = undefined;
          $('#input_file').val('');
          this.init_galeria();
        }
      });
    },
    init_galeria() {
      this.load_galeria = true;
      axios.get(this.$url + '/obtener_galeria_producto_admin/' + this.$route.params.id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.token,
        }
      }).then((result) => {
        this.galeria = result.data;
        this.load_galeria = false;
      });
    },
    eliminar(id) {
      axios.delete(this.$url + '/eliminar_galeria_producto_admin/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.token,
        }
      }).then((result) => {
        if (result.data.message) {
          this.$notify({
            group: 'foo',
            title: 'ERROR',
            text: result.data.message,
            type: 'error'
          });
        } else {
          this.$notify({
            group: 'foo',
            title: 'EXITO',
            text: 'Se elimino la imagen correctamente',
            type: 'success'
          });
          this.init_galeria();
        }
      });
    }
  },
  beforeMount() {
    this.init_data();
    this.init_galeria();
  },
};
</script>
