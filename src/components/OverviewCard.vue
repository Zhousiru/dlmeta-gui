<script>
import { util } from '../mixins/util.js'

export default {
    props: ['obj', 'title'],
    mixins: [util],
    data() {
        return {
            coverStyle: {}
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
            if (el.detail && el.detail.status == 'done') {
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
        }
    }
}
</script>

<template>
    <div class="card list-card">
        <div class="card-label">{{ title }}</div>
        <div class="card-container">
            <div class="alert primary" v-if="!obj.length">暂无</div>
        </div>
        <ul>
            <li v-for="el in obj" @click="navigate(el)">
                <div class="entry-image" :style="coverStyle[el.id]"></div>
                <div class="entry-overview">
                    <div class="entry-title" :style="getTitleStyle(el)">{{ getTitle(el) }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
li {
    transition: all .2s;
    display: flex;
    padding: 1rem 2rem;
}

li:hover {
    background-color: rgba(0, 0, 0, .05);
    cursor: pointer;
}

.entry-image {
    background-color: #a5a5a5;
    background-size: cover !important;
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
