/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reportdetails.paymentreport', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('reportdetails.paymentreport', {
                url: '/paymentreport',
                templateUrl: 'app/pages/reportdetails/paymentreport/paymentreport.html',
                title: 'User Reports',
                controller: 'paymentreportCtrl'
            });
    }
})();