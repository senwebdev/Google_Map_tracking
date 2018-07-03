/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.documents')
        .controller('docsCtrl', docsCtrl);
    function docsCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $rootScope.showloader=true;
        $scope.docs = function(){
          $.post(MY_CONSTANT.url + '/get_document_types', {
              access_token: localStorage.getItem('access_token'),
              })
              .success(function (data,status) {
                console.log(data);

                $scope.docTypes=data.doc_types;
                $rootScope.showloader=false;
                $scope.$apply();
                var dtInstance;

                $timeout(function () {
                  console.log("Asd");
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatableDocTypes').dataTable({
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
                },1000);

              })
        }
        $scope.docs();
        $scope.addDocDialog = function(){
          $scope.type=0;
            ngDialog.open({
                template: 'document_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };
        $scope.editDocDialog = function(data){
          $scope.type=1;
            $scope.docTypeName.document_type_id=data.document_type_id;
            $scope.docTypeName.document_name=data.document_name;
            ngDialog.open({
                template: 'document_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };


        $scope.docTypeName={};
        $scope.addEditDocType = function(docType,type){
            if(type==0){
              $.post(MY_CONSTANT.url + '/add_document_type',
                  {
                      access_token: localStorage.getItem('access_token'),
                      document_name: $scope.docTypeName.document_name
                  }).success(function (data) {
                      //data = JSON.parse(data);

                      if (data.status == 200||data.flag==1301) {
                          $scope.docTypeName.successMsg = data.message;
                          $scope.$apply();
                          console.log(data)
                          setTimeout(function () {
                              $scope.docTypeName.successMsg = "";
                              //$scope.$apply();
                              ngDialog.close({
                                  template: 'document_dialog',
                                  className: 'ngdialog-theme-default',
                                  showClose: false,
                                  scope: $scope
                              });
                              $scope.docTypeName.document_name='';
                              $state.reload();
                          }, 1000);
                      }
                      else if (data.status == 101){
                          $state.go('page.login');
                      }
                      else {
                          $scope.docTypeName.errorMsg = data.error;
                          //$scope.$apply();
                          setTimeout(function () {
                              $scope.docTypeName.errorMsg = "";
                              //$scope.$apply();
                              ngDialog.close({
                                  template: 'document_dialog',
                                  className: 'ngdialog-theme-default',
                                  showClose: false,
                                  scope: $scope
                              });
                          }, 3000);
                      }
                  });

            }
            else{
              $.post(MY_CONSTANT.url + '/edit_document_type',
                  {
                      access_token: localStorage.getItem('access_token'),
                      document_name: $scope.docTypeName.document_name,
                      document_type_id: $scope.docTypeName.document_type_id,

                  }).success(function (data) {
                      //data = JSON.parse(data);

                      if (data.status == 200||data.flag==1312) {
                          $scope.docTypeName.successMsg = data.message;
                          $scope.$apply();
                          console.log(data)
                          setTimeout(function () {
                              $scope.docTypeName.successMsg = "";
                              //$scope.$apply();
                              ngDialog.close({
                                  template: 'document_dialog',
                                  className: 'ngdialog-theme-default',
                                  showClose: false,
                                  scope: $scope
                              });
                              $scope.docTypeName.document_name='';
                              $state.reload();
                          }, 1000);
                      }
                      else if (data.status == 101){
                          $state.go('page.login');
                      }
                      else {
                          $scope.docTypeName.errorMsg = data.error;
                          $scope.$apply();
                          setTimeout(function () {
                              $scope.docTypeName.errorMsg = "";
                              $scope.$apply();
                          }, 3000);
                      }
                  });
            }

        };
    }
})();
