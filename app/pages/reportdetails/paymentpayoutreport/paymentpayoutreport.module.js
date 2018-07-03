/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reportdetails.paymentpayoutreport', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('reportdetails.paymentpayoutreport', {
                url: '/paymentpayoutreport',
                templateUrl: 'app/pages/reportdetails/paymentpayoutreport/paymentpayoutreport.html',
                title: 'User Reports',
                controller: 'paymentpayoutreportCtrl'
            });
    }
})();

