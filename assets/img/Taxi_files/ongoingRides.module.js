/* Copyrights-Developed by Taxi Technologies INC. */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.ongoingRides', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rides.ongoingRides', {
                url: '/ongoingRides',
                templateUrl: 'app/pages/rides/ongoingRides/ongoingRides.html',
                title: 'Ongoing',
                controller: 'ongoingRidesCtrl'
                // sidebarMeta: {
                //     order: 1
                // }
            });
    }
})();
