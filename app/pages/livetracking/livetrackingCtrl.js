(function () {
    'use strict';
    angular.module('BlurAdmin.pages.livetracking')
        .controller('livetrackingCtrl', livetrackingCtrl)
    function livetrackingCtrl($timeout, $mdSidenav, $log, $rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter, socketFactory, toastr, $window, $interval) {

        var rightPanelInterval;

        $rootScope.showloader = false;
        $scope.expand = 1;
        $scope.showim = 0;
        $scope.select = {};

        //socket init
        var token = localStorage.getItem('access_token');
        console.log(token);
        socketFactory.init();
        console.log('$window.socket',$window.socket)
        $window.socket.emit('auth', {user_type: 'admin', access_token: token});

        $scope.check = function (id) {
            console.log(id);
            var ids = 'object-' + id;
            console.log(ids);
            $scope.showim = !$scope.showim;
            console.log($scope.showim);
            if ($scope.showim == '0') {
                console.log("Working");
                $scope.collapseDisc();

            }
        }
        $scope.togRight = function (daa) {
            console.log(daa);
            ngDialog.open({
                template: 'driverDetails',
                className: 'ngdialog-theme-default',
                //showClose: false,
                scope: $scope
            });
            $scope.driver_image = daa.driver_image;
            $scope.driver_mobile = daa.driver_mobile;
            $scope.driver_name = daa.driver_name;
            $scope.driver_email = daa.driver_email;
            $scope.device_name = daa.device_name;
            $scope.car_name = daa.car_name;
            $scope.car_no = daa.car_no;
        }

        $scope.expandDisc = function (daa) {
            $('#expandedDiv').css("transform", "translate(92.5%)");
            $('#expandedDiv').css("transition", "1s");
            $('#expandedDiv').css("left", "4.5%");
            //Trip_Detail
            $scope.pickup_location_address = daa.pickup_location_address;
            $scope.manual_destination_address = daa.manual_destination_address;
            $scope.driver_name = daa.driver_name;
            $scope.car_name = daa.car_name;
            $scope.driver_mobile = daa.driver_mobile;
            $scope.fare_calculated = "$" + daa.fare_calculated;

            if (daa.hasOwnProperty("fare_calculated"));
            {
                $scope.fare_calculated = "$" + daa.fare_calculated;
            }
            if (daa.hasOwnProperty("daa.fare_calculated") == false);
            {
                $scope.fare_calculated = "Unavailable";
            }
            if (daa.hasOwnProperty("session_id")) {
                $scope.tripnumber = "Trip Number: #" + daa.session_id;
            }
            if (daa.hasOwnProperty("session_id") == false) {
                $scope.tripnumber = "Trip Number:Unavailable";
            }

            //Customer
            $scope.user_name = daa.user_name;
            $scope.user_id = daa.user_id;
            $scope.user_rating = daa.user_rating;
            $scope.user_mobile = daa.user_mobile;
            $scope.user_email = daa.user_email;
            $scope.user_image = daa.user_image;
        }
        $scope.collapseDisc = function () {
            $scope.expand = 1;
            // $('#mapCustom').css("margin-left","18%");
            $('#mapCustom').addClass('col-lg-12');
            $('#expandedDiv').css("transform", "translate(-200%)");
            $('#expandedDiv').css("transition", "1s");

        }

        // $scope.$watch(function(){
        //     return $scope.select.selectedIndex;
        // },function(newVal){
        //     $interval.cancel(rightPanelInterval);
        //     rightPanelInterval = $interval(function () {
        //         switch (newVal){
        //             case 0 : socketFactory.emit('availableDrivers', {offset:0,limit:10,action:0});
        //                 break;
        //             case 1 : socketFactory.emit('busyDrivers', {offset:0,limit:10,action:0});
        //                 break;
        //             case 2 : socketFactory.emit('allDrivers', {offset:0,limit:10,action:0});
        //                 break;
        //         }
        //     },2000)
        // });

        var markers = [];
        //var location = {lat: 30,lng: 50}
        function setMarker (driverData, { image, infowindow, rotation }){
            var driverMarker = _.find(markers,{'driver_id':driverData.driver_id});
            var location = new google.maps.LatLng(driverData.current_location_latitude , driverData.current_location_longitude);

            var marker;
            if(driverMarker){
                driverMarker.marker.setPosition(location)
                marker = driverMarker.marker;
            }else{
                marker = new google.maps.Marker({
                    position: location,
                    icon: image,
                    map: map,
                    //rotation: rotation,
                    infoWindow: infowindow
                });
                marker.addListener('click', function () {
                    this.infoWindow.open(map, this);
                });
                markers.push({
                    driver_id:driverData.driver_id,
                    marker: marker
                })
            }
            //location.lat++;
            //location.lng++;
            return marker;
        }



        /*--- Right Side Detail Panel STARTS--*/
        $scope.expand1 = 1;
        var rotation = 0;

        // Sockets Implementation Start Here.
        socketFactory.on('auth', function(data) {
            //console.log('datadata', data);

            socketFactory.emit('counterRides', {action: 0, region_id:0});
            socketFactory.emit('ongoingRides', {action: 0, region_id:0});
            socketFactory.emit('availableDrivers', {offset:0,limit:10,action:0});
            socketFactory.emit('busyDrivers', {offset:0,limit:10,action:0});
            socketFactory.emit('offlineDrivers', {offset:0,limit:10,action:0});
            socketFactory.emit('allDrivers', {offset:0,limit:10,action:0});

            if(data[0].flag==true)
            {
                $interval(function(){
                    socketFactory.emit('counterRides', {action: 0, region_id:0});
                    socketFactory.emit('ongoingRides', {action: 0, region_id:0});
                    //socketFactory.emit('completedRides', {action: 0, region_id:0, limit:5});
                    //socketFactory.emit('scheduledRides', {action: 0, region_id:0});
                    socketFactory.emit('availableDrivers', {offset:0,limit:10,action:0});
                    socketFactory.emit('busyDrivers', {offset:0,limit:10,action:0});
                    socketFactory.emit('offlineDrivers', {offset:0,limit:10,action:0});
                    socketFactory.emit('allDrivers', {offset:0,limit:10,action:0});
                },2000)

                socketFactory.on('counterRides', function(data) {
                    //console.log('datadatadatadatadatadata', data);
                    $scope.sock1=data[0].data;
                    $scope.totalItemsOngoing=$scope.sock1.ONGOING;
                    $scope.totalItemsScheduled=$scope.sock1.SCHEDULED;
                    $scope.totalItemsCompleted=$scope.sock1.COMPLETED;
                });

                socketFactory.on('ongoingRides', function(data) {
                    //console.log('data in ongoing',data);
                    $scope.sockog=data[0].data.paginated_rides;
                    $scope.onGoingRidePag=$scope.sockog;
                });

                socketFactory.on('completedRides', function(data) {
                    //console.log('data in Completed',data);
                    $scope.sockoc=data[0].data.paginated_rides;
                    $scope.completedRides=$scope.sockoc;
                });

                socketFactory.on('scheduledRides', function(data) {
                    //console.log('data in Scheduled',data);
                    $scope.sockos=data[0].data.paginated_schedules;
                    $scope.scheduled_rides=$scope.sockos;
                    $scope.p=new Array();
                    _.each($scope.sockos,function(key,value){
                        $scope.p.push(_.pick(key,'pickup_latitude','pickup_longitude'));
                    });
                    console.log('Pick',$scope.p);
                    var image = {
                        url: 'assets/img/intransit_pickup.png', // image is 512 x 512
                        scaledSize: new google.maps.Size(13, 22)
                    };
                    for(var i=0; i<$scope.p.length; i++){
                        var position = new google.maps.LatLng($scope.p[i].pickup_latitude , $scope.p[i].pickup_longitude);
                        bounds.extend(position);
                        $scope.marker1 = new google.maps.Marker({
                            position: position,
                            icon:image,
                            map: map,
                        });

                    }

                    $scope.d=new Array();
                    _.each($scope.sockos,function(key,value){
                        $scope.d.push(_.pick(key,'manual_destination_latitude','manual_destination_longitude'));
                    });
                    console.log('Des',$scope.d);

                    var image = {
                        url: 'assets/img/assigned_delivery.png',
                        scaledSize: new google.maps.Size(13, 22),
                    };
                    for(var i=0; i<$scope.d.length; i++){
                        var position = new google.maps.LatLng($scope.d[i].manual_destination_latitude , $scope.d[i].manual_destination_longitude);
                        bounds.extend(position);
                        $scope.marker2 = new google.maps.Marker({
                            position: position,
                            icon:image,
                            map: map,
                        });
                    }
                });
                // Drivers_Sockets


                socketFactory.on('availableDrivers', function(data) {
                    $scope.avail=data[0].data.paginated_drivers;
                    //console.log('available',$scope.avail);

                    if($scope.select.selectedIndex == 0 || $scope.select.selectedIndex == 3) { // for available and all
                        var image = {
                            url: 'assets/img/driver_idle.png',
                            scaledSize: new google.maps.Size(13, 22)
                        };

                        $scope.avl = new Array();
                        _.each($scope.avail, function (key, value) {
                            $scope.avl.push(_.pick(key, 'current_location_latitude', 'current_location_longitude'));
                        });
                        //console.log('Driver Data',$scope.l);
                        for (var i = 0; i < $scope.avl.length; i++) {
                            var infowindow = new google.maps.InfoWindow({
                                content: "<div>" +
                                "<span>Name</span> : <span>" + $scope.avail[i].driver_name + "</span><br>" +
                                "<span>Email</span> : <span>" + $scope.avail[i].driver_email + "</span><br>" +
                                "<span>Mobile</span> : <span>" + $scope.avail[i].driver_mobile + "</span>" +
                                "</div>"
                            });
                            setMarker($scope.avail[i], { image, infowindow, rotation })
                            //map.panTo(marker.position);
                            // marker.addListener('click', function () {
                            //     this.infoWindow.open(map, this);
                            // });
                        }
                        //rotation = rotation >= 360 ? 0 : rotation + 10;
                    }
                });


                socketFactory.on('busyDrivers', function(data) {
                    $scope.busy=data[0].data.paginated_drivers;
                    //console.log("BUSY",$scope.busy);

                    if($scope.select.selectedIndex == 1 || $scope.select.selectedIndex == 3) { // for busy and all
                        var image = {
                            url: 'assets/img/driver_intransit.png', // image is 512 x 512
                            scaledSize: new google.maps.Size(13, 23)
                        };
                        console.log(image);
                        $scope.bzy = new Array();
                        //var bounds = new google.maps.LatLngBounds();
                        _.each($scope.busy, function (key, value) {
                            $scope.bzy.push(_.pick(key, 'current_location_latitude', 'current_location_longitude'));
                        });
                        console.log(' buzy dri', $scope.bzy);
                        for (var i = 0; i < $scope.bzy.length; i++) {
                            // var position = new google.maps.LatLng($scope.bzy[i].current_location_latitude, $scope.bzy[i].current_location_longitude);
                            //bounds.extend(position);
                            var infowindow = new google.maps.InfoWindow({
                                content: "<div>" +
                                "<span>Name</span> : <span>" + $scope.busy[i].driver_name + "</span><br>" +
                                "<span>Email</span> : <span>" + $scope.busy[i].driver_email + "</span><br>" +
                                "<span>Mobile</span> : <span>" + $scope.busy[i].driver_mobile + "</span>" +
                                "</div>"
                            });
                            setMarker($scope.busy[i], { image, infowindow, rotation })
                            //map.panTo(marker.position);
                            // marker.addListener('click', function () {
                            //     this.infoWindow.open(map, this);
                            // });
                            //rotation = rotation >= 360 ? 0 : rotation + 10;
                        }
                        //$scope.select.selectedIndex == 1 && map.fitBounds(bounds);
                    }
                });

                socketFactory.on('offlineDrivers', function(data) {
                    $scope.offline=data[0].data.paginated_drivers;
                    //console.log("BUSY",$scope.busy);

                    var image = {
                        url: 'assets/img/driver_offline.png', // image is 512 x 512
                        scaledSize: new google.maps.Size(13, 23)
                    };
                    //console.log(image);
                    //$scope.bzy = new Array();
                    //var bounds = new google.maps.LatLngBounds();
                    // _.each($scope.offline, function (key, value) {
                    //     $scope.bzy.push(_.pick(key, 'current_location_latitude', 'current_location_longitude'));
                    // });
                    //console.log(' offline dri', $scope.bzy);
                    for (var i = 0; i < $scope.offline.length; i++) {
                        // var position = new google.maps.LatLng($scope.bzy[i].current_location_latitude, $scope.bzy[i].current_location_longitude);
                        //bounds.extend(position);
                        var infowindow = new google.maps.InfoWindow({
                            content: "<div>" +
                            "<span>Name</span> : <span>" + $scope.offline[i].driver_name + "</span><br>" +
                            "<span>Email</span> : <span>" + $scope.offline[i].driver_email + "</span><br>" +
                            "<span>Mobile</span> : <span>" + $scope.offline[i].driver_mobile + "</span>" +
                            "</div>"
                        });
                        setMarker($scope.offline[i], { image, infowindow, rotation })
                        //map.panTo(marker.position);
                        // marker.addListener('click', function () {
                        //     this.infoWindow.open(map, this);
                        // });
                        //rotation = rotation >= 360 ? 0 : rotation + 10;
                    }
                    //$scope.select.selectedIndex == 1 && map.fitBounds(bounds);

                });

                socketFactory.on('allDrivers', function(data) {
                    $scope.all=data[0].data.paginated_drivers;
                    //console.log('all',$scope.all);
                });




                /* -----Search Sockets Left Panel----*/


                $scope.left;
                $scope.left.selectedIndex = 1;
                $scope.searchL=function(data, id)
                {
                    if(id==0){
                        socketFactory.emit('getOngoingRides', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                        socketFactory.on('ongoingRides', function(data) {
                            //console.log('ongoing................', data)
                            $scope.sockos=data[0].data.paginated_schedules;
                            $scope.scheduled_rides=data[0].data.paginated_schedules;

                        });}
                    if(id==1)
                    {
                        socketFactory.emit('getScheduledRides', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                        socketFactory.on('scheduledRides', function(data) {
                            $scope.sockos=data[0].data.paginated_schedules;
                            $scope.scheduled_rides=data[0].data.paginated_schedules;
                        });}
                }


                /* -----Search Sockets Left Panel Ends----*/




                /* -----Search Sockets Right Panel----*/
                $scope.select.selectedIndex = 3;

                $scope.searchR=function(data, id){console.log("data is "+ data + "id "+id);
                    if(id ===0){
                        socketFactory.emit('getAvailableDrivers', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                        socketFactory.on('availableDrivers', function(data) {
                            $scope.avail=data[0].data.paginated_drivers;

                        });}
                    if(id === 1) {   console.log("data is "+ data + "id "+id);
                        socketFactory.emit('getBusyDrivers', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                        socketFactory.on('busyDrivers', function(data) {
                            $scope.busy=data[0].data.paginated_drivers;
                        });}
                    if(id === 2){     console.log("data is "+ data + "id "+id);
                        socketFactory.emit('getAllDrivers', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                        socketFactory.on('allDrivers', function(data) {
                            $scope.all=data[0].data.paginated_drivers;
                        });}}
                /* -----Search Sockets Right Panel Ends----*/


                socketFactory.on('notificationRides', function(data) {
                    //console.log('data notification ',data);
                    toastr.info('The Trip#  '+data[0].sessionId+' has been '+ data[0].status , 'Information');

                });}

        });
        $scope.$on('$destroy', function (event)
        {
            $window.socket.disconnect()
        });

        // var directionsService = new google.maps.DirectionsService;
        // var directionsDisplay = new google.maps.DirectionsRenderer;
        var bounds = new google.maps.LatLngBounds();

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.674, lng: -73.945},
            zoom: 2,
            streetViewControl: false,
            mapTypeControl: false,

            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }

        });

        // socketFactory.on('driverLocation',function (data) {
        //     var lat = data.lat, long = data.long;
        //
        // })

        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay.setMap(map);

        $scope.getDirections = function () {

            var request = {
                origin: $scope.strtloca,
                destination: $scope.mdes,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {

                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    alert('Google route unsuccesfull!');
                }

            });

        }
        //var onGoingRideInterval;
        $scope.showonm = function(data) {
            // $interval.cancel(onGoingRideInterval)
            // onGoingRideInterval = $interval(function (){
            //     socketFactory.emit('driverLocation',{session_id: data.session_id})
            // },2000);
            $scope.strtloca = data.pickup_latitude + ',' + data.pickup_longitude;
            $scope.mdes = data.manual_destination_latitude + ','+ data.manual_destination_longitude;
            $scope.getDirections();
            console.log($scope.strtloca);
            console.log( $scope.mdes);
        }

        $scope.isOpen==true;
        $scope.tog=1;

        $scope.toggleRight=function(m) {

            $scope.tog=!$scope.tog;

            if($scope.tog==0){
                $("#Nav").animate({right: '-400px'});
                $('#ffff').removeClass('fa-chevron-right').addClass('fa-chevron-left');
            }
            else if($scope.tog==1){
                $("#Nav").animate({right: '0px'});
                $('#ffff').removeClass('fa-chevron-left').addClass('fa-chevron-right');
            }
        }

        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(3);
            google.maps.event.removeListener(boundsListener);
        });
    }

})();