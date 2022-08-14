import { createRouter, createWebHashHistory } from "vue-router"

import Home from "@/views/Home.vue"
import Setting from "@/views/Setting.vue"
import Detail from "@/views/Detail.vue"

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/setting",
        name: "Setting",
        component: Setting,
    },
    {
        path: "/detail/:folder",
        name: "Detail",
        component: Detail,
    }
];

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

export default router;
