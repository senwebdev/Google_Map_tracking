(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.completed', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.completed', {
                url: '/completedDriver',
                templateUrl:'app/pages/drivers/completed/completedDriver.html',
                controller: 'completedDriverCtrl',
                title: 'Completed Rides'
                
      });
    }
})();

