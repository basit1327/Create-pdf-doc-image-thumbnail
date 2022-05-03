const uniqid = require('uniqid')
    libre = require('libreoffice-convert'),
    path = require('path'),
    fs = require('fs'),
    PdfThumbExt = require('../pdf');

async function getThumbnail(filePath){
    try {
        return new Promise(resolve => {
            const extend = '.pdf'
            let fileName = uniqid()
            const outputPath = `${global.__basedir}/tmp_thumbnails/${fileName}${extend}`

            // Read file
            const file = fs.readFileSync(filePath);

            // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
            libre.convert(file, extend, undefined, async (err, done) => {
                if (err) {
                    console.log(`Error converting file: ${err}`);
                    resolve(new Error(err))
                }
                else {
                    // Here in done you have pdf file which you can save or transfer in another stream
                    fs.writeFileSync(outputPath, done);
                    let thumbnailFromPdf = await PdfThumbExt.getThumbnail(outputPath)
                    resolve(`${global.__basedir}/tmp_thumbnails/${thumbnailFromPdf}`)
                    fs.unlink(outputPath,(err => {
                        if(err){
                            console.log(err)
                        }
                    }))
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
