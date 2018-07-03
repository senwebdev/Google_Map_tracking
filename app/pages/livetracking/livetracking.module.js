
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.livetracking', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/pages/livetracking/livetracking.html',
                title: 'livetracking',
                controller: 'livetrackingCtrl'
            });
    }
})();
