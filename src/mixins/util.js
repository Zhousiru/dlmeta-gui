export const util = {
    methods: {
        async getAlbumArtUrl(albumArt, id) {
            let schema = albumArt.split('//')[0]
            if (['http:', 'https:'].includes(schema)) {
                // remote image
                return albumArt
            } else {
                // local image
                let absPath = await window.electronAPI.resolvePath(id, albumArt)
                let url = absPath.replaceAll('\\', '/')

                return url
            }
        }
    }
}