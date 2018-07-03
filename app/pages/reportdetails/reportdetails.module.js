/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reportdetails', [
            'BlurAdmin.pages.reportdetails.userreport',
            'BlurAdmin.pages.reportdetails.pastridesreport'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('reportdetails', {
                url: '/reportdetails',
                template : '<div ui-view></div>',
                abstract: true,
                title: 'Report Details'
            });
    }

})();