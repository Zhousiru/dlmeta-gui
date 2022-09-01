<script>
export default {
    props: ['audioMap', 'editable'],
    data() {
        return {
            showDetail: [""],
            audioListRef: {}
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
        }
    }
}
</script>

<template>
    <div class="card audio">
        <div class="card-label">音频</div>
        <ol class="audio-list">
            <li v-for="i in audioMap">
                <div class="list-header" @click="toggleDetail(i.aid)">
                    <span class="order"># {{ i.order }}</span>
                    <span class="list-title" :class="{ 'ignored-title': i.ignore }">{{ i.title }}</span>
                </div>
                <div class="list-detail" v-if="showDetail.includes(i.aid)">
                    <table id="info-table">
                        <tr>
                            <td>ID</td>
                            <td>{{ i.aid }}</td>
                        </tr>
                        <tr>
                            <td>标题</td>
                            <td>
                                {{ i.title }}
                            </td>
                        </tr>
                        <tr>
                            <td>顺序</td>
                            <td>{{ i.order }}</td>
                        </tr>
                        <tr>
                            <td>忽略</td>
                            <input type="checkbox" :checked="i.ignore" :disabled="!editable">
                        </tr>
                        <tr>
                            <td>源</td>
                            <td>
                                <ul class="source-list">
                                    <li>
                                        <label v-for="j in i.source" :class="{ 'ignored-title': j.ignore }">
                                            <input type="checkbox" :checked="!j.ignore" :disabled="!editable">{{
                                                    j.path
                                            }}</label>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
            </li>
        </ol>
    </div>
</template>

<style scoped>
.audio-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.audio-list li {
    display: flex;
    flex-direction: column;
}

.audio {
    padding-left: 0;
    padding-right: 0;
}

.audio .card-label {
    padding: 0 2rem;
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
</style>
