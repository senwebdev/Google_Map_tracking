/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.subscribers')
        .controller('subscribersCtrl', subscribersCtrl);
    function subscribersCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter){
        $rootScope.showloader=true;
        $scope.selected = [];
        $scope.limitOptions = [10, 25, 35];
                $scope.options = {
                    rowSelection: false,
                    multiSelect: false,
                    autoSelect: true,
                    decapitate: false,
                    largeEditDialog: true,
                    boundaryLinks: true,
                    limitSelect: true,
                    pageSelect: false
                };
                $scope.query = {
                    filter: '',
                    order: 'investor_name',
                    limit: 10,
                    page: 1,
                    requestType: 0
                };
        $scope.subscribers = function(){
            $scope.skip= ($scope.query.page-1)*$scope.query.limit;
                $http({
                    method: 'POST',
                    url: MY_CONSTANT.url + '/admin/subscribed_emails',
                    headers: {'Content-Type':'application/json;charset=utf-8'},
                    data:{
                        access_token: localStorage.getItem('access_token'),
                        limit:$scope.query.limit,
                        offset:$scope.skip, 
                    }
                }).success(function(data,status){
                    $scope.subscribersList=data.subscribed;
                    $scope.totalItems=data.total_subscribed;
                    $rootScope.showloader=false;
                })
            }
        $scope.subscribers();
    }
})();
