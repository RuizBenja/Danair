<template>
    <div>
        <Sidebar />
        <div class="main-content">

            <TopNav />

            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-10 col-xl-8">
                        <!--HEADER-->
                        <div class="header mt-md-5">
                            <div class="header-body">
                                <div class="row align-items-center">
                                    <div class="col">

                                        <h6 class="header-pretitle">
                                            Ingreso
                                        </h6>

                                        <h1 class="header-title">Tus ingresos</h1>



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
                                                <router-link to="/ingreso/create" class="nav-link">Nuevo
                                                    Ingreso</router-link>
                                            </li>

                                        </ul>

                                    </div>

                                </div>

                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="card">
                                    <div class="card-body">

                                        <!-- List group -->
                                        <div class="list-group list-group-flush my-n3">
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">

                                                        <!-- Title -->
                                                        <h5 class="mb-0">
                                                            Proveedor
                                                        </h5>

                                                    </div>
                                                    <div class="col-auto">

                                                        <!-- Time -->
                                                        <time class="small text-muted" datetime="1988-10-24">
                                                            {{ ingreso.proveedor }}
                                                        </time>

                                                    </div>
                                                </div> <!-- / .row -->
                                            </div>
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">

                                                        <!-- Title -->
                                                        <h5 class="mb-0">
                                                            Comprobante
                                                        </h5>

                                                    </div>
                                                    <div class="col-auto">

                                                        <!-- Time -->
                                                        <time class="small text-muted" datetime="2018-10-28">
                                                            {{ ingreso.ncomprobante }}
                                                        </time>

                                                    </div>
                                                </div> <!-- / .row -->
                                            </div>
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">

                                                        <!-- Title -->
                                                        <h5 class="mb-0">
                                                            Serie
                                                        </h5>

                                                    </div>
                                                    <div class="col-auto">

                                                        <!-- Text -->
                                                        <small class="text-muted" v-if="ingreso.serie">
                                                            {{ ingreso.serie.toString().padStart(6, '000000') }}
                                                        </small>

                                                    </div>
                                                </div> <!-- / .row -->
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="card">
                                    <div class="card-body">

                                        <!-- List group -->
                                        <div class="list-group list-group-flush my-n3">
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">

                                                        <!-- Title -->
                                                        <h5 class="mb-0">
                                                            Monto Total
                                                        </h5>

                                                    </div>
                                                    <div class="col-auto">

                                                        <!-- Time -->
                                                        <time class="small text-muted" datetime="1988-10-24">
                                                            {{ convertCurrency(ingreso.monto_total) }}
                                                        </time>

                                                    </div>
                                                </div> <!-- / .row -->
                                            </div>
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">

                                                        <!-- Title -->
                                                        <h5 class="mb-0">
                                                            Monto resultante
                                                        </h5>

                                                    </div>
                                                    <div class="col-auto">

                                                        <!-- Time -->
                                                        <time class="small text-muted" datetime="2018-10-28">
                                                            {{ convertCurrency(ingreso.monto_resultante) }}
                                                        </time>

                                                    </div>
                                                </div> <!-- / .row -->
                                            </div>
                                            <div class="list-group-item">
                                                <div class="row align-items-center">
                                                    <div class="col">

                                                        <!-- Title -->
                                                        <h5 class="mb-0">
                                                            Fecha de creaciÃ³n
                                                        </h5>

                                                    </div>
                                                    <div class="col-auto">

                                                        <!-- Text -->
                                                        <small class="text-muted">
                                                            {{ convertDate(ingreso.createdAt) }}
                                                        </small>

                                                    </div>
                                                </div> <!-- / .row -->
                                            </div>
                                        </div>

                                    </div>
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
                                            <th>Variedad</th>
                                            <th>Precio Unitario</th>
                                            <th>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody class="fs-base">
                                        <tr v-for="item in detalles" :key="item._id">
                                            <td>
                                                <a v-if="item.producto">
                                                    {{ item.producto.titulo }}
                                                </a>
                                                <span v-else class="text-muted">
                                                    Producto eliminado
                                                </span>
                                            </td>

                                            <td>
                                                <span v-if="item.variedad">
                                                    {{ item.variedad.variedad }}
                                                </span>
                                                <span v-else class="text-muted">
                                                    Sin variedad
                                                </span>
                                            </td>

                                            <td>
                                                <time datetime="2020-04-24">
                                                    {{ convertCurrency(item.precio_unidad) }}
                                                </time>
                                            </td>

                                            <td>
                                                {{ item.cantidad }}
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
    name: 'DetalleIngresoApp',
    data() {
        return {
            ingreso: {},
            detalles: []
        }
    },
    beforeMount() {
        this.init_data();
    },
    methods: {
        init_data() {
            axios.get(this.$url + '/obtener_detalles_ingreso_admin/' + this.$route.params.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.$store.state.token,
                }
            }).then((result) => {
                this.ingreso = result.data.ingreso;
                this.detalles = result.data.detalles;
            });
        },
        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'CLP' });
        },
        convertDate(item) {
            return moment(item).format('YYYY/MM/DD');
        },
    },
    components: {
        Sidebar,
        TopNav

    }
}
</script>
