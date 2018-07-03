/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.geoFencing.viewArea', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('geoFencing.viewArea', {
                url: '/viewArea',
                templateUrl: 'app/pages/geoFencing/viewArea/viewArea.html',
                title: 'View Area',
                controller: 'viewAreaCtrl'
                // sidebarMeta: {
                //     order: 10
                // }
            });
    }
})();