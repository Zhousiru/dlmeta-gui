<script>
import HomeEntry from '../components/HomeEntry.vue'

export default {
    components: {
        HomeEntry
    },
    data() {
        return {
            raw: {
                detailed: [],
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
                detailed: [],
                done: [],
                original: []
            }

            let outputFolderList = await window.electronAPI.getFolderList('outputPath')
            let rawFolderList = await window.electronAPI.getFolderList('rawPath')

            rawFolderList.forEach(async folder => {
                let detail = await window.electronAPI.getDlmetaDetail(folder)

                if (!detail) {
                    this.raw.original.push([folder, undefined])
                    return
                }

                if (outputFolderList.includes((detail.title))) {
                    this.raw.done.push([folder, detail])
                    return
                }

                this.raw.detailed.push([folder, detail])
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
        <div class="card-lable">未标记</div>
        <ul>
            <home-entry v-for="i in raw.original" :elem="i"></home-entry>
        </ul>
    </div>
    <div class="card list">
        <div class="card-lable">未处理</div>
        <ul>
            <home-entry v-for="i in raw.detailed" :elem="i"></home-entry>
        </ul>
    </div>
    <div class="card list">
        <div class="card-lable">已完成</div>
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

.card-lable {
    padding: 0 2rem;
}

.list>ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>
