(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.editAppDriver', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.editAppDrivers', {
                url: '/AppdriverDetails',
                templateUrl: 'app/pages/drivers/appointments/editAppDriver.html',
                title: 'App Driver Details',
                controller: 'editAppDriverCtrl'
            });
    }
})();
