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
            hint: false
        }
    },
    async mounted() {
        this.setting = await window.electronAPI.readSetting()
    },
    methods: {
        saveSetting: async function () {
            await window.electronAPI.saveSetting(toRaw(this.setting))

            this.hint = true
            setTimeout(() => {
                this.hint = false
            }, 1000)
        },
        selectSingle: async function (openType, target) {
            let props
            if (openType == 'file') {
                props = ['openFile']
            } else {
                props = ['openDirectory']
            }

            let filters = []
            if (target == 'cliPath') {
                filters = [{
                    'name': "DLmeta CLI",
                    'extensions': ['py']
                }]
            }

            let r = (await window.electronAPI.showOpenDialog(props, filters)).filePaths[0]
            if (r) this.setting[target] = r
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
        <div class="input-label">DLmeta CLI 路径：</div>
        <div class="form-combine">
            <input type="text" v-model="setting.cliPath">
            <button class="button" @click="selectSingle('file', 'cliPath')">...</button>
        </div>
        <div class="input-label">源路径：</div>
        <div class="form-combine">
            <input type="text" v-model="setting.rawPath">
            <button class="button" @click="selectSingle('dir', 'rawPath')">...</button>
        </div>
        <div class="input-label">输出路径：</div>
        <div class="form-combine">
            <input type="text" v-model="setting.outputPath">
            <button class="button" @click="selectSingle('dir', 'outputPath')">...</button>
        </div>
        <button class="button" style="margin-top: 1rem;" @click="saveSetting()">保存 & 应用</button>
        <transition name="fade">
            <span v-if="hint" style="margin-left: 1rem;">完成</span>
        </transition>
    </div>
</template>

<style scoped>
input {
    width: 100%;
}

.input-label:not(:first-child) {
    margin-top: 1.4rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
