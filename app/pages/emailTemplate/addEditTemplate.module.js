/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.addEditTemplate', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('addEditTemplate', {
          url: '/addEditTemplate',
          templateUrl: 'app/pages/emailTemplate/addEditTemplate.html',
          title: 'Email Template',
          controller: 'addEditTemplateCtrl'
        })
  }

})();
