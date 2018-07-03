/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.subscribers')
        .controller('subscribersCtrl', subscribersCtrl);
    function subscribersCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $rootScope.showloader=true;
        $scope.subscribers = function(){
          $.post(MY_CONSTANT.url + '/subscribed_emails', {
              access_token: localStorage.getItem('access_token'),
              })
              .success(function (data,status) {
                console.log(data);

                $scope.subscribersList=data.subscribed;
                $scope.totalItems=data.total_subscribed;
                $rootScope.showloader=false;
                console.log($scope.subscribersList);
                $scope.$apply(function(){

                var dtInstance;

                $timeout(function () {
                  console.log("Asd");
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatableSubscribers').dataTable({
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
              })
        }
        $scope.subscribers();

    }
})();
