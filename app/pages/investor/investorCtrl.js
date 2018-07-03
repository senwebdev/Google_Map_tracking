(function () {
    'use strict';
 
    angular.module('BlurAdmin.pages.investor')
        .controller('investorCtrl', investorCtrl);
    function investorCtrl($timeout,$rootScope,$scope,$http,MY_CONSTANT,ngDialog,$state,$filter) {
      $rootScope.showloader=true;
      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;
      $scope.maxSize=5;
      $scope.skip = 0;
      var dtInstance;   
      $rootScope.auth =true;
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
                  order: '-investor_id',
                  limit: 10,
                  page: 1,
                  requestType: 0
              };
      $scope.pageChanged = function (currentPage){
          $scope.currentPage = currentPage;
          console.log('Page changed to: ' + $scope.currentPage);
          for(var i=1;i<=$scope.totalItems/10+1;i++) {
              if ($scope.currentPage == i) {
                  $scope.skip = 10*(i-1);
              }
          }
          dtInstance.fnDestroy();
          $scope.investors();
      };
      $scope.removeFilter = function () {
        $scope.filter.show = false;
        $scope.query.filter = '';
    };
      $scope.investors = function(){
        $scope.isLoading = true;
        $scope.skip= ($scope.query.page-1)*$scope.query.limit;
        $http({
            method: 'POST',
            url: MY_CONSTANT.url + '/admin/investors_list',
            headers: {'Content-Type':'application/json;charset=utf-8'},
            data:{
                    access_token: localStorage.getItem('access_token'),
                    limit:$scope.query.limit,
                    offset:$scope.skip,
            }
            }).success(function (data,status){
                $scope.isLoading = false;
                $scope.investorsList=data.paginated_investors;
                $scope.totalItems=data.total_investors;
                $rootScope.showloader=false;
            })
      };
      $scope.investors();
      $scope.investorData = {};
      $scope.investorData.is_shareholder = 0;
      $scope.addEditInvestorDialog = function (mode,data) {
          $scope.mode=mode;
          if(mode=='add'){
            $scope.investorData={};
            $scope.investorData.is_shareholder = 0;
          }
          else $scope.investorData=data;
          ngDialog.open({
              template: 'modalInvestor',
              className: 'ngdialog-theme-default',
              showClose: false,
              scope: $scope,
              preCloseCallback: function () {
                  $scope.investorData={};
                  return true;
              }
          });
      };
      $scope.closeThisDialog = function (){
          ngDialog.close({
              template: 'modalInvestor',
              className: 'ngdialog-theme-default',
              scope: $scope
          });
      }
      $scope.submitData = function(data){
        if($scope.mode=='add'){
          $http({
            url:MY_CONSTANT.url + '/create_investor',
            data:{
                access_token: localStorage.getItem('access_token'),
                investor_name:data.investor_name,
                investor_email:data.investor_email,
                login_left:data.login_left,
                is_shareholder:data.is_shareholder,
                password:data.password
            }
          }).success(function(data, status) {
            if (data.flag != 1702) {
              ngDialog.close({
                  template: 'modalInvestor',
                  className: 'ngdialog-theme-default',
                  scope: $scope
              });
              $rootScope.openToast('error','Some Error Occured','');
              $state.reload();
            }
            if (data.flag == 1702) {
              ngDialog.close({
                  template: 'modalInvestor',
                  className: 'ngdialog-theme-default',
                  scope: $scope
              });
              $rootScope.openToast('success','Template Added Sucessfully','');
              $state.reload();
            }
          })
        }
        else if($scope.mode=='save'){
          $http({
              url:MY_CONSTANT.url + '/edit_investor',
              data:{
                access_token: localStorage.getItem('access_token'),
                investor_id:data.investor_id,
                investor_name:data.investor_name,
                investor_email:data.investor_email,
                login_left:data.login_left,
                is_shareholder:data.is_shareholder
              }
          }).success(function(data, status) {
            if(typeof data ==='string') var data=JSON.parse(data);
            else var data=data;
            console.log(data.flag);
            $scope.mode='saved';
            $state.go('emailTemplate');
            if (data.flag != 1701) {
              ngDialog.close({
                  template: 'modalInvestor',
                  className: 'ngdialog-theme-default',
                  scope: $scope
              });
              $rootScope.openToast('error','Some Error Occured','');
              $state.reload();
            }
            if (data.flag == 1701) {
              ngDialog.close({
                  template: 'modalInvestor',
                  className: 'ngdialog-theme-default',
                  scope: $scope
              });
              $rootScope.openToast('success','Investor data edited sucessfully','');
              $state.reload();
            }
          })
        }
      }
    }
})();
