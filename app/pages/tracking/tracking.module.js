/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tracking', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('tracking', {
                url: '/tracking',
                templateUrl: 'app/pages/tracking/track.html',
                controller: 'trackingCtrl',
                abstract: false,
                title: 'tracking'
            
            });
    }

})();
