/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.promo', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('promo', {
                url: '/promo',
                templateUrl: 'app/pages/promo/promoTable.html',
                title: 'Promo',
                controller: 'promoCtrl',
                sidebarMeta: {
                    icon: 'ion-cash',
                    order: 5
                }
            }) .state('addPromo', {
                url: '/addPromo',
                templateUrl: 'app/pages/promo/addPromo.html',
                title: 'Add Promo',
                controller: 'addPromoCtrl'
            })
    }

})();
