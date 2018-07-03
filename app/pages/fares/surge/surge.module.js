/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fares.surge', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('fares.surge', {
                url: '/surgeFare',
                templateUrl: 'app/pages/fares/surge/surge.html',
                title: 'Surge Fares',
                controller: 'surgeFaresCtrl',
                sidebarMeta: {
                    order: 10
                }
            });
    }
})();