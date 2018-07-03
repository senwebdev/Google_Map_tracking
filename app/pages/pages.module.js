/**
 * @author TA23
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular
    .module("BlurAdmin.pages", [
      "ui.router",
      "BlurAdmin.pages.livetracking",
      "BlurAdmin.pages.dashboard",
      "BlurAdmin.pages.passenger",
      "BlurAdmin.pages.heat",
      "BlurAdmin.pages.drivers",
      "BlurAdmin.pages.passengerDetails",
      "BlurAdmin.pages.editUser",
      "BlurAdmin.pages.settings",
      "BlurAdmin.pages.analytics",
      "BlurAdmin.pages.geoFencing",
      "BlurAdmin.pages.rides",
      "BlurAdmin.pages.tracking",
      "BlurAdmin.pages.track",
      "BlurAdmin.pages.subscribers",
      "BlurAdmin.pages.emailTemplate",
      "BlurAdmin.pages.addEditTemplate",
      "BlurAdmin.pages.alert",
      "BlurAdmin.pages.setting",
      "BlurAdmin.pages.fares", // r
      "BlurAdmin.pages.reports", // r
      "BlurAdmin.pages.reportdetails", // r
      "BlurAdmin.pages.reportdetails.userreport", // r
      "BlurAdmin.pages.reportdetails.pastridesreport", // r
      "BlurAdmin.pages.reportdetails.paymentreport", // r
      "BlurAdmin.pages.reportdetails.paymentpayoutreport", // r

      "BlurAdmin.pages.investor",
      "BlurAdmin.pages.log",
      "BlurAdmin.pages.promo",
      "ngDialog"
    ])
    .config(routeConfig);
      angular.module('BlurAdmin.pages')
      .directive('selectpicker', selectpicker);
      function selectpicker() {
        return {
          restrict: 'A',
          require: '?ngOptions',
          priority: 1500, // make priority bigger than ngOptions and ngRepeat
          link: {
            pre: function(scope, elem, attrs) {
              elem.append('<option data-hidden="true" disabled value="">' + (attrs.title || 'Select something') + '</option>')
            },
            post: function(scope, elem, attrs) {
              function refresh() {
                elem.selectpicker('refresh');
              }
              if (attrs.ngModel) {
                scope.$watch(attrs.ngModel, refresh);
              }

              if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, refresh);
              }

              elem.selectpicker({ dropupAuto: true, hideDisabled: true });
            }
          }
        };
      }
  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    }
})();
