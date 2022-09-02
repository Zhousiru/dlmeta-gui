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
    <audio-card :audio-map="detail.audioMap" :editable="true"></audio-card>
</template>

<style scoped>
</style>
