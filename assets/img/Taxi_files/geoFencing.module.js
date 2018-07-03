/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.geoFencing', [
            'BlurAdmin.pages.geoFencing.addArea',
        'BlurAdmin.pages.geoFencing.viewArea',
        'BlurAdmin.pages.geoFencing.viewAreaDetails'

    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('geoFencing', {
                url: '/geoFencing',
                template : '<div ui-view></div>',
                abstract: true,
                title: 'Geo Fencing'
                // sidebarMeta: {
                //     icon: 'ion-navigate',
                //     order: 5
                // }
            });
    }

})();
