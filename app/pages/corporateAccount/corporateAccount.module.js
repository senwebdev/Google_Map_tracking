/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.corporateAccount', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('corporateAccount', {
          url: '/corporateAccount',
          templateUrl: 'app/pages/corporateAccount/corporateAccountTable.html',
          title: 'Corporate Account',
          controller: 'corporateAccountCtrl',
          sidebarMeta: {
            icon: 'ion-ios-person-outline',
            order: 4
          }
        })
  }

})();
