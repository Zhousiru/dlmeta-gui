<script>
import { toRaw } from 'vue'

export default {
    data() {
        return {
            setting: {
                cliPath: "",
                rawPath: "",
                outputPath: ""
            },
            show: false
        }
    },
    async mounted() {
        this.setting = await window.electronAPI.readSetting()
    },
    methods: {
        saveSetting: async function () {
            await window.electronAPI.saveSetting(toRaw(this.setting))
            this.show = true
            setTimeout(() => {
                this.show = false
            }, 1000)
        }
    }
}
</script>

<template>
    <div class="card">
        <h1>设置</h1>
    </div>
    <div class="card">
        <button class="button button-outline" @click="this.$router.go(-1)">返回</button>
    </div>
    <div class="card">
        <div class="input-lable">DLmeta CLI 路径：</div>
        <input type="text" v-model="setting.cliPath">
        <div class="input-lable">源路径：</div>
        <input type="text" v-model="setting.rawPath">
        <div class="input-lable">输出路径：</div>
        <input type="text" v-model="setting.outputPath">
        <button class="button" style="margin-top: 1.4rem;" @click="saveSetting()">保存</button>
        <transition name="fade">
            <span v-if="show" style="margin-left: .6em;">已保存</span>
        </transition>
    </div>
</template>

<style scoped>
input {
    width: 100%;
}

.input-lable:not(:first-of-type) {
    margin-top: 1.4rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
