/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.promo.list', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('promo.list', {
                url: '/list',
                templateUrl: 'app/pages/promo/promo/promoTable.html',
                title: 'Promo Listing',
                controller: 'promoCtrl',
                sidebarMeta: {
                    order: 20
                }
            });
    }
})();