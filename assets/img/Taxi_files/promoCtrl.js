/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.promo')
        .controller('promoCtrl', promoCtrl);
    function promoCtrl($mdEditDialog, $q, $timeout,$mdDialog, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter,promoService) {
        $scope.promo_code_id = '';
        $scope.delete_driver_id = '';
        $scope.block_unblock_status = '';
        $scope.promo_code_block_unblock_value = 0;
        $scope.promo_name = '';
        $scope.editReferral = {};
        $scope.showloader = true;
        $scope.exportData = function () {
            alasql('SELECT * INTO CSV("promocode.csv",{headers:true}) FROM ?', [$scope.excelList]);
        };












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
            pageSelect: true
        };

        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };



        $http({
            method: 'POST',
            url: MY_CONSTANT.url + '/get_promocode',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'access_token='+localStorage.getItem('access_token')
        }).success(function (data) {
            console.log("$scope.desserts "+data.promo_codes);
            $scope.desserts = {
                "count": data.promo_codes.length,
                "data":data.promo_codes
            }

            //console.log("$scope.desserts "+$scope.desserts);
        });






        $scope.editComment = function (event, dessert) {
            event.stopPropagation(); // in case autoselect is enabled

            var editDialog = {
                modelValue: dessert.comment,
                placeholder: 'Add a comment',
                save: function (input) {
                    if(input.$modelValue === 'Donald Trump') {
                        input.$invalid = true;
                        return $q.reject();
                    }
                    if(input.$modelValue === 'Bernie Sanders') {
                        return dessert.comment = 'FEEL THE BERN!'
                    }
                    dessert.comment = input.$modelValue;
                },
                targetEvent: event,
                title: 'Add a comment',
                validators: {
                    'md-maxlength': 30
                }
            };

            var promise;

            if($scope.options.largeEditDialog) {
                promise = $mdEditDialog.large(editDialog);
            } else {
                promise = $mdEditDialog.small(editDialog);
            }

            promise.then(function (ctrl) {
                var input = ctrl.getInput();

                input.$viewChangeListeners.push(function () {
                    input.$setValidity('test', input.$modelValue !== 'test');
                });
            });
        };

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.getTypes = function () {
            return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };

        $scope.loadStuff = function () {
            $scope.promise = $timeout(function () {
                // loading
            }, 2000);
        }

        $scope.logItem = function (item) {
            console.log(item.name, 'was selected');
        };

        $scope.logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope.logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        }















        $http({
            method: 'POST',
            url: MY_CONSTANT.url + '/get_promocode',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'access_token='+localStorage.getItem('access_token')
        }).success(function (data) {
            $scope.showloader = false;

            var dataArray = [];
            var excelArray = [];
            //data = JSON.parse(data);
            if (data.status == 200) {

                var promoCodeList = data.data;

                promoCodeList.forEach(function (column) {

                    if (column.is_deleted == 0) {
                        var e = {};
                        e.ID = column.id;
                        e.Promotion_Code = column.promotion_code;
                        e.Description = column.description;

                        //******************** date conversion ******************************************
                        e.Start_Date = column.start_date;
                        e.End_Date = column.end_date;

                        if (e.Start_Date == "0000-00-00 00:00:00") {
                            e.Start_Date = "N/A";
                        }
                        else if (e.Start_Date != "") {
                            e.Start_Date = moment(e.Start_Date).format("YYYY/MM/DD");
                            if (e.Start_Date == 'Invalid date') {
                                e.Start_Date = '';
                            }
                        } else {
                            e.Start_Date = "N/A";
                        }

                        if (e.End_Date == "0000-00-00 00:00:00") {
                            e.End_Date = "N/A";
                        }
                        else if (e.End_Date != "") {
                            e.End_Date = moment(e.End_Date).format("YYYY/MM/DD");
                            if (e.End_Date == 'Invalid date') {
                                e.End_Date = '';
                            }

                        } else {
                            e.End_Date = "N/A";
                        }

                        e.Days_Validity = column.days_validity;
                        e.Total_Num_Of_Coupons = column.num_coupons;
                        e.Num_Coupons_Per_User = column.no_coupons_per_user;
                        e.Max_Discount = column.maximum;
                        e.Perc_Discount = column.discount;

                        //******************** type of promo code ******************************************
                        if (column.type == 1) {
                            e.Perc_Discount = "--"
                        }
                        else if (column.type == 2) {
                            e.Max_Discount = "--"
                        }

                        e.Type = column.type;

                        excelArray.push(e);

                        var d = {};

                        d.id = column.id;
                        d.promotion_code = column.promotion_code;
                        d.description = column.description;
                        d.type = column.type;
                        d.days_validity = column.days_validity;
                        d.num_coupons = column.num_coupons;
                        d.promo_image = column.promo_image;
                        d.max_discount = column.maximum;
                        d.perc_discount = column.discount;
                        d.no_coupons_per_user = column.no_coupons_per_user;
                        d.editpromo_url = "/app/edit-promo-code/" + column.id;
                        d.engagement_url = "/app/engagement-list/" + column.promotion_code;
                        d.is_deleted = column.is_deleted;
                        d.is_blocked = column.is_blocked;

                        //******************** date conversion ******************************************
                        d.start_date = column.start_date;
                        d.end_date = column.end_date;

                        if (d.start_date == "0000-00-00 00:00:00") {
                            d.start_date = "N/A";
                        }
                        else if (d.start_date != "") {
                            d.start_date = moment(d.start_date).format("YYYY/MM/DD");
                            if (d.start_date == 'Invalid date') {
                                d.start_date = '';
                            }


                        } else {
                            d.start_date = "N/A";
                        }
                        if (d.end_date == "0000-00-00 00:00:00") {
                            d.end_date = "N/A";
                        }
                        else if (d.end_date != "") {
                            d.end_date = moment(d.end_date).format("YYYY/MM/DD");
                            if (d.end_date == 'Invalid date') {
                                d.end_date = '';
                            }

                        } else {
                            d.end_date = "N/A";
                        }


                        //******************** type of promo code ******************************************
                        if (d.type == 1) {
                            d.perc_discount = "--"
                        }
                        else if (d.type == 2) {
                            d.max_discount = "--"
                        }

                        dataArray.push(d);
                    }

                });
                $scope.list = dataArray;
                $scope.excelList = excelArray;
                // $scope.$apply(function () {


                // Define global instance we'll use to destroy later
                var dtInstance;

                $timeout(function () {
                    if (!$.fn.dataTable)
                        return;
                    dtInstance = $('#datatablePromo').dataTable({
                        'paging': true, // Table pagination
                        'ordering': true, // Column ordering
                        'info': true, // Bottom left status text
                        // Text translation options
                        // Note the required keywords between underscores (e.g _MENU_)
                        oLanguage: {
                            sSearch: 'Search all columns:',
                            sLengthMenu: '_MENU_ records per page',
                            info: 'Showing page _PAGE_ of _PAGES_',
                            zeroRecords: 'Nothing found - sorry',
                            infoEmpty: 'No records available',
                            infoFiltered: '(filtered from _MAX_ total records)'
                        },
                        "aoColumnDefs": [
                            {'bSortable': false, 'aTargets': [10]}
                        ]
                    });
                    var inputSearchClass = 'datatable_input_col_search';
                    var columnInputs = $('tfoot .' + inputSearchClass);

                    // On input keyup trigger filtering
                    columnInputs
                        .keyup(function () {
                            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        });
                },10);
                // When scope is destroyed we unload all DT instances
                // Also ColVis requires special attention since it attaches
                // elements to body and will not be removed after unload DT
                $scope.$on('$destroy', function () {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                });
                // });
            }

            else if (data.status == 401) {
                $state.go('page.login');
            }
        });




        /*--------------------------------------------------------------------------
         * --------- funtion to AddPromoCode ---------------------------------------
         --------------------------------------------------------------------------*/

