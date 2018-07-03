/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.addBooking')
        .controller('addBookingCtrl', addBookingCtrl);
    function addBookingCtrl($timeout, $scope,$interval, $http, MY_CONSTANT, ngDialog, $state, $filter) {
       /* App.controller('AddBookingController', ['$scope', '$interval', '$timeout', '$http', 'uiGmapLogger', '$cookies', '$cookieStore', 'MY_CONSTANT', '$state', 'ngDialog', 'uiGmapGoogleMapApi', 'responseCode', 'countryName','currency'
            , function ($scope, $interval, $timeout, $http, $log, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, GoogleMapApi, responseCode, countryName,currency) {
*/
        var poly='';

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
                        $scope.carList = dataArray;
                    });
                }
            });

        $scope.newReg = {};
                $scope.newReg.successMsg = "";
                $scope.book_ride = false;
                $scope.booking = {};
                $scope.driver_data = {};
                $scope.info = {};
                $scope.ride = {};
                $scope.rideText = "Book";
                $scope.time_msg = false;
                $scope.book_ride_later_data = {};
                $scope.customer_access_token = "";
                $scope.show_driver_flag = false;
                $scope.manual_drivers = false;
                $scope.time_value = false;
                $scope.book_type = false; //manual booking
                $scope.approx = {};
                $scope.eta_flag = 0;   //flag for showing ETA
                $scope.approx_value_show = 0;//flag for showing hr tag
                $scope.approx_price = 0; //flag for estimated price
                $scope.count = 0;
                $scope.promodivshow = 0;
                $scope.promosuccessMsg = "";
                $scope.promoerrorMsg = "";
                $scope.total_rqst_send = 0;
                $scope.currency_sign = '£';

                $scope.interval_for_particular_driver = {};
                $scope.cancel_interval_time_driver = {};
                var driverMarkerArr  =new Array();
                var infoWindow = new google.maps.InfoWindow();
                var bounds = new google.maps.LatLngBounds();
                //remove api hit when moving from one controller to another
                $scope.$on('$destroy',function() {

                    clearInterval($scope.interval_time);
                    clearInterval($scope.cancel_interval_time);
                    $interval.cancel($scope.interval_for_particular_driver);
                    $interval.cancel($scope.cancel_interval_time_driver);

                });

                var d = new Date((new Date()).getTime());
                var offset = ((d.getTimezoneOffset()) * 60 * (-1));
                /*--------------------------------------------------------------------------
                 * --------- showing drivers marker ----------------------------------
                 --------------------------------------------------------------------------*/
                var createDriverMarker = function (info) {
                    var icon = 'assets/img/taxi/freeDriver.png';

                    var marker1 = new google.maps.Marker({
                        position: new google.maps.LatLng(info.latitude, info.longitude),
                        map: $scope.mapContainer,
                        icon: {
                            url:'assets/img/taxi/freeDriver.png',
                            scaledSize: new google.maps.Size(30, 30)
                        }
                    });

                    marker1.content = '<div class="infoWindowContent">' +
                        '<center>Driver Info</center>' +
                        '<span> Name - ' + info.user_name + '</span><br>' +
                        '<span> Phone - ' + info.phone_no + '</span><br>' +
                            //'<span> Car Type - ' + info.car_name + '</span><br>' +
                            //'<span> Vehicle Number - ' + info.driver_car_no + '</span>' +
                        '</div>';

                    google.maps.event.addListener(marker1, 'click', function () {
                        infoWindow.setContent(marker1.content);
                        infoWindow.open($scope.mapContainer, marker1);
                    });

                    driverMarkerArr.push(marker1);

                }

//==========================================================================================================================
//========================================================== calculating distance ===========================================
//==========================================================================================================================
                $scope.getDistance = function () {

                    $.post(MY_CONSTANT.url_booking + '/fare_estimate',{
                            pickup_latitude:$scope.booking.latitude,
                            pickup_longitude:$scope.booking.longitude,
                            destination_latitude:Number($scope.book_ride_later_data.manual_destination_latitude).toFixed(6),
                            destination_longitude:Number($scope.book_ride_later_data.manual_destination_longitude).toFixed(6),
                            car_type:$scope.booking.car_type,
                            access_token:$scope.booking.access_token

                        },
                        function(data)
                        {
                            data = JSON.parse(data);
                            console.log('fare estimation new ',data);
                            $scope.estimated_price=data.estimated_fare;
                            console.log('dhsgh',data.estimated_fare);
                            $scope.estimated_range_min = ($scope.estimated_price)-(0.1*($scope.estimated_price));
                            $scope.estimated_range_min1=parseInt($scope.estimated_range_min);
                            $scope.estimated_range_max = ($scope.estimated_price)+(0.1*($scope.estimated_price));
                            $scope.estimated_range_max1=parseInt($scope.estimated_range_max);
                            console.log('min, max',$scope.estimated_range_min1,$scope.estimated_range_max1);
                            $scope.approx_price = 1;
                            $scope.$apply();
                        });
                    // show route between the points
                    var directionsService = new google.maps.DirectionsService();
                    var directionsDisplay = new google.maps.DirectionsRenderer(
                        {
                            suppressMarkers: true,
                            suppressInfoWindows: true
                        });
                    // directionsDisplay.setMap(map);
                    var request = {
                        origin: $scope.location1,
                        destination: $scope.location2,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                    };
                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            var string;

                            directionsDisplay.setDirections(response);

                            var driving_time = parseFloat(response.routes[0].legs[0].duration.value / 60);
                            var distance = parseFloat(response.routes[0].legs[0].distance.value / 1609.34);
                            string = "The distance between the two points on the chosen route is: " + response.routes[0].legs[0].distance.text;
                            string += "<br/>The aproximative driving time is: " + response.routes[0].legs[0].duration.text;
                            $scope.fare_factor = parseFloat($scope.fare_factor);
                            $scope.approx.fare_fixed = parseFloat($scope.approx.fare_fixed);
                            $scope.approx.fare_per_min = parseFloat($scope.approx.fare_per_min);
                            //$scope.estimated_price = ($scope.fare_factor * ($scope.approx.fare_fixed + (driving_time * $scope.approx.fare_per_min) + (distance * $scope.approx.fare_per_km))).toFixed(2);
                            //console.log('estimated price',$scope.estimated_price);
                            //$scope.approx_price = 1;
                        }
                        $scope.$apply();
                    });
                };
