/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.helpFaqAboutUs')
        .controller('helpFaqAboutUsCtrl', helpFaqAboutUsCtrl);

    /** @ngInject */
    function helpFaqAboutUsCtrl($timeout,$scope,$http,MY_CONSTANT,ngDialog) {
        $scope.hides_how_about_btn = 1;
        $scope.hide_show_faq_btn = 1;
        $scope.hide_show_terms_btn = 1;
        $scope.hide_show_policy_btn = 1;
        $scope.hide_show_fare_btn = 1;
        $scope.hide_show_legal_btn = 1;
        $scope.edit={};
        $scope.edit.about_us_data = '';
        $scope.edit.help_data = '';
        $scope.edit.terms_data = '';
        $scope.edit.policy_data = '';
        $scope.edit.fare_data = '';
        $scope.edit.legal = '';
        $scope.getData = function(id){
            console.log(id);
            if(id==5){
              $http.post(MY_CONSTANT.url + '/read_legal', {access_token: localStorage.getItem('access_token')})
                  .success(function (data,status) {
                      console.log(status);
                      if(status == 200){
                        console.log(data);
                        $scope.edit.legal = data.legal_content;
                      }
                    });

            }
            else{
            $http.post(MY_CONSTANT.url + '/read_info', {access_token: localStorage.getItem('access_token'),id:id})
                .success(function (response,status) {
                    if(response.status == 200) {
                        switch(id){
                            case 1:
                                $scope.edit.about_us_data = response.data.data;
                                break;
                            case 2 :
                                $scope.edit.help_data = response.data.data;
                                break;
                            case 3 :
                                $scope.edit.policy_data = response.data.data;
                                break;
                            case 4 :
                                $scope.edit.terms_data = response.data.data;
                                break;
                            case 5:
                                $scope.edit.fare_data = response.data.data;
                                break;
                        }
                        $scope.link = response.data.link;

                    }
                    //else{
                    //    $state.go('page.login');
                    //}

                });
              }
        };
        $scope.getData(1);
        $scope.editAboutUs = function () {
            $scope.hides_how_about_btn = 0;
        };
        $scope.editHelp = function () {
            $scope.hide_show_faq_btn = 0;
        };
        $scope.editTerms = function () {
            $scope.hide_show_terms_btn = 0;
        };
        $scope.editPolicy = function () {
            $scope.hide_show_policy_btn = 0;
        };
        $scope.editFare = function () {
            $scope.hide_show_fare_btn = 0;
        };
        $scope.editLegal = function () {
            $scope.hide_show_legal_btn = 0;
        };
        $scope.submitUpdatedData = function(id){

            console.log($scope.edit.about_us_data);
            console.log($scope.edit.help_data);
            console.log($scope.edit.policy_data);
            console.log($scope.edit.terms_data);
            console.log($scope.edit.fare_data);
            switch(id){
                case 1:
                    $scope.updated_data = $scope.edit.about_us_data;
                    break;
                case 2 :
                    $scope.updated_data = $scope.edit.help_data;
                    break;
                case 3 :
                    $scope.updated_data = $scope.edit.policy_data;
                    break;
                case 4 :
                    $scope.updated_data = $scope.edit.terms_data;
                    break;
                case 5:
                    $scope.updated_data = $scope.edit.fare_data;
                    break;
            }
            $http.post(MY_CONSTANT.url + '/set_info', {
                    access_token: localStorage.getItem('access_token'),
                    data:$scope.updated_data,
                    id:id,
                    link:$scope.link
                })
                .success(function (response,status) {
                    if (response.status == 200) {
                        switch(id){
                            case 1:
                                $scope.edit.about_us_data = response.data.data;
                                $scope.hides_how_about_btn = 1;
                                break;
                            case 2 :
                                $scope.edit.help_data = response.data.data;
                                $scope.hide_show_faq_btn = 1;
                                break;
                            case 3 :
                                $scope.edit.policy_data = response.data.data;
                                $scope.hide_show_policy_btn = 1;
                                break;
                            case 4 :
                                $scope.edit.terms_data = response.data.data;
                                $scope.hide_show_terms_btn = 1;
                                break;
                            case 5:
                                $scope.edit.fare_data = response.data.data;
                                $scope.hide_show_fare_btn = 1;
                                break;
                        }
                        $scope.displaymsg = "Document updated successfully";
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });

                    }
                    else if (response['status'] == 400) {
                        $scope.displaymsg = response['message'];
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    } else if (response['status'] == 401) {
                        $scope.displaymsg = "Something went wrong, please try again later.";
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }
                });


        };
        $scope.submitUpdatedLegal = function(){
          $http.post(MY_CONSTANT.url + '/write_legal', {
                  access_token: localStorage.getItem('access_token'),
                  legal_content: $scope.edit.legal
              })
              .success(function (response,status) {
                  if (status == 200) {
                    $scope.displaymsg = "Document updated successfully";
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                  }
                });
        }

        $scope.updateDocument = function () {

            $scope.hides_how_about_btn = 1;
            $scope.hide_show_faq_btn = 1;
            $scope.hide_show_terms_btn = 1;
            $scope.hide_show_policy_btn = 1;
            $scope.hide_show_fare_btn = 1;
            $scope.hide_show_legal_btn = 1;

            ngDialog.close({
                template: 'display_msg_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        };

    }
})();
