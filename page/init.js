(function (global) {

    var component = require('./scripts/component');

    global.App = require('./scripts/app');

    global.App.once('ready', function () {
        window.globalVM = new Vue({
            el: '#layout',
            components: component,
            data: {
                layout: {}
            },
            methods: {
                '_onMouseDown' () {

                }
            }
        });
        global.App.Network.ajax({
            url: 'app://window/query-layout-info',
            data: {id: global.App.id},
            callback: function (error, layout) {
                window.globalVM.layout = layout;
            }
        });
    });

})(window);