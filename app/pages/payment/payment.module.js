/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.payment', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('payment', {
          url: '/payment',
          templateUrl: 'app/pages/payment/paymentTable.html',
          title: 'Payment',
          controller: 'paymentCtrl',
          sidebarMeta: {
            icon: 'ion-cash',
            order: 5
          }
        })
  }

})();
