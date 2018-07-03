/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular
      .module("BlurAdmin.pages.drivers.driverDetails", ['ngMessages'])
      .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.driverDetails', {
                url: '/driverDetails',
                templateUrl: 'app/pages/drivers/appointments/driverDetails.html',
                title: 'Driver Details',
                params:{selectedIndex:null},
                controller: 'driverDetailsCtrl'
            });
    }
})();
