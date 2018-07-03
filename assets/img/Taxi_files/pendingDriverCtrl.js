/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.pending')
        .controller('pendingDriverCtrl', pendingDriverCtrl);
    function pendingDriverCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $scope.delete_driver_id = '';

        $scope.exportData = function () {
            alasql('SELECT * INTO CSV("pendingdrivers.csv",{headers:true}) FROM ?',[$scope.excelList]);
        };
        $.post(MY_CONSTANT.url + '/pending_drivers', {
            access_token: localStorage.getItem('access_token')
            })
            .success(function (data,status) {
                var arr=[];
                var d=data;
                console.log(d);
                $scope.pendingDrivers=d.paginated_drivers;

                var dtInstance;

                $timeout(function () {
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatablePending').dataTable({
                        'paging': true,  // Table pagination
                        'ordering': true,  // Column ordering
                        'info': true,  // Bottom left status text
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

                // When scope is destroyed we unload all DT instances
                // Also ColVis requires special attention since it attaches
                // elements to body and will not be removed after unload DT
                $scope.$on('$destroy', function () {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                });
            })
            .error(function (data,status) {

            });


        /*--------------------------------------------------------------------------
         * ---------------- funtion to open dialog for approve driver --------------
         --------------------------------------------------------------------------*/
        $scope.openApproveDialog = function (driverId,phone_no,driver_paypal_id) {
            $scope.value = true;
            $scope.approveData={};
            $scope.approveData.driver_id=driverId;
            $scope.approveData.paypal_id = driver_paypal_id;
            var res = phone_no.substring(0, 1);
            if (res == '+')
                phone_no=phone_no.substring(1);
            $scope.approveData.phn_no=phone_no;

            ngDialog.open({
                template: 'approveDriverDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to upload image ------------------------------
         --------------------------------------------------------------------------*/
        $scope.file_to_upload = function (files) {
            $scope.vehicle_image=files[0];
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("car_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        }

        /*--------------------------------------------------------------------------
         * ---------------- funtion to approve driver ------------------------------
         --------------------------------------------------------------------------*/
        $scope.submit = function (approveData) {

            if($scope.approveData.select_car == '' || $scope.approveData.select_car == undefined) {
                $scope.errorMsg = "Please select car type";
                setTimeout(function () {
                    $scope.errorMsg  = "";
                    //$scope.$apply();
                }, 3000);
                return false;
            }
            if($scope.vehicle_image == '' || $scope.vehicle_image == undefined) {
                $scope.errorMsg = "Please select vehicle image";
                setTimeout(function () {
                    $scope.errorMsg  = "";
                    //$scope.$apply();
                }, 3000);
                return false;
            }

            $scope.approveData.contact_no="+"+$scope.approveData.phn_no;
            var formData = new FormData();
            formData.append('access_token', localStorage.getItem('access_token'));
            formData.append('driver_id', $scope.approveData.driver_id);
            formData.append('driver_vehicle_number', $scope.approveData.vehicle_num);
            formData.append('driver_license_number', $scope.approveData.license_num);
            formData.append('social_security_number', $scope.approveData.soc_sec_num);
            formData.append('driver_car_type', $scope.approveData.select_car);
            formData.append('phone_no', $scope.approveData.contact_no);
            formData.append('driver_paypal_id', 'xyz@paypal.com');
            formData.append('driver_vehicle_image', $scope.vehicle_image);
            formData.append('vehicle_emissions', approveData.vehicle_emissions);
            formData.append('co2_produced_per_km', approveData.co2_produced);

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

                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }
                    ////$scope.$apply();
                    ngDialog.close({
                        template: 'approveDriverDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });

                }
            });



            return false;

        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to open modal for delete driver ----------------
         --------------------------------------------------------------------------*/
        $scope.delete_pending_driver = function (delete_driver_id) {

            $scope.delete_driver_id = delete_driver_id;

            ngDialog.open({
                template: 'delete_driver_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };

        /*--------------------------------------------------------------------------
         * -------------------------funtion to delete driver --------------------------
         --------------------------------------------------------------------------*/
        $scope.delete_driver = function (delete_driver_id) {

            ngDialog.close({
                template: 'delete_driver_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $http.post(MY_CONSTANT.url + '/delete_user',
                {
                    access_token: localStorage.getItem('access_token'),
                    user_id: delete_driver_id.toString()
                }).success(function (data) {
                    //data = JSON.parse(data);

                    if (data.status == 200) {
                        $scope.displaymsg = "Driver deleted successfully";
                    }
                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message.toString();
                    }
                    //$scope.$apply();
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                });


        };

        /*--------------------------------------------------------------------------
         * --------- funtion to refresh page ---------------------------------------
         --------------------------------------------------------------------------*/
        $scope.refreshPage = function () {
            $state.reload();
            ngDialog.close({
                template: 'display_msg_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };



    }
})();
