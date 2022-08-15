<script>
export default {
    props: ['elem'],
    data() {
        return {
            albumArtStyle: {}
        }
    },
    async mounted() {
        if (this.elem[1]) {
            let albumArt = this.elem[1].albumArt
            let schema = albumArt.split('//')[0]
            if (['http:', 'https:'].includes(schema)) {
                // remote image
                this.albumArtStyle = {
                    backgroundImage: `url(${albumArt})`
                }
            } else {
                // local image
                let absPath = await window.electronAPI.resolvePath(this.elem[0], this.elem[1].albumArt)
                let url = absPath.replaceAll('\\', '/')
                this.albumArtStyle = {
                    backgroundImage: `url(${url})`
                }
            }
        }
    },
    computed: {
        titleStyle() {
            if (!this.elem[1]) {
                return {
                    fontStyle: 'italic',
                    color: 'rgba(0, 0, 0, .8)'
                }
            }
        },
        title() {
            if (!this.elem[1]) return this.elem[0]
            return this.elem[1].title
        }
    },
    methods: {
        navigate(){
            if (this.elem[1]) {
                // already have dlmeta config
                this.$router.push(`/detail/${this.elem[0]}`)
            } else {
                // TODO
            }
        }
    }
}
</script>

<template>
    <li @click="navigate()">
        <div class="entry-image" :style="albumArtStyle"></div>
        <div class="entry-overview">
            <div class="entry-title" :style="titleStyle">{{ title }}</div>
        </div>
    </li>
</template>

<style scoped>
li {
    height: 150px;
    transition: all .2s;
    display: flex;
    /* overflow: hidden; */
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
