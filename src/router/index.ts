import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/music",
    },
    {
      path: "/music",
      component: () => import("@/pages/Music.vue"),
    },
    {
      path: "/playlist",
      component: () => import("@/components/PlaylistList.vue"),
    },
    {
      path: "/playlist/:id",
      component: () => import("@/components/PlaylistEditor.vue"),
    }
  ],
});

export default router;
