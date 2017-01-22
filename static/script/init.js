'use strict';

(function (global) {

    var parentDocument = global.parent.document;
    var parentWindow = global.parent.window;
    global.Package = null;

    var frames = parentDocument.getElementsByTagName('iframe');
    Array.prototype.some.call(frames, (frame) => {
        if (frame.contentWindow === global) {
            global.Package = parentWindow.App.Package.create(frame.name);
        }
    });

    /////////////
    // console //
    /////////////
    global._console = global.console;
    global.console = {
        log (...args) {
            // Package.name
            parentWindow.console.log(...args);
        },
        warn (...args) {
            // Package.name
            parentWindow.console.warn(...args);
        },
        info (...args) {
            // Package.name
            parentWindow.console.info(...args);
        },
        error (...args) {
            // Package.name
            parentWindow.console.error(...args);
        }
    };

    ///////////
    // alert //
    ///////////
    global.alert = function (...args) {
        // Package.name
        parentWindow.alert(...args);
    };

    // base path is ./page/index.html
    Package.Dialog = parentWindow.require('./scripts/lib/dialog');
    Package.Shell = parentWindow.require('./scripts/lib/shell');

})(window);