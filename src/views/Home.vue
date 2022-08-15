<script>
import HomeEntry from '../components/HomeEntry.vue'

export default {
    components: {
        HomeEntry
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
                    this.raw.original.push([folder, undefined])
                    return
                }

                if (detail.status == 'done') {
                    this.raw.done.push([folder, detail])
                    return
                }

                // status: 'ready'
                this.raw.ready.push([folder, detail])
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
    <div class="card list" id="list">
        <div class="card-label">未标记</div>
        <ul>
            <home-entry v-for="i in raw.original" :elem="i"></home-entry>
        </ul>
    </div>
    <div class="card list">
        <div class="card-label">未处理</div>
        <ul>
            <home-entry v-for="i in raw.ready" :elem="i"></home-entry>
        </ul>
    </div>
    <div class="card list">
        <div class="card-label">已完成</div>
        <ul>
            <home-entry v-for="i in raw.done" :elem="i"></home-entry>
        </ul>
    </div>
</template>

<style scoped>
#nav {
    display: flex;
}

.list {
    padding-left: 0;
    padding-right: 0;
}

.card-label {
    padding: 0 2rem;
}

.list>ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>
