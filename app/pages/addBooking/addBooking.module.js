/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.addBooking', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('addBooking', {
                url: '/addBooking',
                templateUrl: 'app/pages/addBooking/addBooking.html',
                title: 'Add Booking',
                controller: 'addBookingCtrl',
                sidebarMeta: {
                    icon: 'ion-ios-person',
                    order: 5
                }
            })
    }
})();