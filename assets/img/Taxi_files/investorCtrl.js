/**
 * Created by tushar on 18/08/2016.
 */
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
      $scope.pageChanged = function (currentPage) {
          $scope.currentPage = currentPage;
          console.log('Page changed to: ' + $scope.currentPage);
          for(var i=1;i<=$scope.totalItems/10+1;i++) {
              if ($scope.currentPage == i) {
                  $scope.skip = 10*(i-1);
                  console.log('Offset changed to: ' + $scope.skip);
                  //$scope.$apply();
              }
          }
          dtInstance.fnDestroy();
          $scope.investors();
      };
      $scope.investors = function(){
        $.post(MY_CONSTANT.url + '/investors_list', {
            access_token: localStorage.getItem('access_token'),
            limit:10,
            offset:$scope.skip
            })
            .success(function (data,status) {
              console.log(data);

              $scope.investorsList=data.paginated_investors;
              $scope.totalItems=data.total_investors;
              $rootScope.showloader=false;
              console.log($scope.investorsList);
              $scope.$apply(function(){

              // var dtInstance;

              $timeout(function () {
                console.log("Asd");
                  if (!$.fn.dataTable) return;
                  dtInstance = $('#datatableInvestors').dataTable({
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
          $.post(MY_CONSTANT.url + '/create_investor',{
            access_token: localStorage.getItem('access_token'),
            investor_name:data.investor_name,
            investor_email:data.investor_email,
            login_left:data.login_left,
            is_shareholder:data.is_shareholder,
            password:data.password
          })
          .success(function(data, status) {
            console.log(data.flag);
            if (data.flag != 1702) {
              // alert("No Such region");
              ngDialog.close({
                  template: 'modalInvestor',
                  className: 'ngdialog-theme-default',
                  scope: $scope
              });
              $rootScope.openToast('error','Some Error Occured','');
              $state.reload();
            }
            if (data.flag == 1702) {
              // alert('Fare Added Sucessfully');
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
          $.post(MY_CONSTANT.url + '/edit_investor',{
            access_token: localStorage.getItem('access_token'),
            investor_id:data.investor_id,
            investor_name:data.investor_name,
            investor_email:data.investor_email,
            login_left:data.login_left,
            is_shareholder:data.is_shareholder
          })
          .success(function(data, status) {
            if(typeof data ==='string') var data=JSON.parse(data);
            else var data=data;
            console.log(data.flag);
            $scope.mode='saved';
            $state.go('emailTemplate');
            if (data.flag != 1701) {
              // alert("No Such region");
              ngDialog.close({
                  template: 'modalInvestor',
                  className: 'ngdialog-theme-default',
                  scope: $scope
              });
              $rootScope.openToast('error','Some Error Occured','');
              $state.reload();
            }
            if (data.flag == 1701) {
              // alert('Fare Added Sucessfully');
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
