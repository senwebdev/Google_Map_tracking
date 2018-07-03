(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login', [])
        .config(routeConfig);

    function routeConfig($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/pages/login/login.html',
                title: 'Login',
                controller: 'loginCtrl'
            });
    }
})();
