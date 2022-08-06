<script>
export default {
    data() {
        return {
            setting: {
                cliPath: "",
                rawPath: "",
                outputPath: ""
            }
        }
    },
    mounted() {
        (async () => {
            this.setting = await window.electronAPI.readSetting()
        })()
    },
    methods: {
        saveSetting: async function () {
            console.log(this.setting)
            // TODO: write setting
        }
    }
}
</script>

<template>
    <div class="card">
        <h1>设置</h1>
    </div>
    <div class="card">
        <div class="input-lable">DLmeta CLI 路径：</div>
        <input type="text" v-model="setting.cliPath">
        <div class="input-lable">源路径：</div>
        <input type="text" v-model="setting.rawPath">
        <div class="input-lable">输出路径：</div>
        <input type="text" v-model="setting.outputPath">
        <button class="button" style="margin-top: 1.4rem;" @click="saveSetting()">保存</button>
    </div>
</template>

<style scoped>
input {
    width: 100%;
}

.input-lable:not(:first-of-type) {
    margin-top: 1.4rem;
}
</style>
