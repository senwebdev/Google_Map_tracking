/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings.documents', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('settings.documents', {
          url: '/documents',
          templateUrl: 'app/pages/settings/documents/documents.html',
          title: 'Document Types',
          controller: 'docsCtrl'
          // sidebarMeta: {
          //   icon: 'ion-document-text',
          //   order: 10
          // }
        })
  }

})();
