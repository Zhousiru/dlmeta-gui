<script>
export default {
    props: ['elem'],
    methods: {
        getCoverStyle: function (i) {
            if (i[1]) {
                if (i[1].albumArt) {
                    return {
                        backgroundImage: `url(${i[1].albumArt})`
                    }
                }

                return {
                    background: `linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url(${i[1].dlImage[0]})`
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
    }
}
</script>

<template>
    <li @click="this.$router.push(`/detail/${elem[0]}`)">
        <div class="entry-image" :style="getCoverStyle(elem)"></div>
        <div class="entry-overview">
            <div class="entry-title" :style="titleStyle">{{ title }}</div>
        </div>
    </li>
</template>

<style>
li {
    height: 150px;
    transition: all .2s;
    display: flex;
    overflow: hidden;
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
