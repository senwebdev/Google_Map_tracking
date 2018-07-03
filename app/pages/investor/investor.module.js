
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.investor', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('investor', {
          url: '/investor',
          templateUrl: 'app/pages/investor/investor.view.html',
          title: 'Investors',
          controller: 'investorCtrl'
          // sidebarMeta: {
          //   icon: 'ion-ios-person',
          //   order: 5
          // }
        })
  }

})();
