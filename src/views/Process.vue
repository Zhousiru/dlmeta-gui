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
        async refreshList() {
            this.procList = []

            let idList = this.$route.params.id.split(',')
            for (let id of idList) {
                let m = {}
                let detail = await window.electronAPI.getDlmetaDetail(id)

                m.id = id
                m.folder = await window.electronAPI.getRawFolderById(id)

                if (!detail) {
                    m.status = statusCode.original
                    m.title = undefined
                } else {
                    m.title = detail.title
                    if (detail.status == 'done') m.status = statusCode.done
                    if (detail.status == 'ready') m.status = statusCode.ready
                }

                this.procList.push(m)
            }
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
            if (el.title !== undefined) return el.title
            return el.folder
        },
        getBadgeClass(el) {
            if (el.status == statusCode.original) return 'warn'
            if (el.status == statusCode.ready) return 'info'
            if (el.status == statusCode.done) return 'success'
            if ([statusCode.genError, statusCode.convError].includes(el.status)) return 'error'
        },
        getBadgeText(el) {
            if (el.status == statusCode.original) return '?????????'
            if (el.status == statusCode.ready) return '?????????'
            if (el.status == statusCode.done) return '?????????'
            if (el.status == statusCode.genError) return '????????????'
            if (el.status == statusCode.convError) return '????????????'
        },
        async genDetailForOriginal() {
            this.isLoading = true
            for (let el of this.procList) {
                if ([statusCode.original, statusCode.genError].includes(el.status)) {
                    let r = await window.electronAPI.genDetail(el.id)
                    console.log(`[INFO][CLI][${el.id}]`, r)

                    if (r.stderr) el.status = statusCode.genError
                    else el.status = statusCode.ready

                    let detail = await window.electronAPI.getDlmetaDetail(el.id)
                    el.title = detail.title
                }
            }
            this.isLoading = false
        },
        isEditable(el) {
            return this.isLoading ? false : [statusCode.ready, statusCode.convError].includes(el.status)
        },
        editDetail(el) {
            if (this.isLoading) return

            if ([statusCode.ready, statusCode.convError].includes(el.status)) {
                this.$router.push(`/editor/${el.id}`)
            }
        },
        async convertReady() {
            this.isLoading = true
            for (let el of this.procList) {
                if ([statusCode.ready, statusCode.convError].includes(el.status)) {
                    let r = await window.electronAPI.convert(el.id)
                    console.log(`[INFO][CLI][${el.id}]`, r)

                    if (r.stderr) el.status = statusCode.convError
                    else el.status = statusCode.done
                }
            }
            this.isLoading = false
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
        <h1>????????????</h1>
    </div>
    <div class="card">
        <button class="button button-outline" @click="this.$router.go(-1)">??????</button>
    </div>
    <div class="card list-card">
        <div class="card-label">
            ??????<span class="spinner" v-if="isLoading"></span>
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
                title="????????????????????????????????????????????????">????????????</button>
            <button class="button" @click="convertReady()" :disabled="getDisable(disable.convertReady)"
                title="????????????????????????????????????????????????">????????????</button>
        </div>
    </div>
</template>

<style scoped>
.card-container>button:not(:first-child) {
    margin-left: 1rem;
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
