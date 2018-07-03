/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.emailTemplate0', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('emailTemplate0', {
          url: '/emailTemplate0',
          templateUrl: 'app/pages/emailTemplate0/emailTemplate.html',
          title: 'Email Template Old',
          controller: 'emailTemplateCtrl0',
          sidebarMeta: {
            icon: 'ion-email-unread',
            order: 9
          }
        })
  }

})();
