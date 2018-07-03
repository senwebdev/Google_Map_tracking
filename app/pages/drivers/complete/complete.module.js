(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.complete', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers.complete', {
                url: '/completeDriver',
                templateUrl:'app/pages/drivers/complete/complete.html',
                controller: 'completeCtrl',
                title: 'Complete Rides'
                
      });
    }
})();

