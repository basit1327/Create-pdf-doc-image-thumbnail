const uniqid = require('uniqid')
    nodeThumbnail = require('node-thumbnail').thumb;

async function getThumbnail(filePath){
    try {
        let fileName = uniqid()
        let ext = filePath.split('.').pop().toLowerCase()
        return new Promise(resolve => {
            nodeThumbnail({
                source: filePath,
                destination: `${global.__basedir}/tmp_thumbnails`,
                concurrency: 4,
                width: 200,
                basename: fileName,
                suffix:'',
                quiet: true
            }, function(files, err) {
                if(err){
                    resolve(new Error(err))
                }
                else {
                    resolve(`${global.__basedir}/tmp_thumbnails/${fileName}.${ext}`)
                }
            });
        })
    } catch (err) {
        console.error(err);
        resolve(new Error(err.toString()))
    }
}

module.exports = {
    getThumbnail
}
