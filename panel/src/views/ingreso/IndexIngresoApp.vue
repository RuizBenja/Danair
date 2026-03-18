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

                                        <h1 class="header-title">Tus ingresos</h1>



                                    </div>
                                </div>
                                <div class="row align-items-center">
                                    <div class="col">
                                        <ul class="nav nav-tabs nav-overflow header-tabs">
                                            <li class="nav-item">
                                                <router-link to="/ingreso" class="nav-link" exact active-class="active">
                                                    Ingresos
                                                </router-link>
                                            </li>

                                            <li class="nav-item">
                                                <router-link to="/ingreso/create" class="nav-link"
                                                    active-class="active">
                                                    Nuevo Ingreso
                                                </router-link>
                                            </li>
                                        </ul>


                                    </div>

                                </div>

                            </div>
                        </div>
                        <div class="row mb-5">
                            <div class="col-9 d-flex">

                                <input type="date" class="form-control" style="margin-right: 1rem" v-model="inicio" />
                                <input type="date" class="form-control" v-model="hasta" />
                            </div>
                            <div class="col">
                                <button class="btn btn-primary" style="width:100%"
                                    v-on:click="init_data()">Buscar</button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">

                                <!-- Title -->
                                <h4 class="card-header-title mb-0">
                                    <b>Ingreso a inventario</b>
                                </h4>

                            </div>
                            <div class="table-responsive">
                                <table class="table table-sm table-nowrap card-table" id="ingresos-table">
                                    <thead>
                                        <tr>
                                            <th>Proveedor</th>
                                            <th>Numero de serie</th>
                                            <th>Monto</th>
                                            <th>Documento</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody class="fs-base" v-if="ingresos.length >= 1">
                                        <tr v-for="item in pagedIngresos" :key="item._id">
                                            <td>
                                                <a>{{ item.proveedor }}</a>
                                            </td>
                                            <td>
                                                <a v-if="item.serie">
                                                    #{{ item.serie.toString().padStart(6, '000000') }}
                                                </a>
                                                <span v-else class="text-muted">
                                                    Sin serie
                                                </span>
                                            </td>
                                            <td>
                                                {{ convertCurrency(item.monto_resultante) }}
                                            </td>
                                            <td>
                                                <a :href="$url + '/obtener_comprobante_ingreso/' + item.documento"
                                                    target="_blank">
                                                    <span class="badge bg-success">Abrir documento</span>
                                                </a>
                                            </td>
                                            <td>
                                                <button class="btn btn-primary btn-sm">
                                                    <router-link style=" color: white !important"
                                                        :to="{ name: 'ingreso-detalle', params: { id: item._id } }">
                                                        Ver detalles
                                                    </router-link>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>

                                    <tbody v-if="ingresos.length == 0">
                                        <tr>
                                            <td colspan="4">
                                                <div class="text-center">
                                                    <h1 class="display-4 mb-3 text-center">Filtra por fechas para
                                                        visualizar ingresos <img src="/assets/media/admincargando.gif"
                                                            alt="" style="width: 70px;">
                                                    </h1><p class="text-muted mb-4">No hay datos que mostrar!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="card-footer" v-if="ingresos.length > 0">
                                <b-pagination v-model="currentPage" :total-rows="ingresos.length" :per-page="perPage"
                                    aria-controls="ingresos-table">
                                </b-pagination>
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


export default {
    name: 'IndexIngresoApp',
    data() {
        return {
            inicio: '',
            hasta: '',
            ingresos: [],
            currentPage: 1,
            perPage: 5,
        }
    },
    methods: {

        init_data() {
            if (!this.inicio) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese la fecha de inicio',
                    type: 'error'
                });
            } else if (!this.hasta) {
                this.$notify({
                    group: 'foo',
                    title: 'ERROR',
                    text: 'Ingrese la segunda fecha',
                    type: 'error'
                });
            } else {
                axios.get(this.$url + '/obtener_ingreso_admin/' + this.inicio + '/' + this.hasta, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.token,
                    }
                }).then((result) => {
                    this.ingresos = result.data;
                    this.currentPage = 1;
                })
            }
        },
        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'CLP' });
        },

    },
    computed: {
        pagedIngresos() {
            const inicio = (this.currentPage - 1) * this.perPage;
            return this.ingresos.slice(inicio, inicio + this.perPage);
        }
    },
    components: {
        Sidebar,
        TopNav

    }
}
</script>
