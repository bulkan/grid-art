import Vue from "vue";
import VueRouter from "vue-router";
// import Buefy from 'buefy'
import App from "./src/components/App.vue";
import Home from "./src/components/Home.vue";
import Art from "./src/components/Art.vue";
import Square, {
  name as squareRoute
} from "./src/components/Square/Square.vue";
import Lines, { name as linesRoute } from "./src/components/Lines/Lines.vue";
import Squiggles, {
  name as squigglesRoute
} from "./components/Squiggles/Squiggles.vue";
import "buefy/dist/buefy.css";

const routes = [
  { name: squareRoute, path: `/${squareRoute}`, component: Square },
  { name: linesRoute, path: `/${linesRoute}`, component: Lines },
  { name: squigglesRoute, path: `/${squigglesRoute}`, component: Squiggles },
  { name: "home", path: "/", component: Home }
];

// Vue.use(Buefy);
Vue.use(VueRouter);

Vue.component("Art", Art);

const router = new VueRouter({ mode: "history", routes });

new Vue({
  router,
  render: createElement => createElement(App)
}).$mount("#app");
