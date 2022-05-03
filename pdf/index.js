const fs = require('fs'),
    uniqid = require('uniqid')
    NodeCanvasFactory = require('./node-canvas'),
    pdfjsLib = require('pdfjs-dist');


async function getThumbnail(filePath){
    // Read the PDF file into a typed array so PDF.js can load it.
    const rawData = new Uint8Array(fs.readFileSync(filePath))

    // Load the PDF file.
    const loadingTask = pdfjsLib.getDocument(rawData)

    return new Promise(resolve => {
        loadingTask.promise
            .then(function(pdfDocument) {
                // Get the first page.
                pdfDocument.getPage(1).then(function(page) {

                    // Render the page on a Node canvas with 100% scale.
                    const viewport = page.getViewport({ scale: 1.0 })
                    const canvasFactory = new NodeCanvasFactory()
                    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height)
                    const renderContext = {
                        canvasContext: canvasAndContext.context,
                        viewport: viewport,
                        canvasFactory: canvasFactory,
                    }

                    const renderTask = page.render(renderContext)
                    renderTask.promise.then(function() {
                        // Convert the canvas to an image buffer.
                        const image = canvasAndContext.canvas.toBuffer()
                        let imageName = uniqid()
                        fs.writeFile(`${global.__basedir}/tmp_thumbnails/${imageName}.png`, image, function (error) {
                            if (error) {
                                resolve(new Error(error.toString()))
                            } else {
                                resolve(`${global.__basedir}/tmp_thumbnails/${imageName}.png`)
                            }
                        })
                    })
                })
            })
            .catch(function(reason) {
                resolve(Error(reason))
            })
    })
}

module.exports = {
    getThumbnail
}
