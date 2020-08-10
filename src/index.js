import Vue from 'vue';
import VueRouter from 'vue-router'
// import Buefy from 'buefy'
import App from './components/App.vue';
import Home from './components/Home.vue';
import Art from './components/Art.vue';
import Square from './components/Square/Square.vue';
import Lines from './components/Lines/Lines.vue';
import 'buefy/dist/buefy.css'

const routes = [
  { name: 'squares', path: '/squares', component: Square},
  { name: 'lines', path: '/lines', component: Lines},
  { name: 'home', path: '/', component: Home },
];

// Vue.use(Buefy);
Vue.use(VueRouter);

Vue.component('Art', Art);

const router = new VueRouter({  mode: 'history', routes });

new Vue({
  router,
  render: createElement => createElement(App) 
}).$mount('#app');