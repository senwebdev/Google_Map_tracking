/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.subscribers', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('subscribers', {
          url: '/subscribers',
          templateUrl: 'app/pages/subscribers/subscribers.html',
          title: 'Subscribers',
          controller: 'subscribersCtrl'
          // sidebarMeta: {
          //   icon: 'ion-document-text',
          //   order: 10
          // }
        })
  }

})();
