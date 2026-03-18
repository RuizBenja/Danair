<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">

            <!-- Header -->
            <div class="header mt-md-5">
                            <div class="header-body">
                                <div class="row align-items-center">
                                    <div class="col">

                                        <h6 class="header-pretitle">
                                            Ingreso
                                        </h6>

                                        <h1 class="header-title">Nuevo Ingreso</h1>



                                    </div>
                                </div>
                                <div class="row align-items-center">
                                    <div class="col">
                                        <ul class="nav nav-tabs nav-overflow header-tabs">
                                            <li class="nav-item">
                                                <router-link class="nav-link" to="/ingreso">
                                                    Ingresos
                                                </router-link>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link active">Nuevo Ingreso</a>
                                            </li>

                                        </ul>

                                    </div>

                                </div>

                            </div>    
                        </div>

            <!-- Formulario Ingreso -->
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">Proveedor</label>
                  <small class="form-text text-muted">
                    Proveedor encargado del ingreso.
                  </small>
                  <select class="form-select mb-3" v-model="ingreso.proveedor">
                    <option value="" disabled>Seleccionar</option>
                    <option v-for="prov in proveedores" :key="prov._id" :value="prov._id">
                      {{ prov.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">NÂ° Factura</label>
                  <small class="form-text text-muted">
                    NÃºmero de la factura.
                  </small>
                  <input type="text" class="form-control" placeholder="Ingrese nÃºmero factura" v-model="ingreso.ncomprobante">
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">Monto total</label>
                  <small class="form-text text-muted">
                    Monto total pagado al proveedor.
                  </small>
                  <input type="text" class="form-control" placeholder="Ingrese monto total" v-model="ingreso.monto_total">
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">Comprobante</label>
                  <small class="form-text text-muted">
                    Subir comprobante: JPEG,PNG,WEBP,JPG,PDF.
                  </small>
                  <input type="file" class="form-control" @change="uploadComprobante($event)">
                </div>
              </div>
            </div>

            <hr class="my-5">

            <!-- Detalles -->
            <div class="row">
              <div class="col-md-12 mb-4">
                <h3><b>Productos del ingreso</b></h3>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">Producto</label>
                  <small class="form-text text-muted">
                    SelecciÃ³n del producto.
                  </small>
                  
                  <basic-select :options="productos" v-model="producto" :selected-option="producto"
                    placeholder="Selecciona un producto" @select="producto_selected">
                  </basic-select>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">Variedad</label>
                  <small class="form-text text-muted">
                    SelecciÃ³n de variedad.
                  </small>
                  <select class="form-select mb-3" v-model="detalle.variedad">
                    <option value="" disabled>Seleccionar</option>
                    <option :value="item._id" v-for="item in variedades" :key="item._id">
                      {{ item.variedad.toUpperCase() }} - {{ item.sku }} - {{ item.stock }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">Precio unidad</label>
                  <small class="form-text text-muted">
                    Precio por unidad pagado.
                  </small>
                  <input type="text" class="form-control mb-3" placeholder="Ingrese precio por unidad pagado" v-model="detalle.precio_unidad">
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="form-label">Cantidad total</label>
                  <small class="form-text text-muted">
                    Cantidad total comprada.
                  </small>
                  <input type="number" class="form-control mb-3" placeholder="Ingrese cantidad total" v-model="detalle.cantidad">
                </div>
              </div>

              <div class="col-md-12">
                <button class="btn btn-primary mb-3" @click="agregar_detalle()">Agregar</button>
              </div>
            </div>

            <!-- Tabla detalles -->
            <div class="card">
              <div class="table-responsive mb-0">
                <table class="table table-sm table-nowrap card-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio unidad</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody v-if="detalles.length >= 1">
                    <tr v-for="(item, index) in detalles" :key="index">
                      <td>{{ item.titulo_producto }}</td>
                      <td>{{ convertCurrency(item.precio_unidad) }}</td>
                      <td>{{ item.cantidad }}</td>
                      <td>{{ convertCurrency(item.precio_unidad * item.cantidad) }}</td>
                      <td>
                        <button class="btn btn-danger btn-sm"
                          @click="quitarDetalle(index, item.precio_unidad * item.cantidad)">Quitar</button>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="5" class="text-center text-muted">No hay detalles ingresados</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">Total:</td>
                      <td>{{ convertCurrency(total) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <button class="btn btn-primary mb-7" @click="registro_ingreso()">Ingresar datos</button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
/* Oculta el icono interno del BasicSelect porque no me cargaba ajaajaj */
.ui.selection.dropdown > i.icon,
.vue-search-select .dropdown.icon {
  display: none !important;
}
</style>

<script>
import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import { BasicSelect } from 'vue-search-select';
import axios from 'axios';
import currency_formatter from 'currency-formatter';

export default {
  name: 'CreateIngresoApp',
  data() {
    return {
      ingreso: { proveedor: '', ncomprobante: '', monto_total: '', documento: null },
      detalle: { variedad: '' },
      detalles: [],
      comprobante: null,
      producto: {},
      productos: [],
      variedades: [],
      total: 0,
      proveedores: []
    }
  },
  methods: {
    init_proveedores() {
      axios.get(this.$url + '/listar_activos_proveedores_admin', {
        headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
      }).then(res => {
        this.proveedores = res.data;
      });
    },
    init_productos() {
      axios.get(this.$url + '/listar_activos_productos_admin', {
        headers: { 'Content-Type': 'application/json', Authorization: this.$store.state.token }
      })
        .then(res => {
          this.productos = res.data.map(item => ({ value: item._id, text: item.titulo }));
        })
        .catch(err => console.error('Error cargando productos:', err));
    },

    uploadComprobante(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1000000 || !['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'].includes(file.type)) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Archivo invÃ¡lido o demasiado grande', type: 'error' });
        this.comprobante = null;
        this.ingreso.documento = null;
        return;
      }
      this.comprobante = file;
      this.ingreso.documento = file;
      console.log('Archivo seleccionado:', file);
    },

    producto_selected(item) {
      this.producto = item;
      this.detalle.producto = item.value;
      this.detalle.titulo_producto = item.text;
      this.init_variedades(item.value);
    },

    init_variedades(id) {
      axios.get(this.$url + '/obtener_variedades_producto/' + id, { headers: { Authorization: this.$store.state.token } })
        .then(res => this.variedades = res.data.variedades)
        .catch(err => console.error('Error cargando variedades:', err));
    },

    agregar_detalle() {
      if (!this.detalle.producto || !this.detalle.variedad || !this.detalle.precio_unidad || !this.detalle.cantidad) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Complete todos los campos del detalle', type: 'error' });
        return;
      }
      this.detalles.push({
        ...this.detalle,
        precio_unidad: Number(this.detalle.precio_unidad),
        cantidad: Number(this.detalle.cantidad)
      });
      this.total += Number(this.detalle.precio_unidad) * Number(this.detalle.cantidad);
      this.detalle = { variedad: '' };
      this.producto = {};
    },

    quitarDetalle(idx, subtotal) {
      this.detalles.splice(idx, 1);
      this.total -= subtotal;
    },

    convertCurrency(num) { return currency_formatter.format(num, { code: 'CLP' }); },

    registro_ingreso() {
      if (!this.ingreso.proveedor || !this.ingreso.ncomprobante || !this.ingreso.monto_total || !this.ingreso.documento) {
        this.$notify({ group: 'foo', title: 'ERROR', text: 'Complete todos los campos', type: 'error' });
        return;
      }

      const fm = new FormData();
      fm.append('proveedor', this.ingreso.proveedor);
      fm.append('ganancia', this.$ganancia);
      fm.append('ncomprobante', this.ingreso.ncomprobante);
      fm.append('monto_total', this.ingreso.monto_total);
      fm.append('monto_resultante', this.total);
      fm.append('documento', this.ingreso.documento);

      const detallesParaEnviar = this.detalles.map(item => ({
        producto: item.producto,
        variedad: item.variedad,
        titulo_producto: item.titulo_producto,
        precio_unidad: item.precio_unidad,
        cantidad: item.cantidad
      }));
      fm.append('detalles', JSON.stringify(detallesParaEnviar));
      console.log('Detalles a enviar:', detallesParaEnviar);

      axios.post(this.$url + '/registro_ingreso_admin', fm, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: this.$store.state.token }
      })
        .then(res => {
          console.log('Ingreso registrado:', res.data);

          // NotificaciÃ³n de Ã©xito
          this.$notify({
            group: 'foo',
            title: 'Ã‰XITO',
            text: 'Ingreso registrado correctamente',
            type: 'success'
          });

          // Limpiar formulario
          this.ingreso = { proveedor: '', ncomprobante: '', monto_total: '', documento: null };
          this.detalles = [];
          this.total = 0;
          this.producto = {};
          this.detalle = { variedad: '' };
          this.comprobante = null;
        })
        .catch(err => {
          console.error('Error en registro ingreso:', err);
          this.$notify({ group: 'foo', title: 'ERROR', text: 'No se pudo registrar el ingreso', type: 'error' });
        });
    }
  },
  beforeMount() {
    this.init_productos();
    this.init_proveedores();
  },
  components: {
    Sidebar, TopNav, BasicSelect
  }
}
</script>
