import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
  },
  getters: {
  },
  mutations: {
    setToken(state,token){
      state.token = token;
    }
  },
  actions: {
    saveToken({commit},token){
      commit('setToken', token);
      if (token) localStorage.setItem('token',token);
      else localStorage.removeItem('token');
    },
    logout({ commit }){
      commit('setToken', null);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  },
  modules: {
  }
})
