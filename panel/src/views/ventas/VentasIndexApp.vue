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
                                            Ventas
                                        </h6>

                                        <h1 class="header-title">Tus ventas</h1>
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

                        <div class="row mb-3">
                            <div class="col-12 col-md-4 ms-auto">
                                <input type="text" class="form-control" v-model="searchText"
                                    placeholder="Buscar por NÂº de orden">
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">

                                <!-- Title -->
                                <h4 class="card-header-title mb-0">
                                    <b>Tus ventas realizadas</b>
                                </h4>

                            </div>
                            <div class="table-responsive">
                                <table class="table table-sm table-nowrap card-table" id="ventas-table">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Numero de orden</th>
                                            <th>Monto</th>
                                            <th>Estado</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody class="fs-base" v-if="filteredVentas.length >= 1">
                                        <tr v-for="item in pagedVentas" :key="item._id">
                                            <td>
                                                <a>{{ item.cliente.nombres }}</a>
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
                                                {{ convertCurrency(item.total + item.envio) }}
                                            </td>
                                            <td>
                                                {{ item.estado }}
                                            </td>
                                            <td>
                                                <button class="btn btn-primary btn-sm">
                                                    <router-link style=" color: white !important"
                                                        :to="{ name: 'ventas-detalle', params: { id: item._id } }">
                                                        Ver detalles
                                                    </router-link>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>

                                    <tbody v-if="ventas.length == 0">
                                        <tr>
                                            <td colspan="4">
                                                <div class="text-center">
                                                    <h1 class="display-4 mb-3 text-center">Filtra por fechas para
                                                        visualizar ventas <img src="/assets/media/admincargando.gif"
                                                            alt="" style="width: 70px;">
                                                    </h1>
                                                    <p class="text-muted mb-4">No hay datos que mostrar!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="card-footer" v-if="filteredVentas.length > 0">
                                <b-pagination v-model="currentPage" :total-rows="filteredVentas.length"
                                    :per-page="perPage" aria-controls="ventas-table">
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
import moment from 'moment';

export default {
    name: 'VentasIndexApp',
    data() {
        return {
            inicio: '',
            hasta: '',
            ventas: [],
            currentPage: 1,
            perPage: 5,
            searchText: ''
        }
    },
    methods: {
        init_data() {
            // 1) Si hay fechas â†’ buscar por rango de fechas
            if (this.inicio && this.hasta) {
                axios.get(this.$url + '/obtener_ventas_admin/' + this.inicio + '/' + this.hasta, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.token,
                    }
                }).then((result) => {
                    this.ventas = result.data;
                    this.currentPage = 1;
                }).catch(() => {
                    this.$notify({
                        group: 'foo',
                        title: 'ERROR',
                        text: 'Error al obtener ventas por fecha',
                        type: 'error'
                    });
                });

                return; // salimos, ya hicimos la bÃºsqueda por fecha
            }

            // 2) Si NO hay fechas, pero sÃ­ hay nÃºmero de orden/serie â†’ buscar por nÃºmero
            if (!this.inicio && !this.hasta && this.searchText) {

                axios.get(this.$url + '/obtener_ventas_admin_por_numero/' + this.searchText, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.token,
                    }
                }).then((result) => {
                    // Ajusta esto segÃºn lo que devuelva tu API:
                    // si devuelve un array:
                    this.ventas = result.data;

                    // si devuelve un solo objeto:
                    // this.ventas = result.data ? [result.data] : [];

                    this.currentPage = 1;
                }).catch(() => {
                    this.$notify({
                        group: 'foo',
                        title: 'ERROR',
                        text: 'No se encontrÃ³ ninguna venta con ese nÃºmero',
                        type: 'error'
                    });
                });

                return;
            }

            // 3) Si no hay fechas NI nÃºmero â†’ mostramos error genÃ©rico
            this.$notify({
                group: 'foo',
                title: 'ERROR',
                text: 'Ingresa un rango de fechas o un nÃºmero de orden',
                type: 'error'
            });
        },

        convertCurrency(number) {
            return currency_formatter.format(number, { code: 'CLP' });
        },
        convertDate(item) {
            return moment(item).format('YYYY/MM/DD');
        },
    },

    computed: {
        filteredVentas() {
    // Si no hay texto de bÃºsqueda, devolvemos todas las ventas cargadas
    if (!this.searchText) {
        return this.ventas;
    }

    const text = this.searchText.toString().trim().toLowerCase();

    return this.ventas.filter(item => {
        // serie sin formatear (tal cual en BD, nÃºmero)
        const serieRaw = (item.serie !== undefined && item.serie !== null)
            ? item.serie.toString()
            : '';

        // serie formateada a 6 dÃ­gitos (como la muestras en la tabla)
        const serieFormatted = (item.serie !== undefined && item.serie !== null)
            ? item.serie.toString().padStart(6, '000000')
            : '';

        // transacciÃ³n como string
        const transaccion = item.transaccion ? item.transaccion.toString() : '';

        return (
            serieRaw.toLowerCase().includes(text) ||
            serieFormatted.toLowerCase().includes(text) ||
            transaccion.toLowerCase().includes(text)
        );
    });
},


        // Ventas filtradas + paginadas
        pagedVentas() {
            const inicio = (this.currentPage - 1) * this.perPage;
            return this.filteredVentas.slice(inicio, inicio + this.perPage);
        }
    },
    watch: {
        searchText() {
            this.currentPage = 1;
        }
    },
    components: {
        Sidebar,
        TopNav
    }
}


</script>