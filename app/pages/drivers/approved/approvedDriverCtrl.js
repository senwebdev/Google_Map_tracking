/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.approved')
        .controller('approvedDriverCtrl', approvedDriverCtrl);
    function approvedDriverCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter, $rootScope, $mdSidenav, $log) {

        'use strict';

        var bookmark;
        $rootScope.showloader = true;
        $scope.addDriver = {};
        $scope.addDriver.email = '';
        $scope.delete_driver_id = '';
        $scope.uploaded_vehicle_img = '';
        $scope.driverpass = {};
        $scope.currency_sign = '$';
        localStorage.removeItem('driverID');
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize = 5;
        $scope.skip = 0;
        var dtInstance;
        $scope.isLoading = false;

        $scope.pageChanged = function (currentPage) {
            $scope.currentPage = currentPage;
            console.log('Page changed to: ' + $scope.currentPage);
            for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
                if ($scope.currentPage == i) {
                    $scope.skip = 10 * (i - 1);
                    console.log('Offset changed to: ' + $scope.skip);
                    //$scope.$apply();
                }
            }
            dtInstance.fnDestroy();
            $scope.initTable();
        };

        $scope.toggleRight = function (right, resId, is_driver_blocked, pic, name, phone, email, trips, login, rating, car_name, total_earned, driver) {

            $scope.resId = resId;
            $scope.pic = pic;
            $scope.name = name;
            $scope.phone = phone;
            $scope.email = email;
            $scope.trips = trips;
            $scope.login = login;
            $scope.rating = rating;
            $scope.car_name = car_name;
            $scope.total_earned = total_earned;
            $scope.driver_data = driver;

            $scope.driver_block_unblock_id = resId;
            $scope.is_driver_blocked = is_driver_blocked;

            $mdSidenav(right, resId)
                .toggle()
                .then(function () {
                    // console.log(resId);
                    $log.debug("toggle " + resId + " is done");
                    // console.log('Yes');

                });
        }

        $scope.viewDetails = function (data) {
            localStorage.setItem('driverData', JSON.stringify(data));
            $state.go('drivers.driverDetails');
        }
        //
        //
        //         $scope.exportData = function () {
        //             alasql('SELECT * INTO CSV("drivers.csv",{headers:true}) FROM ?', [ $scope.excelList]);
        //         };
        //
        //
        //
        //         /*--------------------------------------------------------------------------
        //          * -------------------funtion to open dialog for add driver ----------------
        //          --------------------------------------------------------------------------*/
        //         $scope.AddDriverDialog = function () {
        //             $scope.addDriver.email = '';
        //             ngDialog.open({
        //                 template: 'modalDialogId',
        //                 className: 'ngdialog-theme-default',
        //                 showClose: false,
        //                 scope: $scope
        //             });
        //         };
        //
        //         /*--------------------------------------------------------------------------
        //          * -------------------------funtion to add driver --------------------------
        //          --------------------------------------------------------------------------*/
        //         $scope.submit = function (addDriver) {
        //             $scope.data1=addDriver.email;
        //             console.log('lenght',$scope.data1.length);
        //             if($scope.data1[0]=='1' || $scope.data1[0]=='2' || $scope.data1[0]=='3'|| $scope.data1[0]=='0'|| $scope.data1[0]=='4' ||$scope.data1[0]=='5' || $scope.data1[0]=='6' || $scope.data1[0]=='7'|| $scope.data1[0]=='8' || $scope.data1[0]=='9')
        //             {
        //                 $scope.addDriver.errorMsg = 'Email Id is invalid';
        //                 //$scope.$apply();
        //                 setTimeout(function () {
        //                     $scope.addDriver.errorMsg = "";
        //                     //$scope.$apply();
        //                 }, 3000);
        //                 return;
        //             }
        //
        //             $http.post(MY_CONSTANT.url + '/add_driver', {
        //                 access_token: localStorage.getItem('access_token'),
        //                 email: addDriver.email
        //             }).success(function (data) {
        //                 //data = JSON.parse(data);
        //
        //                 if (data.status == 200) {
        //                     $scope.addDriver.successMsg = "Mail sent to driver-id successfully.";
        //                     //$scope.$apply();
        //                     setTimeout(function () {
        //                         $scope.addDriver.successMsg = "";
        //                         //$scope.$apply();
        //                         ngDialog.close({
        //                             template: 'modalDialogId',
        //                             className: 'ngdialog-theme-default',
        //                             showClose: false,
        //                             scope: $scope
        //                         });
        //                     }, 3000);
        //                 }
        //                 else if (data.status == 401){
        //                     $state.go('page.login');
        //                 }
        //                 else {
        //                     $scope.addDriver.errorMsg = data.message.toString();
        //                     //$scope.$apply();
        //                     setTimeout(function () {
        //                         $scope.addDriver.errorMsg = "";
        //                         //$scope.$apply();
        //                         ngDialog.close({
        //                             template: 'modalDialogId',
        //                             className: 'ngdialog-theme-default',
        //                             showClose: false,
        //                             scope: $scope
        //                         });
        //                     }, 3000);
        //                 }
        //             })
        //         };
        //
        //         //var driver_details = function () {
        //         $http.post(MY_CONSTANT.url + '/get_all_driver', {
        //             access_token: localStorage.getItem('access_token')
        //         }).success(function (data) {
        //
        //             $scope.showloader=false;
        //             var array=[];
        //             var dataArray = [];
        //             var excelArray=[];
        //             var alertList=[];
        //             //data = JSON.parse(data);
        //             for(var x=data.data.driver_list.length-1;x>=0;x--)
        //             {
        //                 array.push(data.data.driver_list[x]);
        //             }
        //
        //             if (data.status == 200) {
        //                 var driverList = array;
        //                 driverList.forEach(function (column) {
        //                     //==========================================================================================================================
        // //============================================================ data for excel =============================================
        // //==========================================================================================================================
        //                     var e={}
        //                     e.Driver_ID = column.driver_id;
        //                     e.Driver_Name = column.user_name;
        //                     e.Driver_Email = column.user_email;
        //                     e.Driver_Contact = column.phone_no;
        //                     e.Verification_Token = column.verification_token;
        //                     e.Total_Trips = column.total_rides_as_driver;
        //                     e.Driver_Commission = column.driver_commission;
        //                     e.Total_Earning_Commission = column.total_earning_commision;
        //                     e.Cash_Earnings = column.driver_cash_earnings;
        //                     e.Card_Earnings = column.driver_card_earning;
        //                     e.Total_Earnings = column.total_earnings;
        //                     var rating = 0;
        //                     if (column.total_rating_got_driver)
        //                         rating = column.total_rating_driver / column.total_rating_got_driver;
        //                     e.Average_Rating = rating.toFixed(2);
        //                     //e.average_rating = parseFloat(rating.toFixed(2));
        //                     e.Last_Login = moment(column.last_login).format("DD-MM-YYYY HH:mm:ss");
        //                     if(e.Last_Login == 'Invalid date'){
        //                         e.Last_Login = 'N/A';
        //                     }
        //                     e.Last_Logout = moment(column.last_logout).format("DD-MM-YYYY HH:mm:ss");
        //                     if (e.Last_Logout == 'Invalid date') {
        //                         e.Last_Logout = 'N/A';
        //                     }
        //                     e.Current_User_Status = column.current_user_status;
        //                     //e.is_available = column.is_available;
        //
        //
        //                     if(e.is_blocked!= 1) {
        //                         if (e.Current_User_Status == 1) {
        //                             if(column.is_available == 0){
        //                                 e.Status = 'offline';
        //                                 e.Current_User_Status = 'offline'
        //                             }
        //                             else{
        //                                 e.Current_User_Status = 'online'
        //
        //                                 e.Status = (column.status == 0) ? 'Free' : 'Busy';
        //                             }
        //
        //                         }
        //                         else {
        //
        //
        //                             e.Status = 'offline';
        //                             e.Current_User_Status = 'offline'
        //
        //                         }
        //                     }
        //                     else{
        //                         e.Status = 'blocked';
        //                         e.Current_User_Status = 'offline'
        //                     }
        //
        //                     e.Block_Status = (column.is_blocked ==0)?'Unblocked':'Blocked';
        //                     //e.driver_car_no = column.driver_car_no;
        //                     //e.driver_license_number = column.driver_license_number;
        //
        //
        //                     excelArray.push(e);
        //
        //
        // //==========================================================================================================================
        // //============================================================  end data for excel ========================================
        // //==========================================================================================================================
        //                     var d = {};
        //
        //                     d.user_id = column.driver_id;
        //                     d.user_name = column.user_name;
        //                     d.user_email = column.user_email;
        //                     d.phone_no = column.phone_no;
        //                     d.driver_car_image=column.driver_car_image;
        //                     d.total_trips = column.total_rides_as_driver;
        //                     d.driver_commission = column.driver_commission;
        //                     d.total_earning_commission = column.total_earning_commision;
        //                     d.driver_cash_earnings = column.driver_cash_earnings;
        //                     d.driver_card_earning = column.driver_card_earning;
        //                     d.total_earnings = column.total_earnings;
        //                     d.current_user_status = column.current_user_status;
        //                     d.verification_token = column.verification_token;
        //                     var rating = 0;
        //                     if(column.total_rating_got_driver)
        //                         rating = column.total_rating_driver/column.total_rating_got_driver;
        //                     d.average_rating =rating.toFixed(2);
        //
        //
        //                     // d.average_rating = parseFloat(rating.toFixed(2));
        //
        //                     d.is_blocked = column.is_blocked;
        //                     d.is_deleted = column.is_deleted;
        //                     d.is_available = column.is_available;
        //
        //                     d.last_login = moment(column.last_login).format("MM-DD-YYYY HH:mm:ss") ;
        //                     if(d.last_login == 'Invalid date'){
        //                         d.last_login = 'N/A';
        //                     }
        //                     d.last_logout = moment(column.last_logout).format("MM-DD-YYYY HH:mm:ss");
        //                     if(d.last_logout == 'Invalid date'){
        //                         d.last_logout = 'N/A';
        //                     }
        //
        //                     if(d.is_blocked!= 1) {
        //                         if (d.current_user_status == 1) {
        //                             if (d.is_available == 0) {
        //                                 d.status = 'offline';
        //
        //                             }
        //                             else {
        //                                 d.boolean_status = column.status
        //
        //                                 d.status = (column.status == 0) ? 'Free' : 'Busy';
        //                             }
        //
        //                         }
        //                         else {
        //                             d.status = 'offline';
        //                         }
        //                     }
        //                     else{
        //                         d.boolean_status  = 1;
        //                         d.status = "blocked";
        //                         d.is_available = 0;
        //                     }
        //
        //
        //
        //
        //                     d.driver_car_no = column.driver_car_no;
        //                     d.driver_license_number = column.driver_license_number;
        //                     d.driver_social_security_number = column.driver_social_security_number;
        //                     d.car_type = column.car_type;
        //                     d.driver_paypal_id = column.driver_paypal_id;
        //                     d.editdriver_url = "/drivers/edit-driver/" +  column.driver_id;
        //                     var aL={};
        //                     aL.user_id= d.user_id;
        //                     aL.user_name= d.user_name;
        //                     alertList.push(aL);
        //                     dataArray.push(d);
        //                 });
        //                 $scope.list = dataArray;
        //                 $scope.excelList = excelArray;
        //                 $scope.alertList = alertList;
        //                 //$scope.$apply(function () {
        //                     $scope.list = dataArray;
        //                     $scope.excelList = excelArray;
        //
        //
        //                     // Define global instance we'll use to destroy later
        //                     var dtInstance;
        //
        //                     $timeout(function () {
        //                         if (!$.fn.dataTable)
        //                             return;
        //                         dtInstance = $('#datatableApproved').dataTable({
        //                             "bDestroy":true,
        //                             'paging': true, // Table pagination
        //                             'ordering': false, // Column ordering
        //                             'info': true, // Bottom left status text
        //                             // Text translation options
        //                             // Note the required keywords between underscores (e.g _MENU_)
        //                             oLanguage: {
        //                                 sSearch: 'Search all columns:',
        //                                 sLengthMenu: '_MENU_ records per page',
        //                                 info: 'Showing page _PAGE_ of _PAGES_',
        //                                 zeroRecords: 'Nothing found - sorry',
        //                                 infoEmpty: 'No records available',
        //                                 infoFiltered: '(filtered from _MAX_ total records)'
        //                             },
        //                             "aoColumnDefs": [
        //                                 { 'bSortable': false, 'aTargets': [ 9,11 ] }
        //                             ]
        //                         });
        //                         var inputSearchClass = 'datatable_input_col_search';
        //                         var columnInputs = $('tfoot .' + inputSearchClass);
        //
        //                         // On input keyup trigger filtering
        //                         columnInputs
        //                             .keyup(function () {
        //                                 dtInstance.fnFilter(this.value, columnInputs.index(this));
        //                             });
        //                     },100);
        //                     // When scope is destroyed we unload all DT instances
        //                     // Also ColVis requires special attention since it attaches
        //                     // elements to body and will not be removed after unload DT
        //                     $scope.$on('$destroy', function () {
        //                         dtInstance.fnDestroy();
        //                         $('[class*=ColVis]').remove();
        //                     });
        //
        //             }
        //             else if (data.status == 401){
        //                 $state.go('page.login');
        //             }
        //         });
        //
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

        /*--------------------------------------------------------------------------
         * --------- funtion to open dialog for block or unblock driver ------------
         --------------------------------------------------------------------------*/
        $scope.blockunblockdriver_popup = function (is_blocked, user_id) {

            $scope.blockunblockmsg = '';
            $scope.blockunblockid = user_id;
            $scope.is_blocked = is_blocked;

            if (is_blocked == 1) {
                $scope.blockunblockmsg = "Are you sure you want to block this driver/?";
            } else {
                $scope.blockunblockmsg = "Are you sure you want to unblock this driver?";
            }

            ngDialog.open({
                template: 'block_unblock_driver_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };

        /*--------------------------------------------------------------------------
         * ------------------ funtion to block or unblock driver -------------------
         --------------------------------------------------------------------------*/
        $scope.do_block_unblock_driver = function (is_blocked, blockunblockid) {

            $scope.isLoading = true;

            $.post(MY_CONSTANT.url + '/block_unblock_driver', {
                access_token: localStorage.getItem('access_token'),
                "driver_id": blockunblockid.toString(),
                "block_flag": is_blocked.toString()
            }).success(function (data) {
                //data = JSON.parse(data);

                $scope.isLoading = false;

                if (data.status == 200) {
                    if (is_blocked == 1) {
                        $scope.displaymsg = "Driver is blocked successfully.";
                    } else {
                        $scope.displaymsg = "Driver is unblocked successfully.";
                    }
                }
                else {
                    $scope.displaymsg = data.message.toString();
                }
                //$scope.$apply();
                ngDialog.close({
                    template: 'block_unblock_driver_modalDialog',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
                $rootScope.openToast('success', $scope.displaymsg, '');
                $state.reload();
                // ngDialog.open({
                //     template: 'display_msg_modalDialog',
                //     className: 'ngdialog-theme-default',
                //     showClose: false,
                //     scope: $scope
                // });
            });

        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to open modal for delete driver ----------------
         --------------------------------------------------------------------------*/
        // $scope.deletedriver = function (delete_driver_id) {
        //     console.log(delete_driver_id);
        //     $scope.delete_driver_id = delete_driver_id;
        //     ngDialog.open({
        //         template: 'delete_driver_modalDialog',
        //         className: 'ngdialog-theme-default',
        //         showClose: false,
        //         scope: $scope
        //     });
        // };

        /*--------------------------------------------------------------------------
         * -------------------------funtion to delete driver --------------------------
         --------------------------------------------------------------------------*/
        // $scope.delete_driver = function(delete_driver_id) {
        //    console.log("haan")
        //     ngDialog.close({
        //         template: 'delete_driver_modalDialog',
        //         className: 'ngdialog-theme-default',
        //         scope: $scope
        //     });

        //     $http.post(MY_CONSTANT.url + '/delete_user', {
        //         access_token: localStorage.getItem('access_token'),
        //         user_id: delete_driver_id.toString()
        //     })
        //     .success(function (data) {
        //         //data = JSON.parse(data);
        //         $state.reload();
        //         if (data.status == 200) {
        //             $scope.displaymsg = "Driver deleted successfully";
        //         }
        //         else if (data.status == 401){
        //             $state.go('page.login');
        //         }
        //         else {
        //             $scope.displaymsg = data.message.toString();
        //         }
        //         $scope.list = $scope.list.filter(function (el) {
        //             return el.user_id !== delete_driver_id;
        //         });
        //         //$scope.$apply();
        //         ngDialog.open({
        //             template: 'display_msg_modalDialog',
        //             className: 'ngdialog-theme-default',
        //             showClose: false,
        //             scope: $scope
        //         });
        //     });


        // };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to open dialog for edit driver --------------
         --------------------------------------------------------------------------*/
        $scope.editdriver = function (driverId, driver_car_no, driver_license_number, driver_social_security_number, car_type, phone_no, driver_paypal_id, driver_car_image, vehicle_emissions, co2_produced) {

            var res = phone_no.substring(0, 1);
            if (res == '+')
                phone_no = phone_no.substring(1);
            if (driver_car_image == '') {
                $scope.uploaded_vehicle_img = 'app/img/noimg.png';
            }
            else {
                $scope.uploaded_vehicle_img = driver_car_image;
            }

            $scope.value = true;
            $scope.updateDriverData = {};
            $scope.updateDriverData.driver_id = driverId;
            $scope.updateDriverData.driver_car_no = driver_car_no;
            $scope.updateDriverData.driver_license_number = driver_license_number;
            $scope.updateDriverData.driver_social_security_number = driver_social_security_number;
            $scope.updateDriverData.car_type = car_type;
            $scope.updateDriverData.phone_no = phone_no;
            $scope.updateDriverData.driver_paypal_id = 'xyz@paypal.com';
            $scope.updateDriverData.vehicle_emissions = vehicle_emissions;
            $scope.updateDriverData.co2_produced = co2_produced;
            $scope.file = '';
            ngDialog.open({
                template: 'editDriverDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to upload image ------------------------------
         --------------------------------------------------------------------------*/
        $scope.file_to_upload = function (files) {

            $scope.vehicle_image = files[0];

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
         * ---------------- funtion to update driver -------------------------------
         --------------------------------------------------------------------------*/
        $scope.updateDriver = function (updateDriverData) {

            $scope.isLoading = true;

            $scope.updateDriverData.contact_no = "+" + updateDriverData.phone_no;

            var formData = new FormData();
            formData.append('access_token', localStorage.getItem('access_token'));
            formData.append('driver_id', $scope.updateDriverData.driver_id);
            formData.append('driver_vehicle_number', $scope.updateDriverData.driver_car_no);
            formData.append('driver_license_number', $scope.updateDriverData.driver_license_number);
            formData.append('social_security_number', $scope.updateDriverData.driver_social_security_number);
            formData.append('driver_car_type', $scope.updateDriverData.car_type);
            formData.append('phone_no', $scope.updateDriverData.contact_no);
            formData.append('driver_paypal_id', 'xyz@paypal.com');
            formData.append('driver_vehicle_image', $scope.vehicle_image);
            formData.append('vehicle_emissions', updateDriverData.vehicle_emissions);
            formData.append('co2_produced_per_km', updateDriverData.co2_produced);

            $.ajax({
                type: 'POST',
                url: MY_CONSTANT.url + '/approve_driver',
                dataType: "json",
                data: formData,
                async: false,
                processData: false,
                contentType: false,

                success: function (data) {

                    $scope.isLoading = false;

                    if (data.status == 200) {
                        $scope.displaymsg = "Driver Updated Successfully";
                    }
                    else if (data.status == 401) {
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }
                    ////$scope.$apply();
                    ngDialog.close({
                        template: 'editDriverDialog',
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


        //==============================================================================================================================
        //==========================================================password dialog-====================================================
        //==============================================================================================================================
        $scope.openPasswordDialog = function (id) {

            $scope.driver_pass_id = id
            ngDialog.open({
                template: 'password_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };
        //==============================================================================================================================
        //==========================================================password dialog-====================================================
        //==============================================================================================================================
        $scope.driver = {};
        $scope.changeDriverPass = function (driver) {

            if (driver.password != driver.confirmpassword) {
                $scope.driverpass.errorMsg = "Passwords don't match";
                $scope.driver.password = '';
                $scope.driver.confirmpassword = '';
                setTimeout(function () {
                    $scope.driverpass.errorMsg = "";
                }, 1500);
                return false;
            }

            $http.post(MY_CONSTANT.url + '/update_users_password', {
                access_token: localStorage.getItem('access_token'),
                user_id: $scope.driver_pass_id.toString(),
                password: driver.password
            })
                .success(function (data) {
                    //data = JSON.parse(data);
                    if (data.status == 200) {
                        $scope.driverpass.successMsg = data.message;
                        //$scope.$apply();
                        setTimeout(function () {
                            $scope.driverpass.successMsg = "";
                            //$scope.$apply();
                            ngDialog.close({
                                template: 'password_dialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }, 3000);
                    }
                    else if (data.status == 401) {
                        $state.go('page.login');
                    }
                    else {
                        $scope.driverpass.errorMsg = data.message;
                        //$scope.$apply();
                        setTimeout(function () {
                            $scope.driverpass.errorMsg = "";
                            //$scope.$apply();
                            ngDialog.close({
                                template: 'password_dialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }, 3000);
                    }
                });

        };



        /*--------------------------------------------------------------------------
         * -------------------------funtion to MD-Data Table --------------------------
         --------------------------------------------------------------------------*/

        'use strict';

        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

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
            order: '-driver_id',
            limit: 10,
            page: 1
        };

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';
            console.log("removed filter");
        };

        $scope.getApprovedDriversList = function () {
            $scope.isLoading = true;
            $scope.skip = ($scope.query.page - 1) * $scope.query.limit;

            $http({
                method: "POST",
                url: MY_CONSTANT.url + '/admin/drivers_by_type',
                header: {
                    'Content-Type': 'application/json;'
                },
                data: {
                    access_token: localStorage.getItem('access_token'),
                    limit: $scope.query.limit,
                    offset: $scope.skip,
                    searchFlag: $scope.query.filter ? 1 : 0,
                    searchString: $scope.query.filter,
                    requestType: 3,
                    sort_by: 'date_registered',
                    sort_order: 'DESC'
                }
            })
                // $.post(MY_CONSTANT.url + '/admin/drivers_by_type', {
                //     access_token: localStorage.getItem('access_token'),
                //     limit: $scope.query.limit,
                //     offset:$scope.skip,
                //     searchFlag: $scope.query.filter? 1 : 0,
                //     searchString:$scope.query.filter,
                //     requestType: 3,
                //     sort_by: 'date_registered',
                //     sort_order: 'DESC'
                // })
                .success(function (data, status) {
                    $scope.isLoading = false;
                    var arr = [];
                    var d = data;
                    console.log(d);
                    $scope.driverTotal = d.total_drivers;
                    $scope.totalItems = d.total_drivers;
                    $scope.list = d.drivers;


                    $scope.drivers = {
                        "count": data.total_drivers,
                        "data": data.drivers
                    }

                    $scope.totalList = d.drivers;
                    console.log($scope.totalList);

                    for (var i = 0; i < $scope.list.length; i++) {
                        if ($scope.list[i].total_rating_driver && $scope.list[i].total_rating_got)
                            $scope.list[i].average_rating = parseFloat(($scope.list[i].total_rating_driver / $scope.list[i].total_rating_got).toFixed(2));
                        else $scope.list[i].average_rating = 0;
                        //console.log($scope.list[i])
                    }

                    $scope.approvedDrivers = $scope.list;
                    console.log($scope.approvedDrivers);
                    $rootScope.showloader = false;




                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatableApproved').dataTable({
                            'paging': false,
                            'searching': false,
                            'ordering': true,  // Column ordering
                            'info': true,  // Bottom left status text
                            'scrollX': '1650px',
                            'scrollY': '500px',
                            'destroy': true,
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
                    }, 1000);

                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    });
                    // When scope is destroyed we unload all DT instances
                    // Also ColVis requires special attention since it attaches
                    // elements to body and will not be removed after unload DT


                })
                .error(function (data, status) {

                });

        }
        $scope.getApprovedDriversList();
        $scope.$watch('query.filter', function (newValue, oldValue) {

            if (!oldValue) {
                bookmark = $scope.query.page;
            }

            if (newValue !== oldValue) {
                $scope.query.page = 1;
            }

            if (!newValue) {
                $scope.query.page = bookmark;
            }

            $scope.getApprovedDriversList();

        });

        //var dtInstance='';
        $scope.approvedDrivers = [];
        $scope.list = [];

        $scope.initTable = function () {
            $scope.skip = ($scope.query.page - 1) * $scope.query.limit;
            $scope.list.length = 0;
            $scope.isLoading = true;


            $.post(MY_CONSTANT.url + '/admin/drivers_by_type', {
                access_token: localStorage.getItem('access_token'),
                limit: $scope.query.page,
                offset: $scope.skip,
                searchFlag: $scope.query.filter ? 1 : 0,
                searchString: $scope.query.filter,
                requestType: 3,
                sort_by: 'date_registered',
                sort_order: 'DESC'
            })
                .success(function (data, status) {
                    $scope.isLoading = false;
                    var arr = [];
                    var d = data;
                    console.log(d);
                    $scope.driverTotal = d.total_drivers;
                    $scope.totalItems = d.total_drivers;
                    $scope.list = d.drivers;

                    $scope.drivers = {
                        "count": data.total_drivers,
                        "data": data.drivers
                    }

                    $scope.totalList = d.drivers;
                    console.log($scope.totalList);
                    for (var i = 0; i < $scope.list.length; i++) {
                        if ($scope.list[i].total_rating_driver && $scope.list[i].total_rating_got)
                            $scope.list[i].average_rating = parseFloat(($scope.list[i].total_rating_driver / $scope.list[i].total_rating_got).toFixed(2));
                        else $scope.list[i].average_rating = 0;
                        //console.log($scope.list[i])
                    }
                    $scope.approvedDrivers = $scope.list;
                    console.log($scope.approvedDrivers);
                    $rootScope.showloader = false;





                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatableApproved').dataTable({
                            'paging': false,
                            'searching': false,
                            'ordering': true,
                            'info': true,
                            'scrollX': '1650px',
                            'scrollY': '500px',
                            'destroy': true,
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
                    }, 1000);



                })
                .error(function (data, status) {

                });
        }
        $scope.initTable();

        $scope.openSearch = function ($item, $model, $label, $event) {
            console.log($item, $model, $label, $event);
            $scope.driverDetails($model.driver_id);
        }

        /*--------------------------------------------------------------------------
         * --------- funtion to view driver's rides ---------------------------------------
         --------------------------------------------------------------------------*/
        $scope.driverDetails = function () {
            localStorage.setItem('driverID', $scope.resId);
            $state.go('drivers.approvedDriverDetails');
        };
        $scope.editDriver = function () {
            localStorage.setItem('driverID', $scope.resId);
            localStorage.setItem('driverData', JSON.stringify($scope.driver_data));
            $state.go('drivers.editDriver');
        };
        /*--------------------------------------------------------------------------
          * kkkkkkkkk-------------------------funtion to Delete Driver --------------------------
          --------------------------------------------------------------------------*/
        //      $scope.delete_driver = function() {
        //         localStorage.setItem('driverID',$scope.resId);
        //          console.log("i hate ggggggggggg",$scope.resId)
        //        ngDialog.close({
        //            template: 'delete_driver_modalDialog',
        //            className: 'ngdialog-theme-default',
        //            scope: $scope
        //        });

        //        $http.post(MY_CONSTANT.url + '/delete/driver', {
        //            access_token: localStorage.getItem('access_token'),
        //            driver_id: $scope.resId.toString()
        //        })
        //        .success(function (data) {
        //            //data = JSON.parse(data);
        //            console.log("data");
        //            if (data.status == 200) {
        //                $scope.displaymsg = "Driver deleted successfully";
        //                msg = displaymsg;
        //             $rootScope.openToast('success', msg, '');
        //            }
        //            else if (data.status == 401){
        //                $state.go('page.login');
        //            }
        //            else {
        //                $scope.displaymsg = data.message.toString();
        //            }
        //            $scope.list = $scope.list.filter(function (el) {
        //                return el.user_id !== delete_driver_id;
        //            });
        //            //$scope.$apply();
        //            ngDialog.open({
        //                template: 'display_msg_modalDialog',
        //                className: 'ngdialog-theme-default',
        //                showClose: false,
        //                scope: $scope
        //            });
        //        });


        //    };

        $scope.userDetails = function () {
            console.log($scope.resId);
            localStorage.setItem('userID', $scope.resId);
            $state.go('passengerDetails');
        };

        $scope.editUser = function () {
            localStorage.setItem('userID', $scope.resId);
            localStorage.setItem('userData', JSON.stringify($scope.pass_data));
            $state.go('editUser');
        };


        $scope.deleteDriver = function () {
            localStorage.setItem('driverID', $scope.resId);
            ngDialog.open({
                template: 'delete_driver_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });


        }
        $scope.delete_driver = function () {
            localStorage.setItem('userID', $scope.resId);
            $http.post(MY_CONSTANT.url + '/delete/driver', {
                access_token: localStorage.getItem('access_token'),
                driver_id: $scope.resId,
                driver_mobile: $scope.phone
            })
                .success(function (data) {
                    $state.reload();
                   // $scope.displaymsg = "Driver deleted successfully";
                    if (data.status == 200) {
                        console.log("data",data.status);
                        $scope.displaymsg = "Driver deleted successfully";
                    }
                    else if (data.status == 401) {
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }

                    ngDialog.close({
                        template: 'delete_driver_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });

                });



        }






    }
})();
