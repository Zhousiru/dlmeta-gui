<script>
export default {
    data() {
        return {
            rawList: []
        }
    },
    async mounted() {
        this.rawList = await window.electronAPI.getRawList()
        console.log(this.rawList)
        // TODO
    },
    methods: {

    }
}
</script>

<template>
    <div class="card">
        <h1>概览</h1>
    </div>
    <div class="card" id="nav">
        <button class="button button-outline" @click="this.$router.push('/setting')" style="margin-left: auto;">设置</button>
    </div>
</template>

<style scoped>
#nav {
    display: flex;
}
</style>
