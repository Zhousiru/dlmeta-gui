<script>
const statusCode = {
    // real(save to file)
    original: 0, // untagged
    ready: 1,    // tagged, but not converted
    done: 2,     // converted. all done

    // virtual(save to var)
    convert: 3,
    genError: 4,
    convError: 5
}

export default {
    data() {
        return {
            procList: [],
            disable: {
                genDetailForOriginal: true,
                convertReady: true
            },
            isLoading: false
        }
    },
    mounted() {
        this.refreshList()
    },
    methods: {
        refreshList() {
            this.procList = []

            let idList = this.$route.params.id.split(',')
            idList.forEach(async id => {
                let m = {}
                let detail = await window.electronAPI.getDlmetaDetail(id)

                m.id = id
                m.folder = await window.electronAPI.getRawFolderById(id)

                if (!detail) {
                    m.status = statusCode.original
                    m.title = ''
                } else {
                    m.title = detail.title
                    if (detail.status == 'done') m.status = statusCode.done
                    if (detail.status == 'ready') m.status = statusCode.ready
                }

                this.procList.push(m)
            })
        },
        getDisable(b) {
            return this.isLoading ? true : b
        },
        getTitleStyle(el) {
            if (!el.title) {
                return {
                    fontStyle: 'italic',
                    color: 'rgba(0, 0, 0, .8)'
                }
            }
        },
        getTitle(el) {
            if (el.title) return el.title
            return el.folder
        },
        getBadgeClass(el) {
            if (el.status == statusCode.original) return 'warn'
            if (el.status == statusCode.ready) return 'info'
            if (el.status == statusCode.done) return 'success'
            if ([statusCode.genError, statusCode.convError].includes(el.status)) return 'error'
            // TODO
        },
        getBadgeText(el) {
            if (el.status == statusCode.original) return '未标记'
            if (el.status == statusCode.ready) return '待转换'
            if (el.status == statusCode.done) return '已完成'
            if (el.status == statusCode.genError) return '标记异常'
            // TODO
        },
        genDetailForOriginal() {
            this.procList.forEach(async el => {
                if ([statusCode.original, statusCode.genError].includes(el.status)) {

                    this.isLoading = true

                    let r = await window.electronAPI.genDetail(el.id)
                    console.log('[INFO][CLI]', r)
                    if (r.stderr) el.status = statusCode.genError
                    else el.status = statusCode.ready

                    this.isLoading = false
                }
            })
        },
        isEditable(el) {
            return el.status == statusCode.ready
        },
        editDetail(el) {
            if (el.status == statusCode.ready) {
                this.$router.push(`/editor/${el.id}`)
            }
        }
    },
    watch: {
        procList: {
            handler() {
                // reset
                Object.keys(this.disable).forEach((k) => {
                    this.disable[k] = true
                })

                this.procList.some(el => {
                    if ([statusCode.ready, statusCode.convError].includes(el.status)) {
                        this.disable.convertReady = false
                        return true
                    }
                })

                this.procList.some(el => {
                    if ([statusCode.original, statusCode.genError].includes(el.status)) {
                        this.disable.genDetailForOriginal = false
                        return true
                    }
                })
            },
            deep: true
        }
    }
}
</script>

<template>
    <div class="card">
        <h1>处理向导</h1>
        <div class="subtitle">
            {{ $route.params.id /* TODO */ }}
        </div>
    </div>
    <div class="card">
        <button class="button button-outline" @click="this.$router.go(-1)">返回</button>
    </div>
    <div class="card list-card">
        <div class="card-label">
            状态<span class="spinner" v-if="isLoading"></span>
        </div>
        <ol class="status-list">
            <li v-for="el in procList" @click="editDetail(el)" :class="{ 'editable': isEditable(el) }">
                <div class="title" :style="getTitleStyle(el)">
                    {{ getTitle(el) }}
                </div>
                <div class="status">
                    <div class="badge" :class="getBadgeClass(el)">{{ getBadgeText(el) }}</div>
                </div>
            </li>
        </ol>
        <div class="card-container">
            <button class="button" @click="genDetailForOriginal()" :disabled="getDisable(disable.genDetailForOriginal)"
                title="标记全部未标记以及标记异常的项目">标记全部</button>
            <button class="button" :disabled="getDisable(disable.convertReady)" title="转换全部待转换以及转换异常的项目">转换全部</button>
        </div>
    </div>
</template>

<style scoped>
.list-card {
    padding-left: 0;
    padding-right: 0;
}

.list-card .card-label,
.card-container {
    padding: 0 2rem;
}

.card-container {
    margin-top: 1rem;
}

.card-container>button:not(:first-child) {
    margin-left: 1rem;
}

.status-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.status-list>li {
    transition: all .2s;
    padding: 1rem 2rem;
    border-top: 1px rgba(0, 0, 0, .1) solid;
    word-break: break-all;
    display: flex;
}

.status-list>li:first-child {
    border-top: none;
}

.status-list>li>.title {
    flex: 1;
}

.status-list>li.editable {
    transition: all .2s;
    cursor: pointer;
}

.status-list>li.editable:hover {
    background-color: rgba(0, 0, 0, .05);
}

.status {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 2rem;
}
</style>
