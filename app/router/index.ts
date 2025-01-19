import { createRouter, createWebHashHistory } from "vue-router";

import Music from '@/pages/Music.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/music',
            component: Music
        },
        {
            path: '/',
            redirect: '/music'
        },
        // {
        //     path: '/music/:id'
        // }
    ]
})

export default router