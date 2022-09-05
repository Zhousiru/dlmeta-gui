<script>
import AudioCard from '../components/AudioCard.vue'
import { util } from '../mixins/util.js'

export default {
    components: { AudioCard },
    mixins: [util],
    data() {
        return {
            id: '',
            detail: {},
            image: {
                albumArt: '',
                remote: [],
                local: []
            }
        }
    },
    async mounted() {
        this.id = this.$route.params.id
        this.detail = await window.electronAPI.getDlmetaDetail(this.id)

        this.image.remote = this.detail.dlImage
        this.detail.imageMap.forEach(async el => {
            this.image.local.push({
                path: el,
                url: await this.getAlbumArtUrl(el, this.id)
            })
        })
    },
    methods: {
        debug() {
            console.log(JSON.stringify(this.detail, null, 4))
            console.log(this.image)
        },
        getImageStyle(url) {
            return {
                backgroundImage: `url("${url}")`
            }
        },
        isSelected(v) {
            return v == this.detail.albumArt
        },
        setAlbumArt(v) {
            if (this.isSelected(v)) return
            this.detail.albumArt = v
        }
    },
    watch: {
        detail: {
            async handler() {
                if (this.detail === {}) return // wait for data
                this.image.albumArt = await this.getAlbumArtUrl(this.detail.albumArt, this.id)
            },
            deep: true
        }
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
    <div class="card" @click="debug()">
        <button class="button button-outline" @click="this.$router.go(-1)">返回</button>
    </div>
    <audio-card :audioMap="detail.audioMap" :editable="true"></audio-card>
    <div class="card">
        <div class="card-label">封面</div>
        <div class="album-art" :style="getImageStyle(image.albumArt)"></div>
        <div class="image-selector">
            <div class="from-remote">
                <div class="label">DLsite 图片</div>
                <div class="image">
                    <div v-for="url in image.remote" :style="getImageStyle(url)" :data-selected="isSelected(url)"
                        @click="setAlbumArt(url)"></div>
                </div>
            </div>
            <div class="from-local">
                <div class="label">本地图片</div>
                <div class="image">
                    <div v-for="el in image.local" :style="getImageStyle(el.url)" :data-selected="isSelected(el.path)"
                        @click="setAlbumArt(el.path)">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.album-art {
    width: 50%;
    max-width: 400px;
    aspect-ratio: 1;
    background-color: #a5a5a5;
    border-radius: 16px;
    background-size: cover;
}

.image-selector {
    margin-top: 1rem;
}

.from-remote>.label,
.from-local>.label {
    border-radius: 8px;
    background-color: var(--color-primary);
    padding: .2rem .5rem;
    font-size: .6rem;
    color: rgba(0, 0, 0, .5);
    margin-bottom: .8rem;
}

.image-selector .image {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 auto;
}

.image>div {
    background-color: #a5a5a5;
    background-size: cover;
    background-position: 50% 50%;
    width: calc(25% - .2rem*2);
    aspect-ratio: 1;
    margin: .2rem .2rem;
    border-radius: 16px;
    transition: all .2s;
    position: relative;
}

@media(max-width: 1000px) {
    .image>div {
        width: calc(33.33% - .2rem*2);
    }
}

.image>div::after {
    transition: all .2s;
    border-radius: 16px;
    border: 4px transparent solid;
}

.image>div:not([data-selected="true"]):hover {
    cursor: pointer;
}

.image>div:not([data-selected="true"])::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
}

.image>div:not([data-selected="true"]):hover::after {
    background-color: var(--color-accent);
    opacity: .5;
}

.image>div[data-selected="true"]::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 4px var(--color-accent) solid;
}

.from-local {
    margin-top: 1rem;
}
</style>
