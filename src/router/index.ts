import { createRouter, createWebHashHistory } from "vue-router";

import Music from "@/pages/Music.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Music,
    },
  ],
});

export default router;
