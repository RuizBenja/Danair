<template>
  <div id="app">
    <!--<Sidebar />-->
    <notifications group="foo"/>
    <router-view/>
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar.vue';

  export default{
    components:{
      Sidebar
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh !important;

}
a{
  color: #6e84a3 !important;
}

.modal-header .close {
  margin: 0 !important;
  padding: 0 !important;
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d2ddec;
  border-radius: 0.75rem;
  background: #f9fbff;
  color: #6e84a3 !important;
  opacity: 1 !important;
  box-shadow: none !important;
  transition: all 0.2s ease;
}

.modal-header .close:hover,
.modal-header .close:focus,
.modal-header .close:active {
  background: #e63757;
  border-color: #e63757;
  color: #fff !important;
  opacity: 1 !important;
}

.modal-header .close span {
  font-size: 1.15rem;
  line-height: 1;
  font-weight: 500;
}
</style>
