<script>
import AudioCard from '../components/AudioCard.vue'

export default {
    components: { AudioCard },
    data() {
        return {
            id: '',
            detail: {}
        }
    },
    async mounted() {
        this.id = this.$route.params.id
        this.detail = await window.electronAPI.getDlmetaDetail(this.id)
    },
    methods: {

    }
}
</script>

<template>
    <div class="card">
        <h1>标记编辑</h1>
        <div class="subtitle">
            {{ detail.title }}
        </div>
    </div>
    <div class="card">
        <button class="button button-outline" @click="this.$router.go(-1)">返回</button>
    </div>
    <audio-card :audioMap="detail.audioMap" :editable="true"></audio-card>
</template>

<style scoped>
</style>
