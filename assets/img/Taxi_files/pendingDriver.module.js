/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.pending', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.pending', {
                url: '/pendingDriver',
                templateUrl: 'app/pages/drivers/pending/pendingDriver.html',
                title: 'Pending Drivers',
                controller: 'pendingDriverCtrl',
                // sidebarMeta: {
                //     order: 20
                // }
            });
    }
})();
