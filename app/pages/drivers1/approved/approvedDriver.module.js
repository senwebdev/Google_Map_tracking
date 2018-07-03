/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.approved', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.approved', {
                url: '/approvedDriver',
                templateUrl: 'app/pages/drivers/approved/approvedDriver.html',
                title: 'Approved Drivers',
                controller: 'approvedDriverCtrl'
                // sidebarMeta: {
                //     order: 10
                // }
            });
    }
})();