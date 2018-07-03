/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drivers.documentsAll', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('drivers.documentsAll', {
          url: '/documentsAll',
          templateUrl: 'app/pages/drivers/documentsAll/documents.html',
          title: 'Driver Documents',
          controller: 'documentsAllCtrl'
          // sidebarMeta: {
          //   icon: 'ion-document-text',
          //   order: 10
          // }
        })
  }

})();
