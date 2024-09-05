import { createRouter, createWebHistory } from "vue-router";
import FileUpload from "../views/FileUpload.vue";

const routes = [
  {
    path: "/upload",
    name: "file-upload",
    component: FileUpload,
  },
  {
    path: "/:pathMatch(.*)*", // Catch-all route
    redirect: "/upload",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
