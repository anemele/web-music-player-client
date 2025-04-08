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
      path: "/playlist/:id",
      name: "playlist",
      component: () => import("@/components/PlaylistEditor.vue"),
      props: true
    }
  ],
});

export default router;
