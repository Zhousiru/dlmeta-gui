<script>
import AudioCard from '../components/AudioCard.vue'

export default {
    components: {
        AudioCard
    },
    data() {
        return {
            folder: ''
        }
    },
    mounted() {
        this.folder = this.$route.params.folder
    }
}
</script>

<template>
    <div class="card">
        <h1>详情</h1>
        <div id="title">
            标题标题标题标题标题标题标题标题标题标题
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
                    已完成
                </td>
            </tr>
            <tr>
                <td>标题</td>
                <td>
                    标题标题标题标题标题标题标题标题标题标题
                </td>
            </tr>
            <tr>
                <td>ID</td>
                <td>RJ23333333</td>
            </tr>
            <tr>
                <td>封面</td>
                <td>
                    <div>path/to/album-art</div>
                </td>
            </tr>
            <tr>
                <td>团体</td>
                <td>团体名</td>
            </tr>
            <tr>
                <td>声优</td>
                <td>
                    CV1 / CV2
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
