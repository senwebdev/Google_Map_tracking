/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.approve')
        .controller('approveDriverCtrl', approveDriverCtrl);
    function approveDriverCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {

        $scope.approveDriver = {};
        $scope.minDate = new Date();
        $scope.driver_image_sent = 0;
        $scope.vehicle_image_sent = 0;
        $scope.driver_id_get='';
        function GetURLParameter(sParam)
        {

            var forgot=window.location.hash;
            var id=forgot.split('approve-driver/');
            $scope.driver_id_get=id[1];
        }
        GetURLParameter('d');
        $.post(MY_CONSTANT.url + '/list_all_cars', {
                access_token: localStorage.getItem('access_token')
            },
            function (data) {
                var dataArray = [];
                data = JSON.parse(data);
                if (data.status== 200) {
                    var carList = data.data.car_list;
                    carList.forEach(function (column) {
                        var d = {};
                        d=column;
                        dataArray.push(d);
                    });
                    $scope.$apply(function () {
                        $scope.list = dataArray;
                    });
                }
            });
        console.log($scope.driver_id_get);
        /*--------------------------------------------------------------------------
         * ---------------- get driver's data by using driver id -------------------
         --------------------------------------------------------------------------*/
        $.post(MY_CONSTANT.url + '/get_driver_details', {
                access_token: localStorage.getItem('access_token'),
                driver_id: $scope.driver_id_get
            },
            function (data) {
                data = JSON.parse(data);

                if (data.status == 200) {

                    var unapprovedlist = data.data.driver_list[0];
                    $scope.approveDriver.driver_name = unapprovedlist.driver_name;
                    $scope.approveDriver.email_id = unapprovedlist.user_email;
                    $scope.driver_image = unapprovedlist.user_image;
                    $scope.approveDriver.license_expiry = unapprovedlist.license_expiry_date;
                    $scope.approveDriver.vehicle_model = unapprovedlist.vehicle_model;
                    $scope.approveDriver.license_number = unapprovedlist.driver_license_number;
                    $scope.approveDriver.car_type = unapprovedlist.car_type;
                    $scope.approveDriver.commission = unapprovedlist.driver_commission;
                    $scope.approveDriver.driver_vehicle_number = unapprovedlist.driver_car_no;
                    var phone_num = unapprovedlist.phone_no
                    var res = phone_num.substring(0, 1);
                    if (res == '+')
                        phone_num = phone_num.substring(1);
                    $scope.approveDriver.phn_no = phone_num;
                    $scope.vehicle_image = unapprovedlist.driver_car_image;

                    //if date have invalid data
                    if ($scope.approveDriver.license_expiry == '0000-00-00' || $scope.approveDriver.license_expiry == 'Invalid date') {
                        $scope.approveDriver.license_expiry = '';
                    }
                    //handle date
                    if ($scope.approveDriver.license_expiry) {
                        $scope.approveDriver.license_expiry = moment($scope.approveDriver.license_expiry).format("YYYY-MM-DD");
                    }

                    //handle image
                    if ($scope.vehicle_image == null || $scope.vehicle_image == '') {
                        $scope.vehicle_image = "assets/img/t/noimg.png"
                    }
                    if ($scope.driver_image == null || $scope.driver_image == '') {
                        $scope.driver_image = "assets/img/taxi/noimg.png"
                    }
                }
                else if (data.status == 401) {
                    $state.go('page.login');
                }

            });

        /*===========================================================================
         *============================getting img file================================
         *===========================================================================*/

        $scope.file_to_upload = function (files, id) {
            if (id == 0) { //vehicle image
                $scope.vehicle_image = files[0];
                $scope.vehicle_image_sent = 1;

                $scope.vehicle_image_name = files[0].name;
                var file = files[0];
                var imageType = /image.*/;
                if (!file.type.match(imageType)) {

                }
                var img = document.getElementById("vehicle_image");
                img.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);

            }
            if (id == 1) { //driver image
                $scope.driver_image = files[0];
                $scope.driver_image_sent = 1;
                $scope.driver_image_name = files[0].name;
                var file = files[0];
                var imageType = /image.*/;
                if (!file.type.match(imageType)) {

                }
                var img = document.getElementById("driver_image");
                img.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);

            }


            $scope.$apply();


        }

        /*--------------------------------------------------------------------------
         * ---------------- function to approve driver -----------------------------
         --------------------------------------------------------------------------*/
        $scope.approveDriverFunction = function () {


            if ($scope.driver_image == 'assets/img/taxi/noimg.png') {
                $scope.errorMsg = "Please upload Driver image.";
                $scope.TimeOutError();
                return false;
            }
            if ($scope.vehicle_image == 'assets/img/taxi/noimg.png') {
                $scope.errorMsg = "Please upload Driver Vehicle Image.";
                $scope.TimeOutError();
                return false;
            }

            var formData = new FormData();
            formData.append('access_token', localStorage.getItem('access_token'));
            formData.append('driver_name', $scope.approveDriver.driver_name);
            formData.append('driver_email', $scope.approveDriver.email_id);
            formData.append('user_image', $scope.driver_image);
            formData.append('license_expiry_date', $scope.approveDriver.license_expiry);
            formData.append('vehicle_model', $scope.approveDriver.vehicle_model);
            formData.append('driver_id', $scope.driver_id_get);
            formData.append('driver_license_number', $scope.approveDriver.license_number);
            formData.append('driver_car_type', $scope.approveDriver.car_type);
            formData.append('phone_no', '+' + $scope.approveDriver.phn_no);
            formData.append('driver_vehicle_image', $scope.vehicle_image);
            formData.append('driver_commission', $scope.approveDriver.commission);
            formData.append('driver_vehicle_number', $scope.approveDriver.driver_vehicle_number);


            $.ajax({
                type: 'POST',
                url: MY_CONSTANT.url + '/admin/approve_driver',
                dataType: "json",
                data: formData,
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.status == 200) {
                        $scope.displaymsg = "Driver approved successfully.";
                    }
                    else if (data.status == 401) {
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }
                    ngDialog.open({
                        template: 'display_msg_modalDialogSuccess',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });

                }
            });


        };


        /*--------------------------------------------------------------------------
         * --------- funtion to refresh page ---------------------------------------
         --------------------------------------------------------------------------*/
        $scope.refreshPage = function (a) {
            if(a==1){
                ngDialog.close({
                    template: 'display_msg_modalDialogSuccess',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
                $state.go('drivers.approved');
            }
            else {
                ngDialog.close({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
                $state.reload();
            }
        };


        /*--------------------------------------------------------------------------
         * ---------------- function to get date -----------------------------------
         --------------------------------------------------------------------------*/
        function dateConversion(dte) {
            var dteSplit1 = dte.split("T");
            var date = dteSplit1[0];
            return date;
        }

        /*--------------------------------------------------------------------------
         * ---------------- Timeout function -----------------------------------
         --------------------------------------------------------------------------*/
        $scope.TimeOutError = function () {
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
        };

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        $scope.popup1 = {
            opened: false
        };

        $scope.delete_driver=function()

        
        {
            console.log("deleteeeeeeeeeeeeee");
            // $http({
            //     url : MY_CONSTANT.url + '/delete_driver',
            //     method : 'POST',
            //     data:
            //     {
            //         access_token: localStorage.getItem('access_token'),
            //         vehicle_id:$scope.vehicle_id,
            //         driver_id:$scope.driver_id
            //     }
            // }).success(function(data){
            //     ngDialog.close();
            //     $scope.displaymsg="Vehicle unassigned successfully.";
            //     ngDialog.open({
            //         template: 'display_msg_modalDialog',
            //         className: 'ngdialog-theme-default',
            //         scope: $scope
            //     });
            //     $scope.$apply();
            // }).error(function(data){
            //     if(data.status == 401){
            //         $state.go('page.login');
            //     }
            //     else
            //     {
            //         $scope.errorMsg1 = data.error;
            //         $timeout(function(){
            //             $scope.errorMsg1 = "";
            //         },3000)
            //     }
            // });
        }







    }
})();
