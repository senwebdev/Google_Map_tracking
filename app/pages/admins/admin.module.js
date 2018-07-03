/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.admin', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('admin', {
          url: '/admin',
          templateUrl: 'app/pages/admins/adminTable.html',
          title: 'Admins',
          controller: 'adminCtrl',
          sidebarMeta: {
            icon: 'ion-ios-person',
            order: 5
          }
        })
  }

})();
