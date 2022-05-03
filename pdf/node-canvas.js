const Canvas = require('canvas'),
    assert = require('assert')

function NodeCanvasFactory() {}

NodeCanvasFactory.prototype = {
    create: function NodeCanvasFactory_create(width, height) {
        assert(width > 0 && height > 0, 'Invalid canvas size')
        const canvas = Canvas.createCanvas(width, height)
        const context = canvas.getContext('2d')
        return {
            canvas: canvas,
            context: context,
        }
    },

    reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
        assert(canvasAndContext.canvas, 'Canvas is not specified')
        assert(width > 0 && height > 0, 'Invalid canvas size')
        canvasAndContext.canvas.width = width
        canvasAndContext.canvas.height = height
    },

    destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
        assert(canvasAndContext.canvas, 'Canvas is not specified')

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0
        canvasAndContext.canvas.height = 0
        canvasAndContext.canvas = null
        canvasAndContext.context = null
    },
}

module.exports = NodeCanvasFactory
