import Vue from 'vue';
import VueRouter from 'vue-router'
// import Buefy from 'buefy'
import App from './components/App.vue';
import Home from './components/Home.vue';
import Art from './components/Art.vue';
import Square, { name as squareRoute } from './components/Square/Square.vue';
import Lines, { name as linesRoute} from './components/Lines/Lines.vue';
import Lines2, { name as linesRoute2} from './components/Lines2/Lines.vue';
import 'buefy/dist/buefy.css'


const routes = [
  { name: squareRoute, path: `/${squareRoute}`, component: Square},
  { name: linesRoute, path: `/${linesRoute}`, component: Lines},
  { name: linesRoute2, path: `/${linesRoute2}`, component: Lines},
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