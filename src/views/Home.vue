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
            this.raw = {
                ready: [],
                done: [],
                original: []
            }

            let m = await window.electronAPI.getRawList()

            m.forEach(async el => {
                let detail = await window.electronAPI.getDlmetaDetail(el.id)

                if (!detail) {
                    this.raw.original.push({
                        id: el.id,
                        folder: el.folder,
                        detail: undefined
                    })
                    return
                }

                if (detail.status == 'done') {
                    this.raw.done.push({
                        id: el.id,
                        folder: el.folder,
                        detail: detail
                    })
                    return
                }

                if (detail.status == 'ready') {
                    this.raw.ready.push({
                        id: el.id,
                        folder: el.folder,
                        detail: detail
                    })
                }
            })
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
    <overview-card :obj="raw.original" title="未标记"></overview-card>
    <overview-card :obj="raw.ready" title="待转换"></overview-card>
    <overview-card :obj="raw.done" title="已完成"></overview-card>
</template>

<style scoped>
#nav {
    display: flex;
}
</style>
