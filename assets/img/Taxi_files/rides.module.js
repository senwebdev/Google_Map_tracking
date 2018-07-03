/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides', [
            'BlurAdmin.pages.rides.completedRides',
            'BlurAdmin.pages.rides.ongoingRides',
            'BlurAdmin.pages.rides.scheduledRides',
            'BlurAdmin.pages.rides.missedRides',
            'BlurAdmin.pages.rides.cancelledRides',
            'BlurAdmin.pages.rides.customRequests'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rides', {
                url: '/rides',
                template : '<div ui-view></div>',
                abstract: true,
                title: 'Rides'
                // sidebarMeta: {
                //     icon: 'ion-model-s',
                //     order: 1
                // }
            });
    }

})();
