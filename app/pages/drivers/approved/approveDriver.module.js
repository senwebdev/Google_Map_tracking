/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.approve', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.approve', {
                url: '/approve-driver/:driver_id',
                templateUrl: 'app/pages/drivers/approved/approveDriver.html',
                title: 'Approve Drivers',
                controller: 'approveDriverCtrl'
            });
    }
})();
