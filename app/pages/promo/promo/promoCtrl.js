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
            url: MY_CONSTANT.url + '/admin/get_promocode',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                limit:10,
                offset:0,
                'access_token':localStorage.getItem('access_token')
            }
        }).success(function (data) {
            console.log("$scope.desserts "+data.promo_codes);
            $scope.desserts = {
                "count": data.total_promo_codes,
                "data":data.promo_codes
            }
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