//==========================================================================================================================
//===============================================end distance calculation ================================================
//==========================================================================================================================


                //get car type details for expected fare calculation
                $scope.getfare = function (cartype_val) {

                    $.post(MY_CONSTANT.url + '/list_all_cars', {access_token: localStorage.getItem('access_token')},
                        function (data) {
                            data = JSON.parse(data);
                            var length = data.data.car_list.length;
                            if (data.status == 200) {
                                var carList = data.data.car_list;
                                for (i = 0; i < length; i++) {
                                    if (i == cartype_val) {
                                        $scope.$apply(function () {
                                            $scope.approx = {
                                                fare_per_min: data.data.car_list[i].fare_per_min,
                                                fare_per_km: data.data.car_list[i].fare_per_km,
                                                fare_fixed: data.data.car_list[i].fare_fixed
                                            };
                                        });

                                    }
                                }
                                $timeout(function(){$scope.getDistance();},100);
                            }
                        });

                }


                /*--------------------------------------------------------------------------
                 * --------- funtion to enter only numbers in number field -----------------
                 ------------------------------- ------------------------------------------*/
                $('#main-content').on('keypress', '#search_phone_no', function (e) {
                    var curval = $(this).val().length;

                    //if ((e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57))) {
                    //    return false;
                    //}
                    //else if (e.which == 8 || e.which == 0) {
                    //    return true;
                    //}
                    //if (curval == 14) {
                    //    return false;
                    //}
                });


                var start = new Date();
                start.setHours(start.getHours() + 1);
                start = new Date(start);

                start.setMinutes(start.getMinutes() + 4);
                start = new Date(start);

                //e.setDate(start.getDate() + 3);

                $("#pick_up_time").datetimepicker({
                    format: 'yyyy/mm/dd hh:ii',

                    autoclose: true,
                    startDate: start
                    //endDate: e
                });


                $scope.$watch('book_type', function (newValue, oldValue) {
                    start.setHours(start.getHours() + 1);
                    start = new Date(start);
                    if (newValue == false) {
                        $scope.time_value = false;

                    }
                    else {
                        $scope.manual_drivers = false;
                    }
                });

                $scope.$watch('time_value', function (newValue, oldValue) {
                    start.setHours(start.getHours() + 1);
                    start = new Date(start);
                    $("#pick_up_time").val('');
                });

                /*--------------------------------------------------------------------------
                 * --------- funtion to send request to a particualr driver ----------------
                 ------------------------------- ------------------------------------------*/

                $scope.manualDriverArray = [];

                $('#driver_table').on('click', '.checkbox', function(e) {
                    if(e.currentTarget.checked){
                        $scope.manualDriverArray.push(e.currentTarget.value);
                    }
                    else{
                        for(var i = 0;i < $scope.manualDriverArray.length;i++){
                            if(e.currentTarget.value == $scope.manualDriverArray[i]){
                                $scope.manualDriverArray.splice(i, 1);
                            }
                        }
                    }
                });

                $scope.sendDriverRequest = function (driver_id) {

                    $scope.total_rqst_send += 1;


                    if ($scope.info.promo_code) {   //if promocode is applied
                        $.post(MY_CONSTANT.url_booking + '/redeem_promotion', {
                            access_token: $scope.info.access_token,
                            promo_code: $scope.info.promo_code
                        }, function (data) {
                            data = JSON.parse(data);
                            if (data.flag == 450) {
                                $scope.promosuccessMsg = data.message;
                                $scope.TimeOutSuccessError();

                                $scope.ride_function = true;
                                $scope.rideText = "Processing";

                                if($scope.manualDriverArray){
                                    $scope.sendDriverRequestTimer($scope.manualDriverArray, 0);

                                    $scope.interval_for_particular_driver = $interval(function () {
                                        $scope.sendDriverRequestTimer($scope.manualDriverArray, 1);
                                    }, 20000);

                                    $scope.cancel_interval_time_driver = $timeout(function () {
                                        $scope.ride_function = false;
                                        $scope.rideText = "Book";

                                        $interval.cancel( $scope.interval_for_particular_driver);
                                        $scope.manual_drivers = false;
                                    }, 180001);
                                }

                            }
                            else if (data.error) {
                                $scope.promoerrorMsg = data.error;
                                $('.assignDriver').prop("disabled", false);
                                $('.assignDriver').text('Send Request');
                                $scope.TimeOutSuccessError();
                            }
                            else {
                                $scope.promoerrorMsg = data.message;
                                $('.assignDriver').prop("disabled", false);
                                $('.assignDriver').text('Send Request');
                                $scope.TimeOutSuccessError();
                            }
                            $scope.$apply();


                        });
                    }
                    else {  //if no promo code applied
                        $scope.ride_function = true;
                        $scope.rideText = "Processing";

                        if($scope.manualDriverArray){
                            $scope.sendDriverRequestTimer($scope.manualDriverArray, 0);

                            $scope.interval_for_particular_driver = $interval(function () {
                                $scope.sendDriverRequestTimer($scope.manualDriverArray, 1);
                            }, 20000);

                            $scope.cancel_interval_time_driver = $timeout(function () {
                                $scope.ride_function = false;
                                $scope.rideText = "Book";

                                $interval.cancel( $scope.interval_for_particular_driver);
                                $scope.manual_drivers = false;
                            }, 180001);
                        }


                    }


                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to get latitude and longitude of pick up location -----
                 ------------------------------- ------------------------------------------*/
                $scope.pickUpMarker = function (book) {
                    var address = $scope.info.chosenPlace;
                    (new google.maps.Geocoder()).geocode({
                        'address': address
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {

                            $scope.booking.latitude = results[0].geometry.location.lat();
                            $scope.booking.longitude = results[0].geometry.location.lng();

                        } else {
                        }
                    });
                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to get latitude and longitude of pick up location -----
                 -------------------- and place on map -----------------------------------*/
                $scope.initMap = function() {
                    $scope.map = {
                        zoom: 14,
                        center: new google.maps.LatLng(57.1910499, -2.0834466),
                        styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}],
                        pan: true
                    };
                    var markerArr = new Array();
                    var markerArr1 = new Array();
                    $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);

                    //event for adding marker on click oof body of map
                    google.maps.event.addListener($scope.mapContainer, 'click', function (event) {
                        $scope.booking.latitude = event.latLng.lat();
                        $scope.booking.longitude = event.latLng.lng();
                        $scope.reverseGeocode(event.latLng, 0);
                        $scope.placeMarker(event.latLng.lat(), event.latLng.lng(), 0);


                    });

                };
                $timeout(function(){
                    $scope.initMap();
                },100);
//*===========================================================================================================================*
//*=============================================REVERSE GEOCODING TO GET ADDRESS==============================================
//*===========================================================================================================================*
                $scope.reverseGeocode = function (latlong, val) {
                    (new google.maps.Geocoder()).geocode({'latLng': latlong}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                if (val == 0) {
                                    $('#address').val(results[0].formatted_address);
                                    $scope.info.chosenPlace = results[0].formatted_address;
                                }
                                else {
                                    $('#drop_off_address').val(results[0].formatted_address);
                                    $scope.info.dropOffPlace = results[0].formatted_address;
                                }
                                //$('#latitude').val(marker.getPosition().lat());
                                //$('#longitude').val(marker.getPosition().lng());

                            }
                        }
                    });

                }
