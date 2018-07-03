/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.emailTemplate')
        .controller('emailTemplateCtrl', emailTemplateCtrl);
    function emailTemplateCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
      $rootScope.showloader=true;
      // $scope.currentPage = 1;
      // $scope.itemsPerPage = 10;
      // $scope.maxSize=5;
      // $scope.skip = 0;
      // $scope.pageChanged = function (currentPage) {
      //     $scope.currentPage = currentPage;
      //     console.log('Page changed to: ' + $scope.currentPage);
      //     for(var i=1;i<=$scope.totalItems/10+1;i++) {
      //         if ($scope.currentPage == i) {
      //             $scope.skip = 10*(i-1);
      //             console.log('Offset changed to: ' + $scope.skip);
      //             //$scope.$apply();
      //         }
      //     }
      //     $scope.templates();
      // };
      $scope.templates = function(){
        $.post(MY_CONSTANT.url + '/templates_list', {
            access_token: localStorage.getItem('access_token'),
            // limit:10,
            // offset:$scope.skip
            })
            .success(function (data,status) {
              console.log(data);
              $scope.templatesList=[];
              $scope.templatesBodyList=data.body;
              $scope.templatesBaseEmail=data.base_email;

              // $scope.templatesBaseEmail.forEach(function(c){
              //   $scope.templatesList.push(c);
              // })
              $scope.templatesList.push($scope.templatesBaseEmail[0]);
              $scope.templatesBodyList.forEach(function(c){
                $scope.templatesList.push(c);
              })
              $scope.$apply(function(){
              $rootScope.showloader=false;
              var dtInstance;

              $timeout(function () {
                console.log("Asd");
                  if (!$.fn.dataTable) return;
                  dtInstance = $('#datatableTemplates').dataTable({
                      'paging': true,  // Table pagination
                      'ordering': true,  // Column ordering
                      'info': true,
                      'bDestroy':true,
                      // Text translation options
                      // Note the required keywords between underscores (e.g _MENU_)
                      oLanguage: {
                          sSearch: 'Search all columns:',
                          sLengthMenu: '_MENU_ records per page',
                          info: 'Showing page _PAGE_ of _PAGES_',
                          zeroRecords: 'Nothing found - sorry',
                          infoEmpty: 'No records available',
                          infoFiltered: '(filtered from _MAX_ total records)'
                      }
                  });
                  var inputSearchClass = 'datatable_input_col_search';
                });
              });
            });
      }
      $scope.templates();
      $scope.AddTemplate = function(){
        localStorage.setItem('templateMode','add');
        $state.go('addEditTemplate');
      }
      $scope.edit = function(data){
        localStorage.setItem('templateMode','edit');
        localStorage.setItem('template',JSON.stringify(data));
        $state.go('addEditTemplate');
      }

    }
})();
