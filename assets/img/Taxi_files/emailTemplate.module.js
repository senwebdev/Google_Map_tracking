/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.emailTemplate', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('emailTemplate', {
          url: '/emailTemplate',
          templateUrl: 'app/pages/emailTemplate/emailTemplate.html',
          title: 'Email Template',
          controller: 'emailTemplateCtrl'
          // sidebarMeta: {
          //   icon: 'ion-email-unread',
          //   order: 9
          // }
        })
  }

})();
