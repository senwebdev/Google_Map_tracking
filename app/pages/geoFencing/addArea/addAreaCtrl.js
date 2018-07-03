/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.geoFencing.addArea')
        .controller('addAreaCtrl', addAreaCtrl);
    function addAreaCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter,MapLatLong) {
            $scope.showgeoimg = true;
            $rootScope.showloader = false;
            var searchMarkers = [];
            var all_overlays = [];
            var coordinates_array = [];
            var polygonArray = []
            var str_coordinates = '';
            var bounds = new google.maps.LatLngBounds();   //defining bounds
            var infoWindow = new google.maps.InfoWindow();   //defining infowindow
            var drawingManager;
            /*if($.cookie('geoseen') == 0){
                $scope.showgeoimg = true;
                $.cookie('geoseen',1);
            }
            else{
                $scope.showgeoimg = false;

            }*/
            $scope.areaName = '';
            $scope.show_add_area_btn = 0;
            $scope.show_add_areaname_btn = 0;
            $scope.hideLayer = function(){
                $scope.showgeoimg = false;
            };
            $scope.initMap =  function() {
                $scope.map = {
                    zoom: 8,
                    center: new google.maps.LatLng(MapLatLong.lat, MapLatLong.lng),
                    pan: true,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position:google.maps.ControlPosition.LEFT_TOP
                    },
                    mapTypeId:google.maps.MapTypeId.ROADMAP,
                    fullscreenControl:true,
                    fullscreenControlOptions: {
                        position:google.maps.ControlPosition.LEFT_TOP
                    },
                    styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
                }
                var input = document.getElementById('pac-input');
                var searchBox = new google.maps.places.SearchBox(input);
                $scope.mapContainer = new google.maps.Map(document.getElementById('areaMap'), $scope.map);
                // Create the search box and link it to the UI element.

                // Bias the SearchBox results towards current map's viewport.
                $scope.mapContainer.addListener('bounds_changed', function () {
                    searchBox.setBounds($scope.mapContainer.getBounds());
                });
                //showig added regions on map
                $.post(MY_CONSTANT.url + '/get_all_regions', {
                    access_token: localStorage.getItem('access_token')

                },function (data) {
                    $scope.showloader = false;
                    var dataArray = [];
                    var excelArray = [];
                    if (typeof(data) == "string")
                        data = JSON.parse(data);

                    if (data.flag == 101) {
                        $state.go('page.login');
                    }
                    else if (data.flag == 1503) {
                        console.log(data);
                        var boundsArray = [];
                        var areaList = data.regions;
                        areaList.forEach(function (column) {
                            polygonArray = [];
                            var polygon = column.region_path_string.split(', ');
                            for (var j = 0; j < (polygon.length - 1); j++) {
                                polygon[j] = polygon[j].split(" ");
                                polygonArray.push({
                                    lat: parseFloat(polygon[j][0]), lng: parseFloat(polygon[j][1])
                                })
                                var areaBounds = new google.maps.LatLng(parseFloat(polygon[j][0]), parseFloat(polygon[j][1]));
                                bounds.extend(areaBounds);
                            }
                            var shape = new google.maps.Polygon({
                                paths: polygonArray,
                                map: $scope.mapContainer,
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: 0.35
                            });
                            shape.content = '<div class="infoWindowContent">' +
                                '<center><b>Region Name</b></center>' +
                                '<span> ' + column.region_name + '</span><br>'
                            '</div>';
                            google.maps.event.addListener(shape, 'click', function (event) {
                                infoWindow.setContent(shape.content);
                                infoWindow.setPosition(event.latLng);
                                infoWindow.open($scope.mapContainer,shape);
                            });
                            $scope.mapContainer.fitBounds(bounds);
                            shape.setMap($scope.mapContainer);

                        });

                    }
                });
                searchBox.addListener('places_changed', function () {
                    var places = searchBox.getPlaces();
                    if (places.length == 0) {
                        return;
                    }

                    // Clear out the old markers.
                    searchMarkers.forEach(function (marker) {
                        marker.setMap(null);
                    });
                    searchMarkers = [];

                    // For each place, get the icon, name and location.
                    var bounds = new google.maps.LatLngBounds();
                    places.forEach(function (place) {
                        var icon = {
                            url: place.icon,
                            size: new google.maps.Size(71, 71),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(25, 25)
                        };

                        // Create a marker for each place.
                        searchMarkers.push(new google.maps.Marker({
                            map: $scope.mapContainer,
                            icon: icon,
                            title: place.name,
                            position: place.geometry.location
                        }));

                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    $scope.mapContainer.fitBounds(bounds);
                });
                // [END region_getplaces]

                drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.MARKER,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                            //google.maps.drawing.OverlayType.MARKER,
                            //google.maps.drawing.OverlayType.CIRCLE,
                            google.maps.drawing.OverlayType.POLYGON,
                            //google.maps.drawing.OverlayType.POLYLINE,
                            //google.maps.drawing.OverlayType.RECTANGLE
                        ]
                    },
                    // markerOptions: {icon: 'app/img/freeDriver.png'},
                    circleOptions: {
                        fillColor: '#909fa7',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        clickable: false,
                        editable: true,
                        zIndex: 1
                    }
                });
                drawingManager.setMap($scope.mapContainer);
                drawingManager.setDrawingMode(null);   //on load disabling the default tool for drawing
                //getting latlongs on overlay complete
                google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                    all_overlays.push(event);
                    coordinates_array = [];
                    drawingManager.setMap(null);
                    if (event.type == google.maps.drawing.OverlayType.POLYGON) {
                        // Switch back to non-drawing mode after drawing a shape.
                        drawingManager.setDrawingMode(null);    //hiidng the drawing tool aftre completion of polygon
                        var length = event.overlay.getPath().length;
                        event.overlay.getPath().forEach(function(data){
                            var latlong = data.lat() + " " + data.lng();
                            coordinates_array.push(latlong)
                        });
                        $scope.latLongArrayList(coordinates_array);
                        //if(google.maps.geometry.poly.containsLocation(event.latLng, polygonArray) == true) {
                        //    alert("yes");
                        //}
                    }
                });
            }
            //REMOVING SHAPE ON CLICK
            $scope.removeShape = function () {
                coordinates_array = [];
                $scope.areaName = "";
                str_coordinates = '';
                for (var i = 0; i < all_overlays.length; i++) {
                    all_overlays[i].overlay.setMap(null);   //removing d alraedy drwan polygon
                }
                all_overlays = [];
                $scope.show_add_area_btn = 0;
                $scope.show_add_areaname_btn = 0;
                drawingManager.setMap($scope.mapContainer)
                drawingManager.setOptions({
                    drawingControl: true
                });

            };
        $scope.latLongArrayList = function (coordinates_array) {
                str_coordinates = '';
                var arr_len = coordinates_array.length;
                console.log(coordinates_array);
                //coordinates_array = coordinates_array.toString();
                //console.log(coordinates_array);

                var new_arr = [];
                for (var i = 0; i < arr_len; i++) {
                    var val = coordinates_array[i].split(',');
                    var obj = {
                        "lat": val[0],
                        "lng": val[1]
                    }
                    str_coordinates += coordinates_array[i].toString() + ", "
                    new_arr.push(obj);
                }
                str_coordinates += coordinates_array[0].toString() + ", "
                str_coordinates = str_coordinates.slice(0, -2);
                console.log(str_coordinates);   //in string form
                console.log(new_arr);    //in array form
                $scope.show_add_area_btn = 1;
                $scope.$apply();
            };

            $scope.addArea = function () {
                console.log(str_coordinates);
                console.log($scope.areaName);
                var area=$('#areaName').val();
                console.log(area);
                if(area){
                    $scope.areaName=area;
                }
                $scope.show_add_areaname_btn = 1;
                if ($scope.areaName == '' || angular.isUndefined($scope.areaName)) {
                    $scope.displaymsg = "Enter Region Name"
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                    return false;
                }
                $.post(MY_CONSTANT.url + '/add_region', {
                        access_token: localStorage.getItem('access_token'),
                        region_name: $scope.areaName,
                        region_path: str_coordinates,
                        image_flag:0
                    }
                ).then(
                    function (data) {
                        if (typeof(data) == "string") {
                            data = JSON.parse(data);
                        }
                        console.log(data);
                        if (data.flag == 1502) {
                          if(data.message)
                            $scope.displaymsg = data.message;
                          if(data.log)
                            $scope.displaymsg = data.log;

                            $scope.successAreaAdded=1;
                            ngDialog.open({
                                template: 'addAreaSuccess',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope,
                                preCloseCallback: function () {
                                //     // var url = $location.absUrl().split('#')[0] + '#/app/fare/'+data.data.regionId;
                                //     // $window.open(url,'_blank');
                                //     // $state.reload();
                                //     //$window.location.href = url;
                                    $state.go('geoFencing.viewArea');
                                    return true;
                                }
                            });

                        }
                        else {
                          if(data.log)
                            $scope.displaymsg = data.log;
                          if(data.error)
                            $scope.displaymsg = data.error;
                            ngDialog.open({
                                template: 'display_msg_modalDialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope,
                                preCloseCallback: function () {
                                    $scope.removeShape();
                                    return true;
                                }
                            });

                        }
                        //$scope.$apply();

                    });
            };
            $scope.successArea = function(){
              if($scope.successAreaAdded==1){
                $state.reload();
              }
            };
            $timeout(function(){$scope.initMap();},100);
            $scope.fareRedirect = function () {
                ngDialog.close({
                    template: 'addAreaSuccess',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
                $state.go('fares.base');
            }
    }
})();
