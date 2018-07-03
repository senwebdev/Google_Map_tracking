
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.heat', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('heat', {
                url: '/heat',
                templateUrl: 'app/pages/heat/heat.html',
                title: 'heat',
                controller: 'heatCtrl'
            });
    }
})();
