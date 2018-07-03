/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.appointments', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.appointments', {
                url: '/appointmentsDriver',
                templateUrl: 'app/pages/drivers/appointments/appointmentsDriver.html',
                title: 'Appointments for Drivers',
                controller: 'appointmentsDriverCtrl'
            });
    }
})();
