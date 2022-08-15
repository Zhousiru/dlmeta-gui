<script>
import { toRaw } from 'vue'
import AudioCard from '../components/AudioCard.vue'

export default {
    components: {
        AudioCard
    },
    data() {
        return {
            detail: {}
        }
    },
    async mounted() {
        this.detail = await window.electronAPI.getDlmetaDetail(this.$route.params.folder)
    },
    computed: {
        cvStr() {
            let cvList = []
            for (let i in this.detail.cv) {
                cvList.push(this.detail.cv[i])
            }

            return cvList.join(' / ')
        }
    }
}
</script>

<template>
    <div class="card">
        <h1>详情</h1>
        <div id="title">
            {{ detail.title }}
        </div>
    </div>
    <div class="card">
        <button class="button button-outline" @click="this.$router.go(-1)">返回</button>
    </div>
    <div class="card" id="info">
        <div class="card-label">基本信息</div>
        <table id="info-table">
            <tr>
                <td>状态</td>
                <td>
                    {{ detail.status }}
                </td>
            </tr>
            <tr>
                <td>标题</td>
                <td>
                    {{ detail.title }}
                </td>
            </tr>
            <tr>
                <td>ID</td>
                <td>{{ detail.id }}</td>
            </tr>
            <tr>
                <td>封面</td>
                <td>{{ detail.albumArt }}</td>
            </tr>
            <tr>
                <td>团体</td>
                <td>{{ detail.circle }}</td>
            </tr>
            <tr>
                <td>声优</td>
                <td>
                    {{ cvStr }}
                </td>
            </tr>
        </table>
    </div>
    <audio-card></audio-card>
</template>

<style scoped>
#title {
    margin-top: .2rem;
    color: rgba(0, 0, 0, .6);
    word-break: break-all;
}

#info-table {
    border-collapse: separate;
    border-spacing: 1.2rem;
    word-break: break-all;
}

#info-table td:nth-child(1) {
    font-weight: bold;
    text-align: right;
    vertical-align: top;
    width: 2em;
}
</style>