/*

        $scope.showDialog = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'tabDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true

            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        };
*/



        $scope.showDialog = function($event) {
            console.log("hahah");

            $mdDialog.show({
                targetEvent: $event,
                controller: function($timeout, $q, $scope, $mdDialog) {
                    var user = this;
                    $scope.cancel = function($event) {
                        $mdDialog.cancel();
                    };
                    $scope.finish = function($event) {
                        $mdDialog.hide();
                    };
                    $scope.answer = function(answer) {
                        var user = {
                            email: answer.email,
                            password: answer.password
                        };


                    };


                    $scope.file_to_upload = function (files) {
                        $scope.showCroppingArea = 1;
                        $scope.promo_code_image=files[0];
                        $scope.promo_img_sent = 1;

                        $scope.bounds.left = 0;
                        $scope.bounds.right = 0 ;
                        $scope.bounds.top = 0;
                        $scope.bounds.bottom = 0;

                        $scope.left = 0;
                        $scope.right = 0;

                        var file = files[0];
                        var imageType = /image.*/;
                        if (!file.type.match(imageType)) {

                        }
                        var img = document.getElementById("promo_code_image");
                        img.file = file;
                        var reader = new FileReader();
                        reader.onload = (function (aImg) {
                            return function (e) {
                                aImg.src = e.target.result;
                            };
                        })(img);
                        reader.readAsDataURL(file);


                    }

                    $scope.$watch('cropper.croppedImage', function (newValue, oldValue) {

                        if ($scope.left == 0 && $scope.bounds.left != 0) {
                            $scope.left = $scope.bounds.left;
                        }
                        if($scope.right == 0 && $scope.bounds.right !=0){
                            $scope.right =$scope.bounds.right
                        }

                    });





                },
                controllerAs: 'user',
                clickOutsideToClose: true,
                preserveScope: true,
                fullscreen: true,
                templateUrl: 'tabDialog.tmpl.html'
            });
        };





        /*
                    this.$mdDialog.show({
                        controller: LoginDialogController,
                        controllerAs: 'dialog',
                        templateUrl: 'login-dialog.template.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        clickOutsideToClose: true,
                        fullscreen: useFullScreen
                    });
        */







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
         * ---------------- funtion to open modal for delete promo code ------------
         --------------------------------------------------------------------------*/
        $scope.deletePromocode_popup = function (promo_code_id) {

            $scope.promo_code_id = promo_code_id;

            ngDialog.open({
                template: 'delete_promocode_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };

        /*--------------------------------------------------------------------------
         * -------------------------funtion to delete promo code -------------------
         --------------------------------------------------------------------------*/
        $scope.delete_promo = function (promo_code_id) {

            ngDialog.close({
                template: 'delete_promocode_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $http.post(MY_CONSTANT.url + '/deletePromoCode',
                {
                    access_token: localStorage.getItem('access_token'),
                    promo_id: promo_code_id.toString()
                }).success(function (data) {
                //data = JSON.parse(data);

                if (data.status == 200) {
                    $scope.displaymsg = "Promo Code deleted successfully.";
                }

                else if (data.status == 401) {
                    $state.go('page.login');
                }
                else {
                    $scope.displaymsg = data.message;
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
         * --------- funtion to open modal for block/unblock promo code ------------
         --------------------------------------------------------------------------*/
        $scope.blockUnblockPromocode_popup = function (promo_code_id, block_status, promotion_code) {

            $scope.promo_code_id = promo_code_id;
            $scope.promo_code_block_unblock_value = block_status;
            $scope.promo_name = promotion_code;

            if (block_status)
                $scope.block_unblock_status = 'unblock';
            else
                $scope.block_unblock_status = 'block';

            ngDialog.open({
                template: 'block_unblock_promocode_modal',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to block/unblock promo code --------------------
         --------------------------------------------------------------------------*/
        $scope.block_unblock_promo = function (promo_code_id, promo_code_block_unblock_value, promo_name) {

            if (promo_code_block_unblock_value)
                promo_code_block_unblock_value = 0;
            else
                promo_code_block_unblock_value = 1;

            ngDialog.close({
                template: 'delete_promocode_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $http.post(MY_CONSTANT.url + '/block_unblock_promo',
                {
                    access_token: localStorage.getItem('access_token'),
                    id: promo_code_id.toString(),
                    promo_name: promo_name,
                    isBlock: promo_code_block_unblock_value
                }).success(function (data) {
                //data = JSON.parse(data);

                if (data.status == 200) {
                    $scope.displaymsg = "Promo Code " + $scope.block_unblock_status + "ed successfully.";
                }

                else if (data.status == 401) {
                    $state.go('page.login');
                }
                else if (data.status == 1) {
                    $scope.displaymsg = data.error;
                }
                else {
                    $scope.displaymsg = data.message;
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
         * ---------------- funtion to edit promo code ------------------------------
         --------------------------------------------------------------------------*/
        $scope.editPromocode_popup = function (id) {
            promoService.add_promo_id(id);
            $state.go('app.editpromocode');
        };


        /*--------------------------------------------------------------------------
         * ---------------- funtion to add promo code ------------------------------
         --------------------------------------------------------------------------*/
        $scope.AddPromoCodeDialog = function () {
            $state.go('addPromo');
        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to show referral codes -------------------------
         --------------------------------------------------------------------------*/
        $scope.showReferralCode = function () {
            $http.post(MY_CONSTANT.url + '/list_refferal_details',
                {
                    access_token: localStorage.getItem('access_token')
                }).success(function (data) {
                //data = JSON.parse(data);

                if (data.status == 200) {
                    var referral_code={};
                    console.log(data.data);
                    if(data.data.length>0){
                        referral_code = data.data[0];
                        $scope.referral = {
                            perc_off: referral_code.discount,
                            max_off: referral_code.maximum,
                            coupon_id: referral_code.coupon_id
                        };

                    }
                    else{
                        referral_code={
                            discount:'',
                            maximum:'',
                            coupon_id:''
                        };
                    }


                    ngDialog.open({
                        template: 'referral_code_popup',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });


                }

                else if (data.status == 401) {
                    $state.go('page.login');
                }


            });

        };


        //====================================================================================
        //==================================edit referral code ===============================
        //====================================================================================

        $scope.submitReferral = function () {

            $http.post(MY_CONSTANT.url + '/update_refferal_details',
                {
                    access_token: localStorage.getItem('access_token'),
                    coupon_id: $scope.referral.coupon_id.toString(),
                    discount: $scope.referral.perc_off.toString(),
                    maximum: $scope.referral.max_off.toString()


                }).success(function (data) {
                //data = JSON.parse(data);

                if (data.status == 200) {
                    $scope.editReferral.successMsg = "Referral Code Updated Successfully.";

                }

                else if (data.status == 401) {
                    $state.go('page.login');
                }
                else {
                    $scope.editReferral.errorMsg = data.message;

                }
                //$scope.$apply();
                setTimeout(function () {
                    $scope.editReferral.successMsg = "";
                    $scope.editReferral.errorMsg = "";
                    //$scope.$apply();
                    ngDialog.close({
                        template: 'referral_code_popup',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }, 3000);


            });


        }

        /*--------------------------------------------------------------------------
         * ---------------- date conversion function -------------------------------
         --------------------------------------------------------------------------*/
        function dateConversion(dte) {
            var dteSplit1 = dte.split("T");
            var date = dteSplit1[0];
            return date;

        };
    }
})();

