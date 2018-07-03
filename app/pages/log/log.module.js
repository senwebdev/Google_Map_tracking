/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.log', [])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
          .state('log', {
            url: '/log',
            templateUrl: 'app/pages/log/log.view.html',
            title: 'Logs',
            controller: 'logCtrl'
            // sidebarMeta: {
            //   icon: 'ion-ios-person',
            //   order: 5
            // }
          })
    }
  
  })();
  