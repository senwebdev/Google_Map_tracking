/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.promo')
        .controller('addPromoCtrl', addPromoCtrl);
    function addPromoCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter, promoService) {

            $scope.show_perc_off = false;
            $scope.show_max_off = false;
            $scope.promo_img_sent = 0;
            $scope.cropper = {};
            $scope.cropper.sourceImage = null;
            $scope.cropper.croppedImage   = null;
            $scope.bounds = {};
            $scope.bounds.left = 0;
            $scope.bounds.right = 0 ;
            $scope.bounds.top = 0;
            $scope.bounds.bottom = 0;
            $scope.showCroppingArea = 0;
            $scope.left = 0;
            $scope.right = 0;
            $scope.inactive = 0;

            //flag value for vat registered
            $scope.discount_type = [{
                id:0,
                name: 'Fixed Discount'
            },

                {
                    id:1,
                    name: '% Discount with fixed Maximum Discount'
                },


            ];

            $scope.promo = {};
            $scope.displaymsg = '';

            $scope.minDate = new Date();


            $scope.today = function() {
                $scope.promo.start_date = new Date();
            };

            $scope.clear = function () {
                $scope.promo.start_date = null;
            };

            //// Disable weekend selection
            //$scope.disabled = function(date, mode) {
            //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            //};

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
                $scope.opened1=false;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date();
            $scope.format = 'yyyy/MM/dd';



            $scope.today = function() {
                $scope.promo.end_date = new Date();
            };
            //$scope.today();

            $scope.clear = function () {
                $scope.promo.end_date = null;
            };

            //// Disable weekend selection
            //$scope.disabled = function(date, mode) {
            //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            //};

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open1 = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened1 = true;
                $scope.opened = false;

            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date();
            $scope.format = 'yyyy/MM/dd';
            /*======================================================================
             *==================function to upload image =======================
             =====================================================================*/
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

            /*=========================================================================
             *=========function to check bounds of cropped image ======================
             =========================================================================*/
            $scope.$watch('cropper.croppedImage', function (newValue, oldValue) {

                if ($scope.left == 0 && $scope.bounds.left != 0) {
                    $scope.left = $scope.bounds.left;
                }
                if($scope.right == 0 && $scope.bounds.right !=0){
                    $scope.right =$scope.bounds.right
                }

            });

            /*=========================================================================
             *=========function to show fields according to type selected  ===========
             =========================================================================*/
            $scope.discountShow = function(type){
                if(type==0){
                    $scope.show_max_off = true;
                    $scope.show_perc_off =false;

                }

                if(type==1){
                    $scope.show_max_off = true;
                    $scope.show_perc_off =true;


                }
            }

            /*--------------------------------------------------------------------------
             * ---------------- function to add promo code -----------------------------
             --------------------------------------------------------------------------*/
        var d=new Date();
        var e=new Date();
        e= e.setDate(e.getDate()+1);
        console.log(moment(d).format('YYYY-MM-DD'));
        $('.applyBtn').click(function(){
            $scope.$apply();
            $('.daterange').focus();
            // $timeout(function(){$scope.dateFilter();},100);
        });
        $scope.dateFilter=function(){
            console.log($scope.dates.dates2);
            console.log($('.daterange').val());
            //$scope.$apply();
            console.log('as');
            // $scope.changeDate();
            var start_date='';
            var end_date='';
            if(typeof $scope.dates.dates2=="string")
            {
                var r=$('.daterange').val().split(' - ');
                console.log(r);
                start_date = new Date(r[0]);
                end_date = new Date(r[1]);
            }
            else {
                start_date=$scope.dates.dates2.startDate;
                end_date=$scope.dates.dates2.endDate;
            }
            start_date.setHours(0);
            start_date.setMinutes(0);
            start_date.setSeconds(0);
            start_date.setMilliseconds(0);
            end_date.setHours(0);
            end_date.setMinutes(0);
            end_date.setSeconds(0);
            end_date.setMilliseconds(0);
            $scope.promo.validity=(end_date-start_date)/(60000*60*24);
        };
        $scope.dates={};
        $scope.dates.dates2 = { startDate:  moment(d), endDate: moment(e) };
        $scope.promo.validity=(e-d)/(60000*60*24);
        $scope.addPromoCode = function () {

                $scope.successMsg = '';
                $scope.errorMsg = '';

                //console.log($scope.promo.start_date1);
                //console.log($scope.promo.end_date1);

            console.log($scope.dates.dates2);
            console.log(typeof $scope.dates.dates2);

            $scope.promo.start_date='';
            $scope.promo.end_date='';
            var start_date='';
            var end_date='';
            if(typeof $scope.dates.dates2=="string")
            {
                var r=$scope.dates.dates2.split(' - ');
                console.log(r);
                $scope.promo.start_date=r[0];
                $scope.promo.end_date=r[1];
                console.log($scope.promo.start_date);
                console.log($scope.promo.end_date);
                start_date = $scope.promo.start_date;
                end_date = $scope.promo.end_date;
                start_date = new Date(start_date);
                end_date = new Date(end_date);
                console.log(start_date);
                console.log(end_date);

            }
            else {
                $scope.promo.start_date=$scope.dates.dates2.startDate;
                $scope.promo.end_date=$scope.dates.dates2.endDate;
                console.log($scope.dates.dates2);
                start_date=$scope.promo.start_date;
                end_date=$scope.promo.end_date;
                console.log(start_date);
                console.log(end_date);
            }
                /*var start_date = $scope.promo.start_date1;
                var end_date = $scope.promo.end_date1;
                start_date = new Date(start_date);
                end_date = new Date(end_date);

                if(end_date)
                    end_date.setDate(end_date.getDate() + 1);*/

                var days = (end_date - start_date)/(1000 * 3600 * 24);

                //var start=moment(start_date)
                //console.log(start_date.toISOString(),end_date.toISOString());
                //console.log(end_date.toISOString()-start_date.toISOString());
                console.log('days',days);

                //if($scope.promo.start_date1 == '' || $scope.promo.start_date1 == undefined || $scope.promo.start_date1 == null){
                //    $scope.errorMsg = "Please select Start Date";
                //    $scope.TimeOutError();
                //    return false;
                //}
                //if($scope.promo.end_date1 == '' || $scope.promo.end_date1 == undefined || $scope.promo.end_date1 == null){
                //    $scope.errorMsg = "Please select End Date";
                //    $scope.TimeOutError();
                //    return false;
                //}
                //if (days <= 0) {
                //    $scope.errorMsg = "Start Date must be less than End Date";
                //    $scope.TimeOutError();
                //    return false;
                //}
                if($scope.promo.validity > days){
                    $scope.errorMsg = "Please select validity between selected dates";
                    $scope.TimeOutError();
                    return false;
                }
                if($scope.promo_img_sent ==0){
                    $scope.errorMsg = "Please Select Image for Promo Code";
                    $scope.TimeOutError();
                    return false;
                }


                if($scope.promo.discount_type==0 && ($scope.promo.max_off =='' || $scope.promo.max_off== undefined))
                {
                    $scope.errorMsg = "Please Enter Maximum Discount";
                    $scope.TimeOutError();
                    return false;

                }

                if($scope.promo.discount_type==1 && (($scope.promo.perc_off =='' || $scope.promo.max_off =='') || ($scope.promo.perc_off ==undefined || $scope.promo.max_off ==undefined)))
                {
                    $scope.errorMsg = "Please Enter Maximum & (%) Discount";
                    $scope.TimeOutError();
                    return false;

                }
                if($scope.cropper.croppedImage){

                    $scope.croppedimg =  window.dataURLtoBlob($scope.cropper.croppedImage);
                }
                else{;
                    $scope.croppedimg = $scope.promo_code_image;
                }
                if( $scope.bounds.left == $scope.left && $scope.bounds.right == $scope.right ){
                    $scope.croppedimg = $scope.promo_code_image;
                }



                //start_date = $("#start_date").val();
                //end_date = $("#end_date").val();
                //start_date = start_date + " 00:00:00";
                //var start_date = new Date(start_date);
                //start_date = start_date.toUTCString();
                //
                //end_date = end_date + " 23:59:00";
                //end_date = new Date(end_date);
                //end_date = end_date.toUTCString();


                $scope.promo.start_date = start_date;
                $scope.promo.end_date = end_date;
                var formData = new FormData();
                formData.append('access_token', localStorage.getItem('access_token'));
                formData.append('promo_code', $scope.promo.promo_code);
                formData.append('days_validity', $scope.promo.validity);
                formData.append('number_issued', $scope.promo.num_coupons);
                formData.append('start_date', start_date);
                formData.append('end_date', end_date);
                formData.append('description', $scope.promo.description);
                formData.append('image_flag', $scope.promo_img_sent);
                formData.append('promo_image', $scope.croppedimg);
                formData.append('no_end_time', 0);
                formData.append('is_free_ride', 0);
                formData.append('max_free_distance_metres', 0);
                formData.append('max_free_time_seconds',0);

                formData.append('promo_type', $scope.promo.discount_type);
            //formData.append('promo_type', 0);
                formData.append('per_user', $scope.promo.num_coupons_per_user);
                if($scope.promo.discount_type==0){
                    formData.append('min_price', 0);
                    formData.append('max_off', $scope.promo.max_off);
                }

                else{
                    formData.append('percent_discount', $scope.promo.perc_off);
                    formData.append('min_price', 0);
                    formData.append('max_off', $scope.promo.max_off);
                }

                $.ajax({
                    type: 'POST',
                    url: MY_CONSTANT.url + '/admin/add_promocode',
                    dataType: "json",
                    data: formData,
                    async: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        $scope.displaymsg = "Promo Code Added Successfully.";
                        $scope.inactive = 1;
                        console.log("data is "+data);
                        if (data.status == 200) {
                            $scope.displaymsg = "Promo Code Added Successfully.";

                        }
                        else if (data.status == 401) {
                            $state.go('page.login');
                        }
                        else if(data.error){
                            $scope.displaymsg = data.error;
                        }
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
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
            $scope.refreshPage = function () {

                ngDialog.close({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
                $state.go('promo');

            };

            //animation of text area

            $("#description").focus(function() {

                $(this).animate({
                    height: 100
                }, "normal"),


                    $(this).blur(function() {

                        $(this).animate({
                            height: 35
                        }, "normal")

                    });
            });

            $scope.TimeOutError = function () {
                setTimeout(function () {
                    $scope.errorMsg = "";
                    $scope.$apply();
                }, 3000);

            };

            $scope.back = function() {
                $state.go('promo.list');
            }
    }
})();