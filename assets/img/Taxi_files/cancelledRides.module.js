/**
 * Created by tushar on 21/08/2016.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.cancelledRides', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rides.cancelledRides', {
                url: '/cancelledRides',
                templateUrl: 'app/pages/rides/cancelledRides/cancelledRides.html',
                title: 'Cancelled',
                controller: 'cancelledRidesCtrl'
                // sidebarMeta: {
                //     order: 1
                // }
            });
    }
})();
