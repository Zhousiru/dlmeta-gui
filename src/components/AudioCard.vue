<script>
export default {
    props: ['audioMap'],
    methods: {

    },
    computed: {

    }
}
</script>

<template>
    <div class="card audio">
        <div class="card-label">音频</div>
        <ol class="audio-list">
            <li>
                <div class="list-header">
                    <span class="order"># 10</span>
                    <span class="list-title">
                        AudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitleAudioTitle
                    </span>
                </div>
                <div class="list-detail">
                    <table id="info-table">
                        <tr>
                            <td>ID</td>
                            <td>TR_01_XXXXXXXXXX</td>
                        </tr>
                        <tr>
                            <td>标题</td>
                            <td>
                                标题标题标题标题标题标题标题标题标题标题
                            </td>
                        </tr>
                        <tr>
                            <td>顺序</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>忽略</td>
                            <td>否</td>
                        </tr>
                        <tr>
                            <td>源</td>
                            <td>
                                <ul class="source-list">
                                    <li>
                                        <label>
                                            <input type="checkbox">
                                            path/to/audio/source1</label>
                                        <label>
                                            <input type="checkbox">
                                            path/to/audio/source2</label>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
            </li>
        </ol>
    </div>
</template>

<style scoped>
.audio-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.audio-list li {
    display: flex;
    flex-direction: column;
}

.audio {
    padding-left: 0;
    padding-right: 0;
}

.audio .card-label {
    padding: 0 2rem;
}

.list-header,
.list-detail {
    display: flex;
}

.list-header {
    transition: all .2s;
    padding: 1rem 2rem;
    border-top: 1px rgba(0, 0, 0, .1) solid;
    position: relative;
}

li:first-child>.list-header {
    border-top: none;
}

.list-header:hover {
    background-color: rgba(0, 0, 0, .05);
    cursor: pointer;
}

.order {
    color: rgba(0, 0, 0, .4);
    font-weight: bold;
    margin-right: .8rem;
    min-width: 2.5rem;
}

.list-title {
    flex: 1;
    word-break: break-all;
}

.list-detail {
    padding: 1rem 2rem;
    background-color: rgba(0, 0, 0, .05);
}

table {
    border-collapse: separate;
    border-spacing: .4rem;
    font-size: 14px;
    word-break: break-all;
}

td:nth-child(1) {
    font-weight: bold;
    text-align: right;
    vertical-align: top;
    width: 2em;
}

.source-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

</style>
