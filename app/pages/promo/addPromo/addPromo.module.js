(function () {
    'use strict';

    angular.module('BlurAdmin.pages.promo.addPromo', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('promo.add', {
                url: '/addPromo',
                templateUrl: 'app/pages/promo/addPromo/addPromo.html',
                title: 'Promo Add',
                controller: 'addPromoCtrl',
                // sidebarMeta: {
                //     order: 20
                // }
            });
    }
})();