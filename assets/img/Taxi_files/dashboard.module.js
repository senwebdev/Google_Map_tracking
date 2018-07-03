/**
 * Created by web on 17/05/17.
 */
(function () {
    'use strict';


    angular.module('BlurAdmin.pages.dashboard', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/pages/dashboard/dashboard.html',
                title: 'Dashboard',
                controller: 'dashboardCtrl'
                // sidebarMeta: {
                //     icon: 'ion-android-home',
                //     order: 0
                // }
            });
    }



})();
