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

                                        <!-- Pretitle -->
                                        <h6 class="header-pretitle">
                                            Ventas
                                        </h6>

                                        <!-- Title -->
                                        <h1 class="header-title">
                                            Detalle de venta
                                        </h1>

                                    </div>
                                </div> <!-- / .row -->
                                <div class="row align-items-center">
                                    <div class="col">

                                        <!-- Nav -->
                                        <ul class="nav nav-tabs nav-overflow header-tabs">
                                            <li class="nav-item">
                                                <router-link to="/ventas" class="nav-link active">
                                                    Ventas
                                                </router-link>
                                            </li>

                                        </ul>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- CARD: DIRECCIÃ“N DE ENVÃO -->
                        <!-- CARD: DIRECCIÃ“N DE ENVÃO -->
                        <div class="row mb-4" v-if="venta.direccion">
                            <div class="col-12">
                                <div class="card" id="print-direccion-envio">
                                    <div class="card-header d-flex justify-content-between align-items-center header-envio">
                                        <h4 class="card-header-title mb-0">
                                            <b>DirecciÃ³n de envÃ­o</b>
                                        </h4>

                                        <!-- BotÃ³n imprimir -->
                                        <button type="button" class="btn btn-sm btn-outline-secondary"
                                            @click="printDireccionEnvio">
                                            <i class="fe fe-printer"></i> <!-- o el icono que uses -->
                                        </button>
                                    </div>

                                    <div class="card-body">
                                        <div class="row">
                                            <!-- Columna izquierda -->
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <h5 class="mb-1">Nombre</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.direccion.nombres }} {{ venta.direccion.apellidos }}
                                                    </small>
                                                </div>

                                                <div class="mb-3">
                                                    <h5 class="mb-1">RUT</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.direccion.rut }}
                                                    </small>
                                                </div>

                                                <div class="mb-3">
                                                    <h5 class="mb-1">Celular</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.direccion.celular }}
                                                    </small>
                                                </div>

                                                <div class="mb-0">
                                                    <h5 class="mb-1">CÃ³digo postal</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.direccion.codigopostal }}
                                                    </small>
                                                </div>
                                            </div>

                                            <!-- Columna derecha -->
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <h5 class="mb-1">RegiÃ³n</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.direccion.region }}
                                                    </small>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <h5 class="mb-1">Ciudad</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.direccion.ciudad }}
                                                    </small>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <h5 class="mb-1">DirecciÃ³n</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.direccion.direccion }}
                                                    </small>
                                                </div>
                                                
                                                <div class="mb-4">
                                                    <h5 class="mb-1">Correo electrÃ³nico</h5>
                                                    <small class="text-muted d-block">
                                                        {{ venta.cliente.email }}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!-- TUS DOS CARDS ORIGINALES (RESTABLECIDAS) -->
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="list-group list-group-flush my-n3">
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">
                                                        <h5 class="mb-0">Serie</h5>
                                                    </div>
                                                    <div class="col-auto">
                                                        <time class="small text-muted" v-if="venta.serie">
                                                            {{ venta.serie.toString().padStart(6, '000000') }}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">
                                                        <h5 class="mb-0">TransacciÃ³n</h5>
                                                    </div>
                                                    <div class="col-auto">
                                                        <time class="small text-muted">
                                                            {{ venta.transaccion }}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">
                                                        <h5 class="mb-0">Cliente</h5>
                                                    </div>
                                                    <div class="col-auto">
                                                        <small class="text-muted" v-if="venta.cliente">
                                                            {{ venta.cliente.nombres }}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> <!-- /list-group -->
                                    </div> <!-- /card-body -->
                                </div>
                            </div>

                            <div class="col-12 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="list-group list-group-flush my-n3">
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">
                                                        <h5 class="mb-0">Subtotal</h5>
                                                    </div>
                                                    <div class="col-auto">
                                                        <time class="small text-muted">
                                                            {{ convertCurrency(venta.total) }}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">
                                                        <h5 class="mb-0">EnvÃ­o</h5>
                                                    </div>
                                                    <div class="col-auto">
                                                        <time class="small text-muted">
                                                            {{ convertCurrency(venta.envio) }}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">
                                                        <h5 class="mb-0">Fecha</h5>
                                                    </div>
                                                    <div class="col-auto">
                                                        <span class="small">
                                                            {{ convertDate(venta.createdAt) }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> <!-- /list-group -->
                                    </div> <!-- /card-body -->
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">

                                <!-- Title -->
                                <h4 class="card-header-title mb-0">
                                    <b>Productos</b>
                                </h4>

                            </div>
                            <div class="table-responsive">
                                <table class="table table-sm table-nowrap card-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio Unidad</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody class="fs-base">
                                        <tr v-for="item in detalles">
                                            <td class="products-product">
                                                <div class="d-flex align-items-center">

                                                    <!-- Image -->
                                                    <div class="avatar">
                                                        <img class="avatar-img rounded me-3"
                                                            :src="$url + '/obtener_portada_producto/' + item.producto.portada"
                                                            alt="...">
                                                    </div>

                                                    <div class="ms-3">

                                                        <!-- Heading -->
                                                        <h4 class="fw-normal mb-1">{{ item.producto.titulo.substr(0, 30)
                                                            }}
                                                        </h4>

                                                        <!-- Text -->
                                                        <small class="text-muted">{{ item.variedad.variedad }}</small>

                                                    </div>

                                                </div>
                                            </td>
                                            <td>
                                                {{ convertCurrency(item.precio_unidad) }}
                                            </td>
                                            <td>
                                                {{ item.cantidad }}
                                            </td>
                                            <td>
                                                {{ convertCurrency(item.subtotal) }}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>




                    </div>
                </div> <!-- / .row -->
            </div>

        </div>
    </div>
</template>

<script>

import Sidebar from '@/components/Sidebar.vue';
import TopNav from '@/components/TopNav.vue';
import axios from 'axios';
import currency_formatter from 'currency-formatter';
import moment from 'moment';

export default {
    name: 'VentasDetalleApp.vue',
    data() {
        return {
            venta: {},
            detalles: []
        }
    },

    beforeMount() {
        this.init_data();
    },

    methods: {
        init_data() {
            axios.get(this.$url + '/obtener_detalles_venta_admin/' + this.$route.params.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token,
                }
            }).then((result) => {
                console.log(result);
                this.venta = result.data.venta;
                this.detalles = result.data.detalles;
            });
        },
        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'CLP' });
        },
        convertDate(item) {
            return moment(item).format('YYYY/MM/DD');
        },
        printDireccionEnvio() {
        const oldTitle = document.title;
        document.title = 'Direccion-envio-' + (this.venta.serie || '');
        window.print();

        document.title = oldTitle;
        }
    },
    components: {
        Sidebar,
        TopNav

    }
}
</script>
<style>
@media print {
  /* Ocultar todo por defecto */
  body * {
    visibility: hidden;
  }

  /* Mostrar solo la card de direcciÃ³n de envÃ­o */
  #print-direccion-envio,
  #print-direccion-envio * {
    visibility: visible;
  }

  /* Posicionarla arriba a pÃ¡gina completa para que salga bien en el papel */
  #print-direccion-envio {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    box-shadow: none !important; /* opcional, para que no imprima la sombra */
  }

  /* Opcional: quitar el sidebar / topnav si por alguna razÃ³n siguen ocupando espacio */
  .main-content,
  .container-fluid {
    margin: 0 !important;
    padding: 0 !important;
  }
}
#print-direccion-envio .header-envio {
    border-bottom: 2px solid #cae0f3; /* lÃ­nea de separaciÃ³n */
    background-color: #ffffff;        /* fondo mÃ¡s claro para que parezca header */
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
}



</style>
