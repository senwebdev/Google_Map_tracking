/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fleetManagement.addVehicle', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('fleetManagement.addVehicle', {
                url: '/addVehicle',
                templateUrl: 'app/pages/fleetManagement/addVehicle/addVehicle.html',
                title: 'Add Vehicle',
                controller: 'addVehicleCtrl'
            });
    }
})();