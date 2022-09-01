import { createRouter, createWebHashHistory } from "vue-router"

import Home from "@/views/Home.vue"
import Setting from "@/views/Setting.vue"
import Detail from "@/views/Detail.vue"
import Process from "@/views/Process.vue"

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
        path: "/detail/:id",
        name: "Detail",
        component: Detail,
    },
    {
        path: "/process/:id",
        name: "Process",
        component: Process,
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router
