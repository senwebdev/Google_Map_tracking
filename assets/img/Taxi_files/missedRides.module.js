/* Copyrights-Developed by Taxi Technologies INC. */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.missedRides', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rides.missedRides', {
                url: '/missedRides',
                templateUrl: 'app/pages/rides/missedRides/missedRides.html',
                title: 'Missed Rides',
                controller: 'missedRidesCtrl'
                // sidebarMeta: {
                //     order: 4
                // }
            });
    }
})();
