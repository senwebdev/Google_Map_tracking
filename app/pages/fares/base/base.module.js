/* Copyrights-Developed by Qudos USA LLC */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fares.base', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('fares.base', {
                url: '/baseFare',
                templateUrl: 'app/pages/fares/base/base.html',
                title: 'Base Fares',
                controller: 'baseFaresCtrl',
                sidebarMeta: {
                    order: 0
                }
            });
    }
})();