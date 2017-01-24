'use strict';

const Fs = require('fs');
const Path = require('path');

exports.template = Fs.readFileSync(Path.join(__dirname, './split.html'), 'utf-8');

exports.props = ['direction', 'drag', 'index'];

exports.data = function () {
    return {
        highlight: false
    };
};

exports.methods = {
    _onMouseDown () {
        // if (!this.drag) return;
        this.highlight = true;
    },
    _onMouseUp () {
        // if (!this.drag) return;
        this.highlight = false;
    },

    _onDragStart (event) {
        // if (!this.drag) return;
        event.stopPropagation();
        this.cachePosition = {
            x: event.screenX,
            y: event.screenY
        };
        this.highlight = true;
        event.dataTransfer.dropEffect = 'move';
    },

    _onDrag (event) {
        // if (!this.drag) return;
        event.stopPropagation();
        if (event.screenX === 0 && event.screenY === 0) {
            return;
        }

        event.dataTransfer.dropEffect = 'move';
        var offsetX = event.screenX - this.cachePosition.x;
        var offsetY = event.screenY - this.cachePosition.y;
        this.cachePosition.x = event.screenX;
        this.cachePosition.y = event.screenY;
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', true, true);
        evt.dragOffset = {
            x: offsetX,
            y: offsetY,
            index: this.index
        };
        event.target.dispatchEvent(evt);
    },

    _onDragEnd (event) {
        // if (!this.drag) return;
        event.stopPropagation();
        this.highlight = false;
    }
};