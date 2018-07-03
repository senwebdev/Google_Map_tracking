/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.geoFencing.viewArea')
        .controller('viewAreaCtrl', viewAreaCtrl);
    function viewAreaCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
            var polygonArray = [];   //polygon array for shape view
            var coordinates_array = [];   //array of lat longs after overlay complete
            var all_overlays = [];
            var bounds = new google.maps.LatLngBounds();   //defining bounds
            var infoWindow = new google.maps.InfoWindow();   //defining infowindow
            var region_id,region_name;
            var  str_coordinates = '';
            var old_coordinates = '';
            var drawingManager;
            $rootScope.showloader=true;
            $scope.editmapflag = 0;
            $scope.exportData = function () {
                alasql('SELECT * INTO CSV("arealist.csv",{headers:true}) FROM ?', [$scope.excelList]);
            };
            $scope.mapLoaded = 0;
            $scope.viewRegionDetails = function(data){
              localStorage.setItem('region_id',data.region_id);
              $state.go('geoFencing.viewAreaDetails');
            }
            $.post(MY_CONSTANT.url + '/get_all_regions', {
                access_token: localStorage.getItem('access_token')
            }, function (data) {
                $scope.showloader = false;
                var dataArray = [];
                var excelArray = [];
                if (typeof(data) == "string")
                    data = JSON.parse(data);
                if (data.flag == 101) {
                    $state.go('page.login');
                }
                else if (data.flag == 1503) {
                    var areaList = data.regions;
                    areaList.forEach(function (column) {
                        var e = {};
                        excelArray.push(e);
                        var d = {};
                        d.region_id = column.region_id;
                        d.region_name = column.region_name;
                        d.region_path_string = column.region_path_string;
                        d.region_image = column.region_image;
                        d.added_at = column.added_at;
                        dataArray.push(d);
                    });

                    $scope.$apply(function () {
                        $scope.list = dataArray;
                        $scope.excelList = excelArray;
                        $rootScope.showloader=false;
                        // Define global instance we'll use to destroy later
                        var dtInstance;

                        $timeout(function () {
                            if (!$.fn.dataTable) return;
                            dtInstance = $('#datatableView').dataTable({
                                'paging': true,  // Table pagination
                                'ordering': true,  // Column ordering
                                'info': true,  // Bottom left status text
                                "bDestroy": true,
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
                                    {'bSortable': false, 'aTargets': [2]}
                                ]
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
//======================================================================================================
//================================confirmation of deletion of region ===================================
//======================================================================================================
            $scope.deleteRegionConfirm = function (data) {
                $scope.region_id = data.region_id;
                ngDialog.open({
                    template: 'delete_region_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }

            $scope.deleteRegion = function () {
                ngDialog.close({
                    template: 'delete_region_modalDialog',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });


                $.post(MY_CONSTANT.url + '/delete_a_region',
                    {
                        access_token: localStorage.getItem('access_token'),
                        region_id: $scope.region_id
                    }, function (data) {
                        if (typeof(data) == "string")
                            data = JSON.parse(data);

                        if (data.status == 200) {
                            $scope.displaymsg = "Region removed successfully.";
                        }
                        else if (data.status == 401) {
                            $state.go('page.login');
                        }
                        else {
                            $scope.displaymsg = data.message;
                        }

                        $scope.$apply();
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope,
                            preCloseCallback: function () {
                                $state.reload();
                                return true;
                            }
                        });
                    });
            }

            $scope.setPolygon = function (data) {
                polygonArray = [];
                var polygon = data.region_path_string.split(',');
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
                    strokeWeight: 3,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });
                shape.content = '<div class="infoWindowContent">' +
                    '<center><b>Region Name</b></center>' +
                    '<span> ' + data.region_name + '</span><br>'
                '</div>';
                google.maps.event.addListener(shape, 'click', function (event) {
                    infoWindow.setContent(shape.content);
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open($scope.mapContainer, shape);
                });
                $scope.mapContainer.fitBounds(bounds);
                shape.setMap($scope.mapContainer);
            }

            $scope.setDrawingOptions = function(data){
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
                    $scope.editmapflag = 1;
                    $scope.$apply();
                    if (event.type == google.maps.drawing.OverlayType.POLYGON) {
                        // Switch back to non-drawing mode after drawing a shape.
                        drawingManager.setDrawingMode(null);
                        var length = event.overlay.getPath().length;
                        event.overlay.getPath().forEach(function(data){
                            var latlong = data.lat() + " " + data.lng();
                            coordinates_array.push(latlong)
                        });
                        // $scope.latLongArrayList(coordinates_array);
                    }
                });
            }



            $scope.showMap = function (data) {
                //INITIALISING THE MAP WITH DRAWING PLACES FEATURE
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/display_map.html',
                    controller: ModalInstanceCtrl,
                    size: ''
                });

                $timeout(function () {
                    initMap(data, 1);
                }, 1000)
            }
            function initMap(data, flag) {
                $scope.map = {
                    zoom: 12,
                    center: new google.maps.LatLng(MapLatLong.lat, MapLatLong.lng),
                    pan: true
                }
                if(flag==1){
                    $scope.mapContainer = new google.maps.Map(document.getElementById("regionmap"), $scope.map);
                    $scope.setPolygon(data);
                }
                else{
                    $scope.mapContainer = new google.maps.Map(document.getElementById("editmap"), $scope.map);
                    $scope.setPolygon(data);
                    $scope.setDrawingOptions(data);

                }

            };

            //edit map dialog
            $scope.editRegionMap = function (data) {
                old_coordinates = '';
                region_id = data.region_id;
                region_name = data.region_name;
                old_coordinates = data.region_path_string;
                console.log(old_coordinates)
                console.log("old_coordinates");
                //INITIALISING THE MAP WITH DRAWING PLACES FEATURE
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/edit_map.html',
                    controller: ModalInstanceCtrl,
                    size: '',
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });

                $timeout(function () {
                    initMap(data, 2);
                }, 500)
            }

            // Please note that $modalInstance represents a modal window (instance) dependency.
            // It is not the same as the $modal service used above.

            var ModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.region_name = region_name;
                $scope.ok = function () {
                    $modalInstance.close('closed');
                };


                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.editRegion = function(region_name){
                    if (region_name == '' || angular.isUndefined(region_name)) {
                        $scope.displaymsg = "Enter Region Name"
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                        return false;
                    }
                    var arr_len = coordinates_array.length;
                    if(arr_len){
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
                    }
                    else{
                        str_coordinates = old_coordinates;
                    }

                    $.post(MY_CONSTANT.url + '/edit_a_region',
                        {
                            access_token: localStorage.getItem('access_token'),
                            region_id: region_id,
                            region_path: str_coordinates,
                            region_name: region_name
                        }, function (data) {
                            if (typeof(data) == "string")
                                data = JSON.parse(data);
                            console.log(data);

                            if (data.status == 200) {
                                $scope.displaymsg = "Region updated successfully.";
                            }
                            else if (data.status == 401) {
                                $state.go('page.login');
                            }
                            else if(data.error){
                                $scope.displaymsg = data.error;
                            }
                            else {
                                $scope.displaymsg = data.message;
                            }
                            $scope.$apply();
                            //var loginModal = $modal({template:'/edit_map.html', show:false});
                            //loginModal.$promise.then(loginModal.show);
                            //loginModal.$promise.then(loginModal.hide);
                            //ngDialog.close({
                            //    template: 'edit_map.html',
                            //    className: 'ngdialog-theme-default',
                            //    showClose: false,
                            //    scope: $scope
                            //});
                            ngDialog.open({
                                template: 'display_msg_modalDialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope,
                                preCloseCallback: function () {
                                    $state.reload();
                                    $modalInstance.close();
                                    return true;
                                }
                            });

                        });

                }
                //REMOVING SHAPE ON CLICK
                $scope.removeShape = function () {
                    console.log("here")
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

                }
            }
            ModalInstanceCtrl.$inject = ["$scope", "$modalInstance"];

    }
})();
