/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.documents', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('documents', {
          url: '/documents',
          templateUrl: 'app/pages/documents/documents.html',
          title: 'Document Types',
          controller: 'docsCtrl',
          sidebarMeta: {
            icon: 'ion-document-text',
            order: 10
          }
        })
  }

})();
