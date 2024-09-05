import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// main.js or similar entry file
import "./styles/mark.css";

createApp(App).use(router).mount("#app");
