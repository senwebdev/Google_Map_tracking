/* Copyrights-Developed by Taxi Technologies INC. */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.alert')
        .controller('alertsCtrl', alertsCtrl);

    function alertsCtrl($timeout, $rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
        $rootScope.showloader = true;
        // $scope.exportData = function () {
        //     alasql('SELECT * INTO CSV("payment.csv",{headers:true}) FROM ?',[$scope.excelList]);
        // };
        $scope.allCheck = '2';
        $scope.allCheckUserDriver = '2';
        $scope.alert = {};
        $.post(MY_CONSTANT.url + '/driver_list', {
                access_token: localStorage.getItem('access_token')
            }).success(function(data) {
                var alertDriverList = [];
                if (data.flag == 1101) {
                    var driverList = data.drivers;
                    driverList.forEach(function(column) {

                        var aL = {};
                        aL.driver_id = column.driver_id;
                        aL.driver_name = column.driver_name;
                        aL.driver_mobile = column.driver_mobile;
                        alertDriverList.push(aL);
                    });
                    $scope.alert.DriverList = alertDriverList;
                    console.log($scope.alert);
                    $scope.DriverAlert();

                } else if (data.flag == 101) {
                    $state.go('page.login');
                }

            })
            .error(function(data) {

            });


        $scope.allType = function(d) {
            $scope.allCheck = d;
            $scope.string = '';
            if (d != 2) {
                $.post(MY_CONSTANT.url + '/user_list', {
                        access_token: localStorage.getItem('access_token')
                    }).success(function(data) {
                        var alertUserList = [];
                        if (data.flag == 1100) {
                            var userList = data.users;
                            userList.forEach(function(column) {

                                var aL = {};
                                aL.user_id = column.user_id;
                                aL.user_name = column.user_name;
                                aL.user_email = column.user_email;
                                alertUserList.push(aL);
                            });
                            $scope.alert.UserList = alertUserList;
                            console.log($scope.alert);
                            $scope.DriverAlert();
                        } else if (data.flag == 101) {
                            $state.go('page.login');
                        }

                    })
                    .error(function(data) {

                    });
            }
        };
        $scope.driverUser = function(d) {
            $scope.allCheckUserDriver = d;
            $scope.string = '';
        };
        $scope.sendPush = function(d) {
            $scope.alert.send_push = d;
        };
        // $scope.alert.user_id='';
        var userArray = new Array();
        var userNumList = new Array();
        var userIDList = new Array();
        $scope.DriverAlert = function() {
            userArray = new Array();
            userNumList = new Array();
            userIDList = new Array();
            // ngDialog.open({
            //     template: 'driver_alert',
            //     className: 'ngdialog-theme-default',
            //     showClose: false,
            //     scope: $scope
            // });
            $rootScope.showloader = false;
            console.log($rootScope.showloader);
            $scope.$apply();
        };


        $scope.string = '';
        $scope.driverList = function(name, pos, id) {
            $scope.string = '';
            if ($.inArray(pos, userNumList) != -1) {

                userNumList.splice($.inArray(pos, userNumList), 1);
                userIDList.splice($.inArray(id, userIDList), 1);
                userArray.splice($.inArray(name, userArray), 1);
                for (var i = 0; i < userArray.length; i++) {
                    if (i == 0)
                        $scope.string = userArray[i];
                    else
                        $scope.string = $scope.string + "," + userArray[i];
                }
                /*
                 $scope.qualification=qual;*/
            } else {
                userNumList.push(pos);
                userArray.push(name);
                userIDList.push(id);
                for (var i = 0; i < userArray.length; i++) {
                    if (i == 0)
                        $scope.string = userArray[i];
                    else
                        $scope.string = $scope.string + "," + userArray[i];
                }
                console.log($scope.string);
            }

            $scope.alert.user_id = '';
            console.log(userArray);
            for (var i = 0; i < userIDList.length; i++) {
                if (i == 0)
                    $scope.alert.user_id = userIDList[i];
                else
                    $scope.alert.user_id = $scope.alert.user_id + "," + userIDList[i];
            }
            console.log($scope.alert.user_id);
            //$scope.userID=userIDList;
            //
            //console.log(userArray);
            //console.log(userIDList);
            //console.log($scope.userID);
        };
        $scope.userList = function(name, pos, id) {
            $scope.string = '';
            if ($.inArray(pos, userNumList) != -1) {

                userNumList.splice($.inArray(pos, userNumList), 1);
                userIDList.splice($.inArray(id, userIDList), 1);
                userArray.splice($.inArray(name, userArray), 1);
                for (var i = 0; i < userArray.length; i++) {
                    if (i == 0)
                        $scope.string = userArray[i];
                    else
                        $scope.string = $scope.string + "," + userArray[i];
                }
                /*
                 $scope.qualification=qual;*/
            } else {
                userNumList.push(pos);
                userArray.push(name);
                userIDList.push(id);
                for (var i = 0; i < userArray.length; i++) {
                    if (i == 0)
                        $scope.string = userArray[i];
                    else
                        $scope.string = $scope.string + "," + userArray[i];
                }
                console.log($scope.string);
            }
            $scope.alert.user_id = '';
            console.log(userArray);
            for (var i = 0; i < userIDList.length; i++) {
                if (i == 0)
                    $scope.alert.user_id = userIDList[i];
                else
                    $scope.alert.user_id = $scope.alert.user_id + "," + userIDList[i];
            }
            console.log($scope.alert.user_id);
        };
        $scope.alert.alert_flag = 2;
        $scope.alert.send_push = '0';
        $scope.alert.push_flag = 3000;
        $scope.sendAlert = function() {
            if ($scope.allCheck == '0' && $scope.string == '') {
                // alert("Choose atleast one user/driver to send the alert to");
                $rootScope.openToast('error', 'Choose atleast one user/driver to send the alert to', '');
                return false;
            }
            var alert1 = {
                alert_message: $scope.alert.alert_message,
                subject: $scope.alert.subject,
                alert_flag: $scope.alert.alert_flag,
                send_push: parseInt($scope.alert.send_push),
                access_token: localStorage.getItem('access_token')
                    // all :  parseInt($scope.allCheck)
            };
            if (parseInt($scope.alert.send_push)) {
                alert1.push_flag = $scope.alert.push_flag;
                alert1.push_message = $scope.alert.push_message;
            }
            if (parseInt($scope.allCheck) != 0) {
                if (parseInt($scope.allCheck) == 1)
                    alert1.all_user = 1;
                else alert1.all_driver = 1;
            } else {
                if (parseInt($scope.allCheckUserDriver) == 1)
                    alert1.user_id = $scope.alert.user_id;
                else alert1.driver_id = $scope.alert.driver_id;
            }
            $.post(MY_CONSTANT.url + '/send_alert', alert1)
                .success(function(data, status) {
                    console.log(data, status);
                    if (data.flag == 1405) {
                        $rootScope.openToast('success', 'Alert Sent Successfully', '');
                        $scope.alert.subject = '';
                        $scope.alert.send_push = '0';
                        $scope.alert.push_message = '';
                        $scope.alert.alert_message = '';
                    }
                    else{
                      $rootScope.openToast('error', 'Some Error Occured', '');
                    }
                    // ngDialog.close({
                    //     template: 'driver_alert',
                    //     className: 'ngdialog-theme-default',
                    //     scope: $scope
                    // });
                    // $state.reload();
                })
                .error(function(data, status) {
                    console.log(data, status);
                })
        };



        $scope.refreshPage = function() {
            $state.reload();
            // ngDialog.close({
            //     template: 'display_msg_modalDialog',
            //     className: 'ngdialog-theme-default',
            //     scope: $scope
            // });

        };
    }
})();
