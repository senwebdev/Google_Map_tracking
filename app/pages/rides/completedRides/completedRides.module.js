/* Copyrights-Developed by Taxi Technologies INC. */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.completedRides', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rides.completedRides', {
                url: '/completedRides',
                templateUrl: 'app/pages/rides/completedRides/completedRides.html',
                title: 'Completed',
                controller: 'completedRidesCtrl'
                // sidebarMeta: {
                //     order: 0
                // }
            });
    }
})();
