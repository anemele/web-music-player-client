import { createRouter, createWebHistory } from "vue-router";

import Music from "@/pages/Music.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Music,
    },
  ],
});

export default router;
