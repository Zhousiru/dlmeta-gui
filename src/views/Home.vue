<script>
import OverviewCard from '../components/OverviewCard.vue'

export default {
    components: {
        OverviewCard
    },
    data() {
        return {
            raw: {
                ready: [],
                done: [],
                original: []
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList: async function () {
            let tempRaw = {
                ready: [],
                done: [],
                original: []
            }

            let m = await window.electronAPI.getRawList()

            for (let el of m) {
                let detail = await window.electronAPI.getDlmetaDetail(el.id)

                if (!detail) {
                    tempRaw.original.push({
                        id: el.id,
                        folder: el.folder,
                        detail: undefined
                    })
                    continue
                }

                if (detail.status == 'done') {
                    tempRaw.done.push({
                        id: el.id,
                        folder: el.folder,
                        detail: detail
                    })
                    continue
                }

                if (detail.status == 'ready') {
                    tempRaw.ready.push({
                        id: el.id,
                        folder: el.folder,
                        detail: detail
                    })
                    continue
                }
            }

            this.raw = tempRaw
        }
    }
}
</script>

<template>
    <div class="card">
        <h1>概览</h1>
    </div>
    <div class="card" id="nav">
        <button class="button button-outline" @click="getList()">刷新</button>
        <button class="button button-outline" @click="this.$router.push('/setting')"
            style="margin-left: auto;">设置</button>
    </div>
    <overview-card :obj="raw.original" status="original"></overview-card>
    <overview-card :obj="raw.ready" status="ready"></overview-card>
    <overview-card :obj="raw.done" status="done" @refresh="getList()"></overview-card>
</template>

<style scoped>
#nav {
    display: flex;
}
</style>
