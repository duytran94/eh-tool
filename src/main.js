import Vue from "vue";
import App from "./App.vue";
import { Table, Field, Select, Input, Checkbox, Button } from "buefy";
import "buefy/dist/buefy.css";

Vue.use(Table);
Vue.use(Field);
Vue.use(Select);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Button);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
