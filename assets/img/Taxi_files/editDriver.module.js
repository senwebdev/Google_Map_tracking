/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.editDriver', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.editDriver', {
                url: '/editDriver',
                templateUrl: 'app/pages/drivers/approved/editDriver.html',
                title: 'Edit Drivers',
                controller: 'editDriverCtrl'
            });
    }
})();
