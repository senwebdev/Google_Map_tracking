/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fares', [
            'BlurAdmin.pages.fares.surge',
        'BlurAdmin.pages.fares.base',
        'BlurAdmin.pages.fares.fareDetails'
    ])
    .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('fares', {
            url: '/fares',
            template : '<div ui-view></div>',
            abstract: true,
            title: 'Fares',
            sidebarMeta: {
                icon: 'ion-social-usd',
                order: 5
            }
        });
    }

})();
