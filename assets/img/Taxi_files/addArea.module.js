/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.geoFencing.addArea', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('geoFencing.addArea', {
                url: '/addArea',
                templateUrl: 'app/pages/geoFencing/addArea/addArea.html',
                title: 'Add Area',
                controller: 'addAreaCtrl'
                // sidebarMeta: {
                //     order: 0
                // }
            });
    }
})();