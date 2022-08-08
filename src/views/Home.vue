<script>
export default {
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
        <div>未标记</div>
        <ul>
            <li v-for="i in raw.original">
                <div class="entry-image"></div>
                <div class="entry-overview">
                    <div class="entry-title">{{ i[0] }}</div>
                </div>
            </li>
        </ul>
    </div>
    <div class="card list">
        <div>未处理</div>
        <ul>
            <li v-for="i in raw.detailed">
                <div class="entry-image"></div>
                <div class="entry-overview">
                    <div class="entry-title">{{ i[1].title }}</div>
                </div>
            </li>
        </ul>
    </div>
    <div class="card list">
        <div>已完成</div>
        <ul>
            <li v-for="i in raw.done">
                <div class="entry-image"></div>
                <div class="entry-overview">
                    <div class="entry-title">{{ i[1].title }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
#nav {
    display: flex;
}

.list>div {
    color: rgba(0, 0, 0, .5);
}

.list>ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0 0;
}

.list>ul>li {
    height: 150px;
    border-radius: 16px;
    transition: all .2s;
    display: flex;
    overflow: hidden;
}

.list>ul>li:not(:first-child) {
    margin-top: .6rem;
}

.list>ul>li:hover {
    background-color: rgba(0, 0, 0, .05);
    cursor: pointer;
}

.entry-image {
    background-color: royalblue;
    border-radius: 16px;
    height: 150px;
    width: 150px;
}

.entry-overview {
    flex: 1;
    padding: .8em;
}

.entry-title {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    font-size: 1.2rem;
}
</style>
