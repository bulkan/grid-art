import Vue from 'vue';
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import App from './components/App.vue';
import Home from './components/Home.vue';
import Square from './components/Square/Square.vue';
import 'buefy/dist/buefy.css'

const routes = [
  { path: '/squares', component: Square},
  { path: '/', component: Home },
];

Vue.use(Buefy);
Vue.use(VueRouter);

const router = new VueRouter({  mode: 'history', routes });

new Vue({
  router,
  render: createElement => createElement(App) 
}).$mount('#app');