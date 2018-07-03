/* Copyrights-Developed by Taxi Technologies INC. */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.customRequests', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rides.customRequests', {
                url: '/customRequests',
                templateUrl: 'app/pages/rides/customRequests/customRequests.html',
                title: 'Custom Requests',
                controller: 'customRequestsCtrl'
                // sidebarMeta: {
                //     order: 3
                // }
            });
    }
})();