//*===========================================================================================================================*
//*=============================================PLACE MARKER ON GIVEN LATLONG==================================================
//*===========================================================================================================================*
                $scope.placeMarker = function (lat, long, flag) {

                    if (flag == 0)
                        var icon = 'assets/img/taxi/marker_red.png';
                    else
                        var icon = 'assets/img/taxi/marker_green.png';
                    var marker = new google.maps.Marker({
                        map: $scope.mapContainer,
                        icon: icon,
                        position: new google.maps.LatLng(lat, long),
                        draggable: true
                    });
                    if (markerArr.length) {
                        for (var i = 0; i < markerArr.length; i++)
                            markerArr[i].setMap(null);
                        markerArr.pop();
                    }
                    markerArr.push(marker);
                    if ($scope.poly) {
                        poly = $scope.poly;
                        poly.setMap(null);   //destrying the already created path;
                    }

                    if (lat != '' &&  (!(angular.isUndefined($scope.book_ride_later_data.manual_destination_latitude)))){
                        $scope.drawPAth(lat, long, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);

                    }
                    //else{
                    //    var srclatlong = new google.maps.LatLng(lat, long);
                    //    bounds.extend(srclatlong);
                    //    $scope.mapContainer.fitBounds(bounds);
                    //}


                    google.maps.event.addListener(marker, 'drag', function () {
                        $scope.reverseGeocode(marker.getPosition(), 0);
                        $scope.booking.latitude = marker.getPosition().lat();
                        $scope.booking.longitude = marker.getPosition().lng();
                        if ($scope.poly) {
                            poly = $scope.poly
                            poly.setMap(null);   //destrying the already created path;
                        }

                    });

                    google.maps.event.addListener(marker, 'dragend', function () {
                        $scope.reverseGeocode(marker.getPosition(), 0);
                        $scope.booking.latitude = marker.getPosition().lat();
                        $scope.booking.longitude = marker.getPosition().lng();
                        if ($scope.booking.latitude != '' &&  (!(angular.isUndefined($scope.book_ride_later_data.manual_destination_latitude)))){
                            $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                        }
                        else{
                            var srclatlong = new google.maps.LatLng(lat, long);
                            bounds.extend(srclatlong);
                            $scope.mapContainer.fitBounds(bounds);
                        }

                    });

                }


                $scope.pickUpLocationOnMarker = function (book) {
                    var address = $scope.info.chosenPlace;

                    (new google.maps.Geocoder()).geocode({
                        'address': address
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $scope.location1 = results[0].geometry.location;
                            $scope.booking.latitude = results[0].geometry.location.lat();
                            $scope.booking.longitude = results[0].geometry.location.lng();
                            console.log($scope.booking.latitude);
                            console.log($scope.booking.longitude);
                            $scope.map = {
                                zoom: 14,
                                center: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                                pan: true
                            }

                            var panPoint = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                            $scope.mapContainer.panTo(panPoint);

                            var icon = 'assets/img/taxi/marker_red.png';

                            if (markerArr.length) {
                                for (i = 0; i < markerArr.length; i++)
                                    markerArr[i].setMap(null);
                                markerArr.pop();
                            }

                            var marker = new google.maps.Marker({
                                map: $scope.mapContainer,
                                icon: icon,
                                position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                                draggable: true
                            });

                            google.maps.event.addListener(marker, 'drag', function () {
                                $scope.reverseGeocode(marker.getPosition(), 0);
                                $scope.booking.latitude = marker.getPosition().lat();
                                $scope.booking.longitude = marker.getPosition().lng();
                                if ($scope.poly) {
                                    poly = $scope.poly
                                    poly.setMap(null);   //destrying the already created path;
                                }

                            });

                            google.maps.event.addListener(marker, 'dragend', function () {
                                $scope.reverseGeocode(marker.getPosition(), 0);
                                $scope.booking.latitude = marker.getPosition().lat();
                                $scope.booking.longitude = marker.getPosition().lng();
                                if ($scope.booking.latitude != '' &&  (!(angular.isUndefined($scope.book_ride_later_data.manual_destination_latitude))))
                                {
                                    $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                                }
                                else{   //incase of not going to drwa path ...so setting latlong bounds here
                                    var srclatlong = new google.maps.LatLng($scope.booking.latitude, $scope.booking.longitude);
                                    bounds.extend(srclatlong);
                                    $scope.mapContainer.fitBounds(bounds);
                                }

                            });

                            if ($scope.booking.latitude != '' &&  (!(angular.isUndefined($scope.book_ride_later_data.manual_destination_latitude))))
                            {
                                $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                            }
                            else{   //incase of not going to drwa path ...so setting latlong bounds here
                                var srclatlong = new google.maps.LatLng($scope.booking.latitude, $scope.booking.longitude);
                                bounds.extend(srclatlong);
                                $scope.mapContainer.fitBounds(bounds);
                            }

                            markerArr.push(marker);

                        } else {
                            $scope.displaymsg = "Pick up location is not valid";

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
                 * -------- funtion to get latitude and longitude of drop-off location -----
                 -------------------- and place on map -----------------------------------*/


                $scope.dropOffLocationOnMarker = function (book, flag) {


                    var address = book.dropOffPlace;
                    (new google.maps.Geocoder()).geocode({
                        'address': address
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $scope.location2 = results[0].geometry.location;

                            $scope.book_ride_later_data.manual_destination_latitude = results[0].geometry.location.lat();
                            $scope.book_ride_later_data.manual_destination_longitude = results[0].geometry.location.lng();

                            var icon = 'assets/img/taxi/marker_green.png';

                            if (markerArr1.length) {
                                for (i = 0; i < markerArr1.length; i++)
                                    markerArr1[i].setMap(null);
                                markerArr1.pop();
                            }

                            var marker = new google.maps.Marker({
                                map: $scope.mapContainer,
                                icon: icon,
                                position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                                draggable: true
                            });
                            google.maps.event.addListener(marker, 'drag', function () {
                                $scope.reverseGeocode(marker.getPosition(), 1);
                                $scope.book_ride_later_data.manual_destination_latitude = marker.getPosition().lat();
                                $scope.book_ride_later_data.manual_destination_longitude = marker.getPosition().lng();
                                if ($scope.poly) {
                                    poly = $scope.poly
                                    poly.setMap(null);   //destrying the already created path;
                                }

                            });

                            google.maps.event.addListener(marker, 'dragend', function () {
                                $scope.reverseGeocode(marker.getPosition(), 1);
                                $scope.book_ride_later_data.manual_destination_latitude = marker.getPosition().lat();
                                $scope.book_ride_later_data.manual_destination_longitude = marker.getPosition().lng();
                                if ((!(angular.isUndefined($scope.booking.latitude))) && ($scope.book_ride_later_data.manual_destination_latitude != '' )) {

                                    $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                                }
                                else{
                                    $scope.mapContainer.fitBounds(bounds);
                                }
                            });
                            markerArr1.push(marker);

                            if ((!(angular.isUndefined($scope.booking.latitude))) && ($scope.book_ride_later_data.manual_destination_latitude != '' )) {
                                $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                                if (flag != 0) {
                                    $scope.getfare($scope.info.car_type);
                                }

                            }
                            else{
                                $scope.mapContainer.fitBounds(bounds);
                            }

                            // $scope.getDistance();


                        } else {

                            $scope.displaymsg = "Drop-off location is not valid";

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
                 * --------- funtion to draw path between pick-up location and drop-off ----
                 ------------------------------- location ----------------------------------*/
                $scope.drawPAth = function (lat1, lng1, lat2, lng2) {
                    if ($scope.poly) {
                        poly = $scope.poly
                        poly.setMap(null);   //destrying the already created path;
                    }


                    var lat_lng = new Array();
                    var myLatlng = new google.maps.LatLng(lat1, lng1);
                    lat_lng.push(myLatlng);
                    var myLatlng1 = new google.maps.LatLng(lat2, lng2);
                    lat_lng.push(myLatlng1);

                    var path = new google.maps.MVCArray();

                    //Initialize the Direction Service
                    var service = new google.maps.DirectionsService();

                    //Set the Path Stroke Color
                    var poly = new google.maps.Polyline({map: $scope.mapContainer, strokeColor: '#4986E7'});


                    //Loop and Draw Path Route between the Points on MAP
                    for (var i = 0; i < lat_lng.length; i++) {
                        if ((i + 1) < lat_lng.length) {
                            var src = lat_lng[i];
                            var des = lat_lng[i + 1];
                            path.push(src);
                            poly.setPath(path);
                            service.route({
                                origin: src,
                                destination: des,
                                travelMode: google.maps.DirectionsTravelMode.DRIVING
                            }, function (result, status) {
                                if (status == google.maps.DirectionsStatus.OK) {
                                    for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                        path.push(result.routes[0].overview_path[i]);
                                    }


                                }
                            });
                        }
                    }

                    $scope.poly = poly;

                    // lat long bounds within given locations
                    bounds.extend(myLatlng);
                    bounds.extend(myLatlng1);
                    $scope.mapContainer.fitBounds(bounds);

                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to reset form data ------------------------------------
                 ---------------------------------------------------------------------------*/

                $scope.clearData = function () {
                    $state.reload();

                    //$scope.asyncSelected = "";
                    //$scope.info.user_name = "";
                    //$scope.info.user_email = "";
                    //$scope.info.car_type = "";
                    //$scope.info.chosenPlace = "";
                    //$scope.info.dropOffPlace = "";
                    //$scope.info.promo_code = "";
                    //$scope.time_value = false;
                    //$scope.book_type = false;
                    //$scope.manual_drivers = false;
                    //$scope.show_driver_flag = false;
                    //$scope.ride_function = false;
                    //$scope.rideText = "Book";
                    //$("#pick_up_time").val("");
                    //$scope.booking.latitude = '';
                    //$scope.booking.longitude = '';
                    //$scope.book_ride_later_data.manual_destination_latitude = '';
                    //$scope.book_ride_later_data.manual_destination_longitude = '';
                    //$scope.eta_flag = 0;   //flag for showing ETA
                    //$scope.approx_value_show = 0;//flag for showing hr tag
                    //$scope.approx_price = 0; //flag for estimated price
                    //$scope.promodivshow = 0;
                    //
                    //$scope.map = {
                    //    zoom: 14,
                    //    center: new google.maps.LatLng(57.1910499, -2.0834466),
                    //    pan: true
                    //}
                    //$scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
                    //google.maps.event.addListener($scope.mapContainer, 'click', function (event) {
                    //    $scope.booking.latitude = event.latLng.lat();
                    //    $scope.booking.longitude = event.latLng.lng();
                    //    $scope.reverseGeocode(event.latLng, 0);
                    //    $scope.placeMarker(event.latLng.lat(), event.latLng.lng(), 0);
                    //
                    //
                    //});
                    //
                    $interval.cancel($scope.interval_for_particular_driver);
                    $interval.cancel($scope.cancel_interval_time_driver);
                    clearInterval($scope.interval_time);
                    clearInterval($scope.cancel_interval_time);

                };


                /*--------------------------------------------------------------------------
                 * --------- funtion to check whether customer completed his previous  -----
                 ------------------------------ ride or not --------------------------------*/

                $scope.checkBookingStatus = function (book) {


                    $scope.successMsg = '';
                    $scope.errorMsg = '';
                    $scope.booking.access_token = book.access_token;
                    $scope.booking.car_type = book.car_type;
                    $scope.booking.device_type = 3;

                    var address = book.chosenPlace;
                    if (book == undefined) {
                        $scope.errorMsg = "All Fields are required.";
                        $scope.TimeOutError($scope.errorMsg);
                        return false;
                    }
                    if (book.user_name == '' || book.user_name == undefined || book.user_email == '' || book.user_email == undefined) {
                        $scope.errorMsg = "Username and Email id is required.";
                        $scope.TimeOutError($scope.errorMsg);
                        return false;
                    }

                    if (book.car_type == undefined || book.car_type == '') {
                        $scope.errorMsg = "Please select car type..";
                        $scope.TimeOutError($scope.errorMsg);
                        return false;

                    }

                    if ($scope.asyncSelected == undefined || $scope.asyncSelected == "") {
                        $scope.errorMsg = "Enter Phone Number To Search.";
                        $scope.TimeOutError($scope.errorMsg);
                        return false;
                    }
                    if (book.user_name == '' || book.user_name == undefined || book.user_email == '' || book.user_email == undefined) {
                        $scope.errorMsg = "Username and Email id is required.";
                        $scope.TimeOutError($scope.errorMsg);
                        return false;
                    }
                    if (book.car_type == undefined || book.car_type == '') {
                        $scope.errorMsg = "Please select car type..";
                        $scope.TimeOutError($scope.errorMsg);
                        return false;

                    }
                    else {
                        $scope.successMsg = '';
                        $scope.errorMsg = '';
                        $scope.booking.access_token = book.access_token;
                        $scope.booking.car_type = book.car_type;
                        $scope.booking.device_type = 3;
                        var address = book.chosenPlace;

                        if ($scope.book_type == undefined) {
                            $scope.errorMsg = "Please select booking type..";
                            $scope.TimeOutError($scope.errorMsg);
                            return false;

                        }
                        if ($scope.info.chosenPlace == '' || $scope.info.chosenPlace == undefined) {
                            $scope.errorMsg = "Enter Pick Up Location.";
                            $scope.TimeOutError($scope.errorMsg);
                            return false;
                        }
                        else if ($scope.book_type == false) {//manual booking

                            //lat long of drop_off location
                            if (book.dropOffPlace) {
                                (new google.maps.Geocoder()).geocode({
                                    'address': book.dropOffPlace
                                }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        $scope.ride.manual_destination_address = book.dropOffPlace;

                                        $scope.ride.manual_destination_latitude = results[0].geometry.location.lat();
                                        $scope.ride.manual_destination_longitude = results[0].geometry.location.lng();

                                    }
                                })
                            }


                            (new google.maps.Geocoder()).geocode({
                                'address': address
                            }, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {

                                    $scope.booking.admin_panel_request_flag = 1;

                                    $.post(MY_CONSTANT.url_booking + '/find_a_driver', $scope.booking
                                    ).then(
                                        function (data) {
                                            data = JSON.parse(data);
                                            var dataArray = [];
                                            var driverList = data.data;
                                            var length = data.data.length;

                                            if (length) {
                                                driverMarkerArr = [];
                                                driverList.forEach(function (column) {
                                                    createDriverMarker(column)

                                                    $scope.openInfoWindow = function (e, selectedMarker) {
                                                        e.preventDefault();
                                                        google.maps.event.trigger(selectedMarker, 'click');
                                                    }



                                                });
                                                for(var i=0;i<driverMarkerArr.length;i++) {
                                                    bounds.extend(driverMarkerArr[i].getPosition());
                                                }

                                                $scope.mcOptions = {gridSize: 50, maxZoom: 20,zoomOnClick: false};

                                                if ($scope.markerClusterer) {
                                                    $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                                                }

                                                $scope.markerClusterer = new MarkerClusterer( $scope.mapContainer, driverMarkerArr,$scope.mcOptions);

                                                $scope.getfare(book.car_type);

                                                $scope.manual_drivers = true;
                                                $scope.eta_flag = 1;   //flag for showing ETA
                                                $scope.approx_value_show = 1;
                                                $scope.approx_price = 0;
                                                $scope.eta = parseFloat((data.nearest_time / 60).toFixed(2));
                                                $scope.fare_factor = data.fare_factor;

                                                if ($scope.info.chosenPlace != "" || $scope.info.chosenPlace != undefined) {

                                                    $scope.pickUpLocationOnMarker($scope.info); //getting values of lat long from function

                                                }

                                                if (!(angular.isUndefined($scope.info.dropOffPlace)) && $scope.info.dropOffPlace!="") {

                                                    $scope.dropOffLocationOnMarker($scope.info, 1); //getting values of lat long from function

                                                }


                                                driverList.forEach(function (column) {
                                                    var d = {};

                                                    d.user_id = column.user_id;
                                                    d.user_name = column.user_name;
                                                    d.distance = parseFloat((column.distance * 0.000621371).toFixed(4));
                                                    d.phone_no = column.phone_no;

                                                    dataArray.push(d);
                                                });

                                                $scope.$apply(function () {
                                                    $scope.list = dataArray;

                                                    // Define global instance we'll use to destroy later
                                                    var dtInstance;
                                                    $timeout(function () {
                                                        if (!$.fn.dataTable)
                                                            return;
                                                        dtInstance = $('#datatable2').dataTable({
                                                            'paging': true, // Table pagination
                                                            'ordering': true, // Column ordering
                                                            'info': true, // Bottom left status text
                                                            "bDestroy": true,
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
                                                    $scope.$on('$destroy', function () {
                                                        dtInstance.fnDestroy();
                                                        $('[class*=ColVis]').remove();
                                                    });
                                                });


                                            }
                                            else {
                                                $scope.displaymsg = "Sorry, All our drivers are currently busy. We are unable to offer you services right now. Please try again sometime later.";

                                                ngDialog.open({
                                                    template: 'display_msg_modalDialog',
                                                    className: 'ngdialog-theme-default',
                                                    showClose: false,
                                                    scope: $scope
                                                });
                                            }


                                        });
                                }
                                else {
                                    $scope.displaymsg = "Pick up location is not valid";

                                    ngDialog.open({
                                        template: 'display_msg_modalDialog',
                                        className: 'ngdialog-theme-default',
                                        showClose: false,
                                        scope: $scope
                                    });
                                }
                            });
                        }
                        else if ($scope.book_type == true) {//automatic booking

                            if (!$scope.time_value) {//present booking

                                // $scope.getfare(book.car_type);
                                //lat long of drop_off location
                                if (book.dropOffPlace) {
                                    (new google.maps.Geocoder()).geocode({
                                        'address': book.dropOffPlace
                                    }, function (results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            $scope.ride.manual_destination_address = book.dropOffPlace;
                                            $scope.ride.manual_destination_latitude = results[0].geometry.location.lat();
                                            $scope.ride.manual_destination_longitude = results[0].geometry.location.lng();


                                        }
                                    })
                                }

                                //$scope.show_map = true;

                                //get lat and long from address
                                //google map api hit
                                (new google.maps.Geocoder()).geocode({
                                    'address': address
                                }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {

                                        $.post(MY_CONSTANT.url_booking + '/start_app_using_access_token', $scope.booking
                                        ).then(
                                            function (data) {
                                                data = JSON.parse(data);

                                                if ((data.status.flag == 130 || data.status.flag == 131) && (data.last_ride == null || !data.last_ride.engagement_id)) {
                                                    //$scope.book_ride = true;
                                                    $scope.rideText = "Book";
                                                    $scope.ride_function = false;
                                                    //setting drivers markers
                                                    var driverList = data.drivers.data;

                                                    driverMarkerArr = [];
                                                    driverList.forEach(function (column) {
                                                        createDriverMarker(column)

                                                        $scope.openInfoWindow = function (e, selectedMarker) {
                                                            e.preventDefault();
                                                            google.maps.event.trigger(selectedMarker, 'click');
                                                        }



                                                    });
                                                    $scope.mcOptions = {gridSize: 50, maxZoom: 20,zoomOnClick: false};

                                                    if ($scope.markerClusterer) {
                                                        $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                                                    }

                                                    $scope.markerClusterer = new MarkerClusterer( $scope.mapContainer, driverMarkerArr,$scope.mcOptions);
                                                    //end drivers markers
                                                    $scope.eta = parseFloat((data.drivers.nearest_time / 60).toFixed(2));
                                                    $scope.fare_factor = data.drivers.fare_factor;
                                                    $scope.eta_flag = 1;   //flag for showing ETA
                                                    $scope.approx_value_show = 1;
                                                    $scope.approx_price = 0;

                                                    if ($scope.info.chosenPlace != "" || $scope.info.chosenPlace != undefined) {

                                                        $scope.pickUpLocationOnMarker($scope.info); //getting values of lat long from function

                                                    }

                                                    if (!(angular.isUndefined($scope.info.dropOffPlace)) && $scope.info.dropOffPlace!="" ) {

                                                        $scope.dropOffLocationOnMarker($scope.info, 1); //getting values of lat long from function

                                                    }
                                                    if ($scope.info.promo_code) {   //if promocode is applied in case of automatic booking
                                                        $.post(MY_CONSTANT.url_booking + '/redeem_promotion', {
                                                            access_token: $scope.info.access_token,
                                                            promo_code: $scope.info.promo_code
                                                        }, function (data) {
                                                            data = JSON.parse(data);
                                                            if (data.flag == 450) {
                                                                $scope.promosuccessMsg = data.message;
                                                                $scope.TimeOutSuccessError();
                                                                $scope.bookRide(book);
                                                            }
                                                            else if (data.error) {
                                                                $scope.promoerrorMsg = data.error;
                                                                $scope.TimeOutSuccessError();
                                                            }
                                                            else {
                                                                $scope.promoerrorMsg = data.message;
                                                                $scope.TimeOutSuccessError();
                                                            }
                                                            $scope.$apply();


                                                        });
                                                    }
                                                    else {
                                                        $scope.bookRide(book);
                                                    }


                                                }
                                                else {
                                                    $scope.displaymsg = "Complete your previous ride first";
                                                    ngDialog.open({
                                                        template: 'display_msg_modalDialog',
                                                        className: 'ngdialog-theme-default',
                                                        showClose: false,
                                                        scope: $scope
                                                    });
                                                }
                                                $scope.$apply();

                                            });
                                    }
                                    else {
                                        $scope.displaymsg = "Pick up location is not valid";

                                        ngDialog.open({
                                            template: 'display_msg_modalDialog',
                                            className: 'ngdialog-theme-default',
                                            showClose: false,
                                            scope: $scope
                                        });
                                    }
                                });
                                //end of google map api hit

                            }
                            else {//for later booking

                                if ($scope.info.promo_code) {   //if promocode is applied in case of later booking
                                    $.post(MY_CONSTANT.url_booking + '/redeem_promotion', {
                                        access_token: $scope.info.access_token,
                                        promo_code: $scope.info.promo_code
                                    }, function (data) {
                                        data = JSON.parse(data);
                                        if (data.flag == 450) {
                                            $scope.promosuccessMsg = data.message;
                                            $scope.TimeOutSuccessError();
                                            $scope.bookRideLater(book);
                                        }
                                        else if (data.error) {
                                            $scope.promoerrorMsg = data.error;

                                            $scope.TimeOutSuccessError();
                                        }
                                        else {
                                            $scope.promoerrorMsg = data.message;
                                            $scope.TimeOutSuccessError();
                                        }
                                        $scope.$apply();



                                    });


                                }
                                else {
                                    $scope.bookRideLater(book);
                                }
                            }
                        }
                    }


                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to get contact no -------------------------------------
                 --------------------------------------------------------------------------*/
                $scope.getContactNumber = function (val) {
                    return $.post(MY_CONSTANT.url + '/searchcustomer_from_phonenumber', {
                        access_token: localStorage.getItem('access_token'),
                        phone_no: val
                    }).then(function (res) {
                        res = JSON.parse(res);
                        var addresses = [];
                        angular.forEach(res.data.customer_info, function (item) {
                            //addresses.push(item.phone_no);
                            var image = item.user_image;
                            addresses.push(item.user_name + "(" + item.phone_no + "," + item.user_email + ")" + '<img src= '+image+' style="width:30px;float:left;margin-right: 2px;"/><div style="clear:both"></div>');
                        });
                        return addresses;
                    });
                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to cal setData Fn on enter key ------------------------
                 --------------------------------------------------------------------------*/
                $scope.checkEnterKey = function (event, phone_no) {
                    $scope.info.car_type = "";
                    $scope.info.user_name = "";
                    $scope.info.user_email = "";
                    $scope.info.phone_no="";
                    if (event.charCode == 13)
                        $scope.setData(phone_no);
                }

                /*--------------------------------------------------------------------------
                 * --------- funtion on select 'contact no' to get details------------------
                 --------------------------------------------------------------------------*/
                $scope.setData = function (val) {
                    var newVal = "";

                    if(val.split("(").length > 1)
                    {
                        newVal = val.split("(")[1].split(")")[0].split(",")[1];
                    }else
                    {
                        newVal =    val.split("(")[0];
                    }

                    $("#pick_up_time").val("");
                    $scope.info.car_type = "";

                    $scope.show_form = false;
                    $scope.show_driver_flag = false;
                    $scope.book_ride = false;
                    $scope.show_map = false;

                    if (val == "" || val == undefined) {
                        $scope.displaymsg = "Please enter customer details.";
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }
                    //else if(isNaN(val) && (!regex.test(val))){
                    //    $scope.displaymsg = "This customer is not registered with us.";
                    //    $scope.newReg.phone_no = ""
                    //    ngDialog.open({
                    //        template: 'display_new_reg_msg_modalDialog',
                    //        className: 'ngdialog-theme-default',
                    //        showClose: false,
                    //        scope: $scope,
                    //        preCloseCallback: function () {
                    //            $scope.asyncSelected="";
                    //            return true;
                    //        }
                    //    });
                    //}
                    else {
                        return $.post(MY_CONSTANT.url + '/searchcustomer_from_phonenumber', {
                            access_token: localStorage.getItem('access_token'),
                            phone_no: newVal

                        }).then(function (response) {
                            response = JSON.parse(response);

                            if (response.status == 200) {

                                var length = response.data.customer_info.length;
                                if (length) {
                                    var addresses = [];
                                    angular.forEach(response.data.customer_info, function (item) {
                                        addresses.push(item);
                                    });


                                    $scope.show_form = true;

                                    $scope.$apply(function () {
                                        $scope.asyncSelected = addresses[0].phone_no,
                                            $scope.info.user_name = addresses[0].user_name,
                                            $scope.info.user_email= addresses[0].user_email,
                                            $scope.info.user_id = addresses[0].user_id,
                                            $scope.info.access_token= addresses[0].access_token
                                        $scope.user_id = addresses[0].user_id;
                                        $scope.customer_access_token = addresses[0].access_token;

                                    });
                                }
                                else {

                                    $scope.displaymsg = "This customer is not registered with us.";
                                    //$scope.newReg.phone_no = val


                                    ngDialog.open({
                                        template: 'display_new_reg_msg_modalDialog',
                                        className: 'ngdialog-theme-default',
                                        showClose: false,
                                        scope: $scope
                                    });
                                }
                            }
                            else if (response.flag == 1) {  //in case of blocked user
                                $scope.displaymsg = response['error'];

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                            }
                            else if (response.status == 401) {
                                $scope.displaymsg = response['message'];

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                            } else if (response.status == 500) {
                                $scope.displaymsg = "Something went wrong, please try again later.";

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                            }
                        });
                    }

                }

                /*--------------------------------------------------------------------------
                 * --------- funtion to book ride ------------------------------------------
                 --------------------------------------------------------------------------*/
                $scope.bookRide = function (val) {
                    $scope.bookRideTimerFunction(val, 0);

                    $scope.interval_time = setInterval(function () {

                        $scope.bookRideTimerFunction(val, 1);
                    }, 20000);

                    $scope.cancel_interval_time = setTimeout(function () {
                        clearInterval($scope.interval_time);
                        $scope.rideText = "Book";
                        $scope.ride_function = true;
                        $scope.$apply();
                    }, 180001);
                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to book ride for a particular driver ------------------
                 --------------------------------------------------------------------------*/
                $scope.sendDriverRequestTimer = function (driver_id, flag) {

                    var len = driver_id.length;
                    var j = "";
                    for(var i=0;i<len-1;i++){
                        j += driver_id[i] + ",";
                    }
                    j += driver_id[len-1];

                    $scope.ride.access_token = $scope.info.access_token;


                    $scope.ride.car_type = $scope.info.car_type;

                    $scope.ride.duplicate_flag = flag;
                    $scope.ride.admin_panel_request_flag = 1;
                    $scope.ride.list_drivers = j;

                    $scope.ride.latitude = $scope.booking.latitude;
                    $scope.ride.longitude = $scope.booking.longitude;
                    $scope.ride.timezone_offset = offset;


                    $.post(MY_CONSTANT.url_booking + '/request_ride', $scope.ride
                    ).then(
                        function (data) {
                            data = JSON.parse(data);
                            if (data.flag == 105) {
                            }
                            else if (data.flag == 106) {//no driver available
                                $scope.displaymsg = data.log;
                                $scope.ride_function = false;
                                $scope.rideText = "Book";

                                $scope.manual_drivers = false;
                                //clearInterval($scope.interval_for_particular_driver);
                                $interval.cancel($scope.interval_for_particular_driver);
                                $interval.cancel($scope.cancel_interval_time_driver);
                                $scope.manualDriverArray = [];

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                            }
                            else if (data.flag == 107) {//accepted
                                $scope.ride_function = false;
                                $scope.rideText = "Book";
                                //clearInterval($scope.interval_for_particular_driver);
                                $interval.cancel($scope.interval_for_particular_driver);
                                $interval.cancel($scope.cancel_interval_time_driver);
                                $scope.manualDriverArray = [];

                                $scope.manual_drivers = false;
                                $scope.displaymsg = "Ride Accepted.";
                                $scope.driver_data.user_name = data.user_name;
                                $scope.driver_data.phone = data.phone;
                                $scope.driver_data.car_no = data.car_no;
                                $scope.driver_data.status = "Ride Accepted";
                                $scope.driver_data.img_src = data.user_pic;
                                $scope.show_driver_flag = true;

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });

                            }
                            else if (data.flag == 114) {//started
                                $scope.ride_function = false;
                                $scope.rideText = "Book";
                                //clearInterval($scope.interval_for_particular_driver);
                                $interval.cancel($scope.interval_for_particular_driver);
                                $interval.cancel($scope.cancel_interval_time_driver);
                                $scope.manualDriverArray = [];
                                $scope.displaymsg = "Ride Started";
                                $scope.manual_drivers = false;
                                $scope.driver_data.user_name = data.user_name;
                                $scope.driver_data.phone = data.phone;
                                $scope.driver_data.car_no = data.car_no;
                                $scope.driver_data.img_src = data.user_pic;
                                $scope.driver_data.status = "Ride Started";
                                $scope.show_driver_flag = true;

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                            }
                            $scope.$apply();

                        });
                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to book ride (20 sec) ---------------------------------
                 --------------------------------------------------------------------------*/
                $scope.bookRideTimerFunction = function (val, flag) {

                    $scope.successMsg = '';
                    $scope.errorMsg = '';
                    $scope.ride.access_token = val.access_token;

                    $scope.ride.latitude = '';
                    $scope.ride.longitude = '';
                    $scope.ride.car_type = val.car_type;
                    $scope.ride.duplicate_flag = flag;
                    $scope.ride.admin_panel_request_flag = 1;

                    var address = val.chosenPlace;

                    $scope.ride.latitude = $scope.booking.latitude;
                    $scope.ride.longitude = $scope.booking.longitude;
                    $scope.ride.timezone_offset = offset;


                    $.post(MY_CONSTANT.url_booking + '/request_ride', $scope.ride
                    ).then(
                        function (data) {
                            data = JSON.parse(data);
                            if (data.flag == 105) {
                                $scope.rideText = "Processing";
                                $scope.ride_function = true;
                            }
                            else if (data.flag == 106) {//no driver available
                                $scope.displaymsg = data.log;

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                                $scope.rideText = "Book";
                                $scope.ride_function = false;
                                clearInterval($scope.interval_time);
                                clearInterval($scope.cancel_interval_time);
                            }
                            else if (data.flag == 107) {//accepted
                                clearInterval($scope.interval_time);
                                clearInterval($scope.cancel_interval_time);
                                $scope.displaymsg = data.log;

                                $scope.driver_data.user_name = data.user_name;
                                $scope.driver_data.phone = data.phone;
                                $scope.driver_data.car_no = data.car_no;
                                $scope.driver_data.img_src = data.user_pic;
                                $scope.driver_data.status = "Ride Accepted";

                                $scope.rideText = "Book";
                                $scope.ride_function = true;

                                $scope.show_driver_flag = true;
                                //$scope.clearData();

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                            }
                            else if (data.flag == 114) {//started
                                clearInterval($scope.interval_time);
                                clearInterval($scope.cancel_interval_time);
                                $scope.displaymsg = data.log;

                                $scope.driver_data.user_name = data.user_name;
                                $scope.driver_data.phone = data.phone;
                                $scope.driver_data.car_no = data.car_no;
                                $scope.driver_data.img_src = data.user_pic;
                                $scope.driver_data.status = "Ride Started";
                                //$scope.clearData();


                                $scope.show_driver_flag = true;
                                $scope.rideText = "Book";
                                $scope.ride_function = true;

                                ngDialog.open({
                                    template: 'display_msg_modalDialog',
                                    className: 'ngdialog-theme-default',
                                    showClose: false,
                                    scope: $scope
                                });
                            }
                            $scope.$apply();

                        });
                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to book ride later ------------------------------------
                 --------------------------------------------------------------------------*/
                $scope.bookRideLater = function (val) {


                    $scope.eta_flag = 0;   //flag for showing ETA
                    $scope.approx_value_show = 0;//flag for showing hr tag
                    $scope.approx_price = 0; //flag for estimated price


                    $scope.book_ride_later_data.car_type = val.car_type;
                    $scope.book_ride_later_data.chosenPlace = val.chosenPlace;
                    $scope.book_ride_later_data.latitude = $scope.booking.latitude;
                    $scope.book_ride_later_data.longitude = $scope.booking.longitude;
                    $scope.book_ride_later_data.manual_destination_address = val.dropOffPlace;
                    $scope.book_ride_later_data.further_info = val.further_info;

                    var address = val.dropOffPlace;
                    var pickUpAddress = val.chosenPlace;


                    (new google.maps.Geocoder()).geocode({
                        'address': pickUpAddress
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {

                            //google api hit for drop-off location
                            (new google.maps.Geocoder()).geocode({
                                'address': address
                            }, function (results, status) {

                                if (status == google.maps.GeocoderStatus.OK) {
                                    if ($scope.book_ride_later_data.manual_destination_latitude == '' || $scope.book_ride_later_data.manual_destination_latitude == undefined) {
                                        $scope.book_ride_later_data.manual_destination_latitude = results[0].geometry.location.lat();
                                        $scope.book_ride_later_data.manual_destination_longitude = results[0].geometry.location.lng();

                                    }

                                    if ($("#pick_up_time").val() == '') {
                                        $scope.displaymsg = "Please select pick-up time";

                                        ngDialog.open({
                                            template: 'display_msg_modalDialog',
                                            className: 'ngdialog-theme-default',
                                            showClose: false,
                                            scope: $scope
                                        });
                                    }
                                    else {

                                        var DATE = new Date($("#pick_up_time").val());
                                        pick = DATE.toUTCString();
                                        $scope.book_ride_later_data.pickup_time = pick;

                                        ngDialog.close({
                                            template: 'pick_up_modal',
                                            className: 'ngdialog-theme-default',
                                            //showClose: false,
                                            scope: $scope
                                        });

                                        $scope.book_ride_later_data.user_id = $scope.user_id;
                                        $scope.BookLaterApiHit();  //calling same api hit for book later
                                    }
                                }
                                else {
                                    $scope.book_ride_later_data.manual_destination_latitude = '';
                                    $scope.book_ride_later_data.manual_destination_longitude = '';
                                    if ($("#pick_up_time").val() == '') {
                                        $scope.displaymsg = "Please select pick-up time";

                                        ngDialog.open({
                                            template: 'display_msg_modalDialog',
                                            className: 'ngdialog-theme-default',
                                            showClose: false,
                                            scope: $scope
                                        });
                                    }
                                    else {
                                        var DATE = new Date($("#pick_up_time").val());
                                        pick = DATE.toUTCString();
                                        $scope.book_ride_later_data.pickup_time = pick;
                                        ngDialog.close({
                                            template: 'pick_up_modal',
                                            className: 'ngdialog-theme-default',
                                            //showClose: false,
                                            scope: $scope
                                        });

                                        //$scope.book_ride_later_data.access_token = $scope.customer_access_token;

                                        $scope.book_ride_later_data.user_id = $scope.user_id;
                                        $scope.BookLaterApiHit();


                                    }
                                }
                            });
                            //end of google api hit for drop-off location


                        } else {
                            $scope.displaymsg = "Pick up location is not valid";

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
                 * --------- funtion for booklaterapi  ----------------------------------
                 --------------------------------------------------------------------------*/
                $scope.BookLaterApiHit = function () {

                    $.post(MY_CONSTANT.url_booking + '/insert_pickup_schedule', $scope.book_ride_later_data
                    ).then(
                        function (response) {
                            response = JSON.parse(response);

                            if (response.error) {
                                $scope.displaymsg = response.error;

                            }
                            else {
                                $scope.displaymsg = response.message;


                            }
                            ngDialog.open({
                                template: 'display_msg_modalDialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        });

                }


                /*--------------------------------------------------------------------------
                 * --------- funtion for new registraion  ----------------------------------
                 --------------------------------------------------------------------------*/
                $scope.NewRegistration = function (newReg) {
                    $scope.data1=newReg.email;
                    console.log('lenght',$scope.data1.length);
                    if($scope.data1[0]=='1' || $scope.data1[0]=='2' || $scope.data1[0]=='3'|| $scope.data1[0]=='0'|| $scope.data1[0]=='4' ||$scope.data1[0]=='5' || $scope.data1[0]=='6' || $scope.data1[0]=='7'|| $scope.data1[0]=='8' || $scope.data1[0]=='9')
                    {
                        $scope.newReg.errorMsg = 'Email Id is invalid';
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.newReg.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                        return;
                    }
                    else
                    {


                        // $scope.time_msg = true;
                        $scope.newReg = newReg;
                        $scope.newReg.ph_no = "+" + $scope.newReg.phone_no;
                        if ($scope.newReg.email == '' || $scope.newReg.email == undefined) {

                            $scope.newReg.email = $scope.newReg.phone_no + "@domain.com";
                        }

                        $scope.newReg.latitude = '0.000';
                        $scope.newReg.longitude = '0.000';
                        $scope.newReg.country = countryName.NAME;
                        $scope.newReg.access_token = localStorage.getItem('access_token');
                        $.post(MY_CONSTANT.url + '/register_a_user', $scope.newReg
                        ).then(
                            function (response) {
                                response = JSON.parse(response);

                                if (response.status == 200) {
                                    $scope.setData($scope.newReg.phone_no);
                                    $scope.asyncSelected = $scope.newReg.phone_no;
                                    ngDialog.close({
                                        template: 'reg_modal',
                                        className: 'ngdialog-theme-default',
                                        scope: $scope
                                    });
                                }
                                else if (response.status == 401) {
                                    $scope.displaymsg = response['message'];
                                    ngDialog.close({
                                        template: 'reg_modal',
                                        className: 'ngdialog-theme-default',
                                        scope: $scope
                                    });
                                    ngDialog.open({
                                        template: 'display_msg_modalDialog',
                                        className: 'ngdialog-theme-default',
                                        showClose: false,
                                        scope: $scope
                                    });
                                } else if (response.status == 500) {
                                    $scope.displaymsg = "Something went wrong, please try again later.";
                                    ngDialog.close({
                                        template: 'reg_modal',
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
                    }
                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to display common msg  --------------------------------
                 --------------------------------------------------------------------------*/
                $scope.refreshPage = function () {
                    ngDialog.close({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                };

                /*--------------------------------------------------------------------------
                 * --------- funtion to open new reg modal  --------------------------------
                 --------------------------------------------------------------------------*/
                $scope.openNext = function () {

                    ngDialog.close({
                        template: 'display_new_reg_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });

                    ngDialog.open({
                        template: 'reg_modal',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        preCloseCallback: function () {
                            $scope.newReg.user_name = '';
                            $scope.newReg.phone_no = '';
                            $scope.newReg.email = '';
                            return true;
                        }
                    });
                };

                //time out error function
                $scope.TimeOutError = function (msg) {
                    setTimeout(function () {
                        $scope.errorMsg = "";
                        $scope.$apply();
                    }, 3000);

                }
                //timeout error  function for promo success message
                $scope.TimeOutSuccessError = function () {
                    setTimeout(function () {
                        $scope.promosuccessMsg = "";
                        $scope.promoerrorMsg = "";
                        $scope.$apply();
                    }, 3000);

                }

    }
})();