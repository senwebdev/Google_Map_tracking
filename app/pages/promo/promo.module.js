(function () {
    'use strict';

    angular.module('BlurAdmin.pages.promo', [
                'BlurAdmin.pages.promo.list',
                'BlurAdmin.pages.promo.addPromo',
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('promo', {
                url: '/promo',
                template : '<div ui-view></div>',
                abstract: true,
                title: 'promo'
            });
    }

})();