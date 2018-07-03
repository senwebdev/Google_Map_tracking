/**
 * Created by tushar on 27/08/2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vouchers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('vouchers', {
                url: '/vouchers',
                templateUrl: 'app/pages/vouchers/vouchers.html',
                title: 'Vouchers',
                controller: 'vouchersCtrl',
                sidebarMeta: {
                    icon: 'ion-cash',
                    order: 7
                }
            })
    }
})();
