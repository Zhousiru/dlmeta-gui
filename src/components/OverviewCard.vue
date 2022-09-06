<script>
import { util } from '../mixins/util.js'

export default {
    props: ['obj', 'title', 'status'],
    mixins: [util],
    data() {
        return {
            coverStyle: {},
            selected: new Set([])
        }
    },
    watch: {
        obj: {
            handler() {
                this.obj.forEach(async (el) => {
                    if (!el.detail) return
                    let url = await this.getAlbumArtUrl(el.detail.albumArt, el.id)
                    this.coverStyle[el.id] = {
                        backgroundImage: `url("${url}")`
                    }
                })
            },
            deep: true
        }
    },
    methods: {
        async navigate(el) {
            if (this.status == 'done') {
                // already done
                this.$router.push(`/detail/${el.id}`)
            } else {
                // no dlmeta config founded or not converted. navigate to process view(single)
                this.$router.push(`/process/${el.id}`)
            }
        },
        getTitleStyle(el) {
            if (!el.detail) {
                return {
                    fontStyle: 'italic',
                    color: 'rgba(0, 0, 0, .8)'
                }
            }
        },
        getTitle(el) {
            if (el.detail) return el.detail.title
            return el.folder
        },
        isSelected(el, type) {
            if (type == 'any') {
                return this.selected.size != 0
            }
            if (type == 'all') {
                return this.selected.size == this.obj.length
            }
            return this.selected.has(el.id)
        },
        select(el, all = false) {
            if (all) {
                this.obj.forEach(el => { this.selected.add(el.id) })
            } else {
                this.selected.add(el.id)
            }
        },
        unselect(el, all = false) {
            if (all) {
                this.selected.clear()
            } else {
                this.selected.delete(el.id)
            }
        },
        processSelected() {
            let str = [...this.selected].join(',')
            this.$router.push(`/process/${str}`)
        },
        resetSelected() {
            // TODO
        }
    }
}
</script>

<template>
    <div class="card list-card">
        <div class="card-label">
            <span v-if="status == 'original'">未标记</span>
            <span v-if="status == 'ready'">待转换</span>
            <span v-if="status == 'done'">已完成</span>

            <div class="select-action">
                <button @click="select(undefined, true)" v-if="!isSelected(undefined, 'all')"
                    class="lite-button">全选</button>
                <button @click="unselect(undefined, true)" v-if="isSelected(undefined, 'any')"
                    class="lite-button">取消所选</button>
                <button @click="processSelected()"
                    v-if="isSelected(undefined, 'any') && ['original', 'ready'].includes(status)"
                    class="lite-button">处理选中</button>
                <button @click="resetSelected()" v-if="isSelected(undefined, 'any') && status == 'done'"
                    class="lite-button">重建选中</button>
            </div>
        </div>
        <div class="card-container">
            <div class="alert primary" v-if="!obj.length">暂无</div>
        </div>
        <ul>
            <li v-for="el in obj" @click="navigate(el)" :class="{ 'selected': isSelected(el) }">
                <div class="entry-selector">
                    <button @click.stop="select(el)" class="lite-button" v-if="!isSelected(el)">选中</button>
                    <button @click.stop="unselect(el)" class="lite-button selected" v-if="isSelected(el)">取消</button>
                </div>
                <div class="entry-image" :style="coverStyle[el.id]"></div>
                <div class="entry-overview">
                    <div class="entry-title" :style="getTitleStyle(el)">{{ getTitle(el) }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.card-label {
    position: relative;
}

.select-action {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
}

.select-action>button {
    box-shadow: none;
}

li {
    transition: all .2s;
    display: flex;
    padding: 1rem 2rem;
    position: relative;
}

li:hover {
    background-color: rgba(0, 0, 0, .05);
    cursor: pointer;
}

li.selected {
    background-color: #e79a4788;
}

li.selected:hover {
    background-color: #e79a47a2;
}

.entry-selector {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0 1.5rem 1.5rem 0;
    pointer-events: none;
}

.entry-selector>.lite-button.selected {
    opacity: .6;
    pointer-events: none;
}

.entry-selector>.lite-button {
    opacity: 0;
    pointer-events: none;
}

li:hover .entry-selector>.lite-button {
    opacity: .6;
    pointer-events: auto;
}

.entry-image {
    background-color: #a5a5a5;
    background-size: cover;
    border-radius: 16px;
    height: 150px;
    width: 150px;
}

.entry-overview {
    flex: 1;
    padding: .8em;
}

.entry-title {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    font-size: 1.2rem;
}
</style>
