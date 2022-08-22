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

            let rawFolderList = await window.electronAPI.getFolderList('rawPath')

            rawFolderList.forEach(async folder => {
                let detail = await window.electronAPI.getDlmetaDetail(folder)

                if (!detail) {
                    this.raw.original.push({
                        folderName: folder,
                        detail: undefined
                    })
                    return
                }

                if (detail.status == 'done') {
                    this.raw.done.push({
                        folderName: folder,
                        detail: detail
                    })
                    return
                }

                // status: 'ready'
                this.raw.ready.push({
                    folderName: folder,
                    detail: detail
                })
            });
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
    <overview-card :obj="raw.ready" title="已标记"></overview-card>
    <overview-card :obj="raw.done" title="已完成"></overview-card>
</template>

<style scoped>
#nav {
    display: flex;
}
</style>
