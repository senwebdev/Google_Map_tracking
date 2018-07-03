/* Copyrights-Developed by Taxi Technologies INC. */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.scheduledRides', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rides.scheduledRides', {
                url: '/scheduledRides',
                templateUrl: 'app/pages/rides/scheduledRides/scheduledRides.html',
                title: 'Scheduled Rides',
                controller: 'scheduledRidesCtrl'
                // sidebarMeta: {
                //     order: 3
                // }
            });
    }
})();
