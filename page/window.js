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
            methods: {}
        });
        global.App.Network.send({
            url: 'app://window/query-layout-info',
            data: {id: global.App.id},
            callback: function (error, layout) {
                window.globalVM.layout = layout;
            }
        });
        var updatePackage = function (event, data) {
            var $el = document.getElementById(`package-${data.name}`);
            $el.__vue__.path = '';
        };
        global.App.Network.listen('package-loaded', updatePackage);
        global.App.Network.listen('package-unloaded', updatePackage);
    });

})(window);