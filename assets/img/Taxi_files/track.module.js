/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.track', [
            'BlurAdmin.pages.track.driverTracking',
            'BlurAdmin.pages.track.customerTracking'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('track', {
                url: '/track',
                template : '<div ui-view></div>',
                abstract: true,
                title: 'Track'
                // sidebarMeta: {
                //     icon: 'ion-ios-location',
                //     order: 4
                // }
            });
    }

})();
