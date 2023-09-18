import { createApp } from "vue";
import VueRouter from "vue-router";
// import Buefy from 'buefy'
import App from "./components/App.vue";
import Home from "./components/Home.vue";
// import Art from "./components/Art.vue";
// import Square, { name as squareRoute } from "./components/Square/Square.vue";
// import Lines, { name as linesRoute } from "./components/Lines/Lines.vue";
// import Squiggles, {
//   name as squigglesRoute
// } from "./components/Squiggles/Squiggles.vue";
import "buefy/dist/buefy.css";

const routes = [
  // { name: squareRoute, path: `/${squareRoute}`, component: Square },
  // { name: linesRoute, path: `/${linesRoute}`, component: Lines },
  // { name: squigglesRoute, path: `/${squigglesRoute}`, component: Squiggles },
  { name: "home", path: "/", component: Home }
];

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes // short for `routes: routes`
});

const app = createApp(App);

app.use(router);
app.mount("#app");
