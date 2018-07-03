(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fleetManagement.addVehicle')
        .controller('addVehicleCtrl', addVehicleCtrl);
    function addVehicleCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {


        $scope.approveDriver={};
    $scope.minDate = new Date();
    $scope.driver_image_sent = 0;
    $scope.vehicle_image_sent = 0;
    $scope.vehicle=[];
    $scope.assigned_driver=[];
    $scope.vehicle.typeEntry='';
    $scope.userList='';
    $scope.assignDisable=false;

    $scope.list1=[
        {
            type:0,
            name:"Inspection 1"
        },
        {
            type:1,
            name:"Inspection 2"
        }
    ];

    /*===========================================================================
     *============================getting img file================================
     *===========================================================================*/

    $scope.file_to_upload = function (files,id) {
        console.log("file to upload function");
        if(id == 0){ //insurance doc
            $scope.vehicle.insurance_doc = files[0];
            $scope.insurance_doc_sent = 1;

            $scope.insurance_doc_name = files[0].name;
            var file = files[0];
            //var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("insurance_doc");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if(id == 1){ //TLC doc
            $scope.vehicle.TLCdoc = files[0];
            $scope.TLCdoc_sent = 1;
            $scope.TLCdoc_name = files[0].name;
            var file = files[0];
            //var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("TLCdoc");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if(id == 2){ //inspection doc
            $scope.vehicle.inspectionDoc = files[0];
            $scope.inspectionDoc_sent = 1;
            $scope.inspectionDoc_name = files[0].name;
            var file = files[0];
            //var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("inspectionDoc");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if(id == 3){ //front image
            $scope.vehicle.frontPic = files[0];
            $scope.frontPic_sent = 1;
            $scope.frontPic_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            console.log("error",file.type.match(imageType));
            if (!file.type.match(imageType)) {
                console.log("error");
                alert("Please upload image only.");
                $scope.vehicle.frontPic='';
                $scope.frontPic_sent = 0;
                $scope.frontPic_name = '';
                return;
            }
            var img = document.getElementById("frontPic");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if(id == 4){ //back image
            $scope.vehicle.backPic = files[0];
            $scope.backPic_sent = 1;
            $scope.backPic_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                alert("Please upload image only.");
                $scope.vehicle.backPic='';
                $scope.backPic_sent = 0;
                $scope.backPic_name = '';
                return;
            }
            var img = document.getElementById("backPic");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if(id == 5){ //registration image
            $scope.vehicle.regPic = files[0];
            $scope.regPic_sent = 1;
            $scope.regPic_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                alert("Please upload image only.");
                $scope.vehicle.regPic='';
                $scope.regPic_sent = 0;
                $scope.regPic_name = '';
                return;
            }
            var img = document.getElementById("regPic");
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
    };
    $scope.openModal=function()
    {
        $scope.showloader=true;
        $http.post(MY_CONSTANT.url + '/get_unassigned_drivers', {
            access_token: localStorage.getItem('access_token')

        }, function (data) {
            $scope.showloader = false;
            var dataArray = [];
            data = JSON.parse(data);
            if (data.status == 401) {
                $state.go('page.login');
            }
            else if (data.status == 200) {
                console.log(data);
                $scope.showloader=false;
                var driverList = data.data;
                driverList.forEach(function (column) {
                    var d = {};
                    d.driver_id = column.driver_id;
                    //for(var i=0;i<$scope.userList.length;i++)
                    //{
                    //    if($scope.userList[i] == d.driver_id)
                    //    {
                    //        d.checked=true;
                    //        break;
                    //    }
                    //}
                    d.user_name = column.user_name;
                    d.user_email = column.user_email;
                    d.user_image = column.user_image;
                    d.phone_no = column.phone_no;
                    dataArray.push(d);
                });

                console.log(dataArray);

                $scope.$apply(function () {
                    $scope.list = dataArray;
                    if($scope.list.length==0)
                    {
                        $scope.assignDisable=true;
                    }
                    // Define global instance we'll use to destroy later
                    var dtInstance;

                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable12').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'info': true,  // Bottom left status text
                            "bDestroy": true,
                            "scrollY": "300px",
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
                        var columnInputs = $('tfoot .' + inputSearchClass);

                        // On input keyup trigger filtering
                        columnInputs
                            .keyup(function () {
                                dtInstance.fnFilter(this.value, columnInputs.index(this));
                            });
                    });

                    // When scope is destroyed we unload all DT instances
                    // Also ColVis requires special attention since it attaches
                    // elements to body and will not be removed after unload DT
                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    });
                });
            }
        });

        ngDialog.open({
            template: 'assignDriverPopup',
            className: 'ngdialog-theme-default big-dialog',
            showClose: false,
            scope: $scope
        });
    };
    /*--------------------------------------------------------------------------
     * ---------------- function to approve driver -----------------------------
     --------------------------------------------------------------------------*/
    $scope.add_vehicle_function = function (vehicle) {

        console.log("vehicle details",vehicle);
        if(vehicle.passengers >10)
        {

            $scope.errorMsg="Maximum Passengers can't be more than 10.";
            $scope.TimeOutError();
            return false;
        }
        if(vehicle.insurance_doc==undefined || vehicle.insurance_doc=='' || vehicle.insurance_doc==null)
        {

            $scope.errorMsg="Upload Insurance Document.";
            $scope.TimeOutError();
            return false;
        }
        if(vehicle.TLCdoc==undefined || vehicle.TLCdoc=='' || vehicle.TLCdoc==null)
        {

            $scope.errorMsg="Upload TLC License Document.";
            $scope.TimeOutError();
            return false;
        }
        if(vehicle.inspectionDoc==undefined || vehicle.inspectionDoc=='' || vehicle.inspectionDoc==null)
        {
            $scope.errorMsg="Upload Inspection Entry Document.";
            $scope.TimeOutError();
            return false;
        }
        if(vehicle.frontPic==undefined || vehicle.frontPic=='' || vehicle.frontPic==null)
        {
            $scope.errorMsg="Upload Vehicle Front Photo.";
            $scope.TimeOutError();
            return false;
        }
        if(vehicle.backPic==undefined || vehicle.backPic=='' || vehicle.backPic==null)
        {
            $scope.errorMsg="Upload Vehicle Back Photo.";
            $scope.TimeOutError();
            return false;
        }
        if(vehicle.regPic==undefined || vehicle.regPic=='' || vehicle.regPic==null)
        {
            $scope.errorMsg="Upload Vehicle Registration Photo.";
            $scope.TimeOutError();
            return false;
        }
        $scope.vehicle.checkbox=($scope.vehicle.checkbox==true)?1:0;
        $scope.showloader=true;
        var formData = new FormData();
        formData.append('access_token', localStorage.getItem('access_token'));
        formData.append('vehicle_type', $scope.vehicle.type);
        formData.append('vehicle_name', $scope.vehicle.name);
        formData.append('vehicle_identification_no', $scope.vehicle.vin);
        formData.append('vehicle_make', $scope.vehicle.make);
        formData.append('vehicle_model', $scope.vehicle.model);
        formData.append('vehicle_year', $scope.vehicle.year);
        formData.append('vehicle_color', $scope.vehicle.color);
        formData.append('vehicle_license_plate', $scope.vehicle.license);
        formData.append('max_passengers',$scope.vehicle.passengers);
        formData.append('no_luggages', $scope.vehicle.luggage);

        formData.append('policy_no', $scope.vehicle.policy_number);
        formData.append('insurance_company', $scope.vehicle.ins_company);
        formData.append('policy_owner', $scope.vehicle.policy_owner);
        formData.append('policy_premium', $scope.vehicle.premium);
        formData.append('policy_start_date', $scope.vehicle.policy_start+'T00:00:00.076Z');
        formData.append('policy_expiry_date', $scope.vehicle.policy_end+'T00:00:00.076Z');
        formData.append('insurance_policy_doc', $scope.vehicle.insurance_doc);
        formData.append('tlc_medallion_no', $scope.vehicle.medallion);
        formData.append('tlc_expiry_date', $scope.vehicle.TLCexpiry+'T00:00:00.076Z');
        formData.append('tlc_doc', $scope.vehicle.TLCdoc);

        formData.append('inspection_type', $scope.vehicle.typeEntry);
        formData.append('inspection_no', $scope.vehicle.inspectionNumber);
        formData.append('inspection_date', $scope.vehicle.inspectionDate+'T00:00:00.076Z');
        formData.append('inspection_doc', $scope.vehicle.inspectionDoc);
        formData.append('vehicle_front_photo', $scope.vehicle.frontPic);
        formData.append('vehicle_back_photo', $scope.vehicle.backPic);
        formData.append('reg_photo', $scope.vehicle.regPic);
        formData.append('driver_id', $scope.userList);
        formData.append('is_active', $scope.vehicle.checkbox);

        $timeout(function()
        {
            /*$.ajax({
                type: 'POST',
                url: MY_CONSTANT.url + '/add_fleet_vehicle',
                data: formData,
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data);
                    if (data.status == 200) {
                        $scope.displaymsg = "Vehicle added successfully.";
                        $scope.showloader=false;
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }
                    else if (data.status == 401) {
                        $state.go('page.login');
                    }
                    else if(data.status == 401) {
                        $scope.error = "Vehicle with same number already exists";
                        $scope.showloader=false;
                        ngDialog.open({
                            template: 'errorMsgModal',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }
                    else
                    {
                        $scope.error = "Something went wrong!";
                        $scope.showloader=false;
                        ngDialog.open({
                            template: 'errorMsgModal',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }
                }
            });*/
            $http({
                method:'POST',
                url:MY_CONSTANT.url + '/add_fleet_vehicle',
                data:formData,
                headers:{'Content-Type':undefined},
                transformRequest: angular.identity,
                contentType:false,
                processData: false
            }).
            then(function(data) {
                $scope.showloader=false;
                console.log(data);
                if (data.status == 200) {
                    $scope.displaymsg = "Vehicle added successfully.";
                    $scope.showloader=false;
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
                else if (data.status == 401) {
                    $state.go('page.login');
                }
                else if(data.status == 401) {
                    $scope.error = "Vehicle with same number already exists";
                    $scope.showloader=false;
                    ngDialog.open({
                        template: 'errorMsgModal',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
                else
                {
                    $scope.error = "Something went wrong!";
                    $scope.showloader=false;
                    ngDialog.open({
                        template: 'errorMsgModal',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
            });

        },2000);

    };
//+++++++++++++++++++++++++++++++++++Assign+++++++++++++++++++++++++++++++

    $scope.vehicle.assigned_driver=[];

    $scope.addUser=function(id,name)
    {
        $scope.userList=id;
        $scope.saveName=name;
        //if ($scope.userList.indexOf(id)==-1) {
        //    $scope.userList.push(id);
        //    $scope.vehicle.assigned_driver.push(name);
        //}
        //else
        //{
        //    var index = $scope.userList.indexOf(id);
        //    $scope.userList.splice(index, 1);
        //    $scope.vehicle.assigned_driver.splice(index, 1);
        //}

        //$scope.vehicle.assigned_driver='';
        //
        //for(var i=0;i<$scope.assigned_driver.length;i++)
        //{
        //    $scope.vehicle.assigned_driver=$scope.vehicle.assigned_driver+' '+$scope.assigned_driver[i];
        //}
    };

    $scope.delete = function (i) {
        $scope.vehicle.assigned_driver.splice(i, 1);
        $scope.userList.splice(i, 1);
    };
    /*--------------------------------------------------------------------------
     * --------- funtion to refresh page ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.refreshPage = function () {
        $state.go('app.fleet');
        ngDialog.close({
            template: 'display_msg_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

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

    $scope.close=function()
    {
        //$scope.userList=[];
        //$scope.vehicle.assigned_driver=[];
        ngDialog.close();
    };

    $scope.assignButton=function()
    {
        if($scope.list.length > 0)
        {
            console.log($scope.list.length);
            if($scope.userList=='')
            {
                $scope.errorMsg = "Please select Driver.";
                $timeout(function(){
                    $scope.errorMsg = "";
                },3000);
                return;
            }
        }
        $scope.vehicle.assigned_driver=$scope.saveName;
        ngDialog.close();
    };

    $scope.closeModal=function()
    {
        ngDialog.close();
    }
    }
})();