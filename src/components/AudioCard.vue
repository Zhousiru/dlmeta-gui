<script>
export default {
    props: ['audioMap', 'editable'],
    data() {
        return {
            showDetail: [""],
            audioListRef: {},
            tempAudioMap: undefined,
            editField: undefined,
            newValue: '',
            detected: new Set([])
        }
    },
    methods: {
        toggleDetail(aid) {
            if (this.showDetail.includes(aid)) {
                let index = this.showDetail.indexOf(aid)
                this.showDetail.splice(index, 1)
            } else {
                this.showDetail.push(aid)
            }
        },
        openEditDialog(index, attr) {
            if (!this.editable) return

            this.editField = {
                index: index,
                attr: attr
            }
            this.newValue = this.tempAudioMap[this.editField.index][this.editField.attr]
        },
        closeEditDialog() {
            if (String(this.newValue).trim() == '') {
                this.editField = undefined
                return
            }

            let typeConv = (v) => {
                return {
                    'string': String.bind(null, v),
                    'number': Number.bind(null, v)
                }[typeof this.tempAudioMap[this.editField.index][this.editField.attr]]()
            }

            this.tempAudioMap[this.editField.index][this.editField.attr] = typeConv(this.newValue)
            this.editField = undefined
        },
        detect() {
            // detect invalid source
            let sourceFlag = false
            this.tempAudioMap.some(el => {
                if (el.ignore) return
                let existType = []
                el.source.some(s => {
                    let type = s.path.split('.').at(-1).toLowerCase()
                    if (existType.includes(type)) {
                        sourceFlag = true
                        return true
                    }
                    existType.push(type)
                })
            })
            if (sourceFlag) this.detected.add(0)
            else this.detected.delete(0)

            // detect invalid order
            let existOrder = []
            let orderFlag = false
            this.tempAudioMap.some(el => {
                if (el.ignore) return
                if (existOrder.includes(el.order)) {
                    orderFlag = true
                    return true
                }
                existOrder.push(el.order)
            })

            if (orderFlag) this.detected.add(1)
            else this.detected.delete(1)
        },
        isDetected(i) {
            // 0: invalid source
            // 1: invalid order
            // and more?
            return this.detected.has(i)
        },
        save() {
            console.log(JSON.stringify(this.tempAudioMap)) // TODO
        }
    },
    watch: {
        audioMap() {
            // wait for data, and keep it
            if (this.tempAudioMap) {
                return
            }

            this.tempAudioMap = JSON.parse(JSON.stringify(this.audioMap))
        },
        tempAudioMap: {
            handler() {
                this.detect()
            },
            deep: true
        }
    }
}
</script>

<template>
    <teleport to="body">
        <div class="modal" v-if="editField">
            <div class="input-label">编辑：</div>
            <div class="form-combine">
                <input type="text" v-model="newValue">
                <button class="button" @click="closeEditDialog()">确认</button>
            </div>
        </div>
    </teleport>

    <div class="card list-card">
        <div class="card-label">音频</div>
        <ol class="audio-list">
            <li v-for="(el, index) in tempAudioMap">
                <div class="list-header" @click="toggleDetail(el.aid)">
                    <span class="order"># {{ el.order }}</span>
                    <span class="list-title" :class="{ 'ignored-title': el.ignore }">{{ el.title }}</span>
                </div>
                <div class="list-detail" v-if="showDetail.includes(el.aid)">
                    <table id="info-table">
                        <tr>
                            <td>ID</td>
                            <td>{{ el.aid }}</td>
                        </tr>
                        <tr>
                            <td>标题</td>
                            <td @click="openEditDialog(index, 'title')" :class="{ 'editable-field': editable }">
                                {{ el.title }}
                            </td>
                        </tr>
                        <tr>
                            <td>顺序</td>
                            <td @click="openEditDialog(index, 'order')" :class="{ 'editable-field': editable }">{{
                                    el.order
                            }}</td>
                        </tr>
                        <tr>
                            <td>忽略</td>
                            <input type="checkbox" v-model="el.ignore" :disabled="!editable">
                        </tr>
                        <tr>
                            <td>源</td>
                            <td>
                                <ul class="source-list">
                                    <li>
                                        <label v-for="s in el.source" :class="{ 'ignored-title': s.ignore }">
                                            <input type="checkbox" v-model="s.ignore" :true-value="false"
                                                :false-value="true" :disabled="!editable">{{
                                                        s.path
                                                }}</label>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
            </li>
        </ol>
        <div class="card-container">
            <div class="alert" :class="{ 'success': !detected.size, 'error': detected.size }">
                <div v-if="!detected.size">通过合理性检测</div>
                <div v-if="detected.size">未通过合理性检测：</div>
                <div v-if="isDetected(0)">存在多个同类源</div>
                <div v-if="isDetected(1)">存在无效的顺序</div>
            </div>
            <button class="button" v-if="editable" @click="save()">保存</button>
        </div>
    </div>
</template>

<style scoped>
.card-container>button {
    margin-top: 1rem;
}

.audio-list li {
    display: flex;
    flex-direction: column;
}

.list-header,
.list-detail {
    display: flex;
}

.list-header {
    transition: all .2s;
    padding: 1rem 2rem;
    border-top: 1px rgba(0, 0, 0, .1) solid;
}

li:first-child>.list-header {
    border-top: none;
}

.list-header:hover {
    background-color: rgba(0, 0, 0, .05);
    cursor: pointer;
}

.order {
    color: rgba(0, 0, 0, .4);
    font-weight: bold;
    margin-right: .8rem;
    min-width: 2.5rem;
}

.list-title {
    flex: 1;
    word-break: break-all;
}

.list-detail {
    padding: 1rem 2rem;
    background-color: rgba(0, 0, 0, .05);
}

table {
    border-collapse: separate;
    border-spacing: .4rem;
    font-size: 14px;
    word-break: break-all;
}

td:nth-child(1) {
    font-weight: bold;
    text-align: right;
    vertical-align: top;
    width: 2em;
}

.source-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.ignored-title {
    font-style: italic;
    color: rgba(0, 0, 0, .8);
    text-decoration: line-through;
}

.editable-field {
    text-decoration: underline;
    transition: all .2s;
}

.editable-field:hover {
    cursor: pointer;
    color: rgba(0, 0, 0, .5);
}
</style>
