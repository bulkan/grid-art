import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
// import Buefy from 'buefy'
import App from "./components/App.vue";
import Home from "./components/Home.vue";
import Art from "./components/Art.vue";
import Square, {
  name as squareRouteName
} from "./components/Square/Square.vue";
import Lines, { name as linesRouteName } from "./components/Lines/Lines.vue";
import Squiggles, {
  name as squigglesRouteName
} from "./components/Squiggles/Squiggles.vue";

import "buefy/dist/buefy.css";

const routes = [
  { name: squareRouteName, path: `/${squareRouteName}`, component: Square },
  { name: linesRouteName, path: `/${linesRouteName}`, component: Lines },
  {
    name: squigglesRouteName,
    path: `/${squigglesRouteName}`,
    component: Squiggles
  },
  { name: "home", path: "/", component: Home }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);

app.use(router);
app.component("Art", Art);
app.mount("#app");
