/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.appointments')
        .controller('appointmentsDriverCtrl', appointmentsDriverCtrl);
    function appointmentsDriverCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter,$rootScope) {
        $rootScope.showloader=true;
        $scope.view='drivers';
        $scope.city_name='';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize=5;
        $scope.skip = 0;
        $scope.pageChanged = function (currentPage) {
            $scope.currentPage = currentPage;
            console.log('Page changed to: ' + $scope.currentPage);
            for(var i=1;i<=$scope.totalItems/10+1;i++) {
                if ($scope.currentPage == i) {
                    $scope.skip = 10*(i-1);
                    console.log('Offset changed to: ' + $scope.skip);
                    //$scope.$apply();
                }
            }
            dtInstance.fnDestroy();
            $scope.get_driver();
        };
        $scope.pendingDrivers=[];
        var dtInstance;
        $scope.get_driver=function(){

          $.post(MY_CONSTANT.url + '/pending_drivers', {
                  access_token: localStorage.getItem('access_token'),
                  limit:10,
                  offset:$scope.skip
              })
              .success(function (data,status) {
                    var arr=[];
                    var d=data;
                    console.log(d);
                  $scope.totalItems= d.total_drivers;
                  for(var i=0;i<$scope.totalItems;i++){
                  d.drivers[i].driver_name=d.drivers[i].first_name+' ' +d.drivers[i].last_name;
                  }
                  $scope.totalList=d.drivers;
                  for(var i=0;i<d.paginated_drivers.length;i++){
                    d.paginated_drivers[i].date_registeration= moment(d.paginated_drivers[i].date_registered).format('MMM DD YYYY, hh:mm A');
                    //$scope.pendingDrivers.push(d.paginated_drivers[i]);
                  }
                  $scope.pendingDrivers= d.paginated_drivers;

                  $rootScope.showloader=false;
                  $scope.$apply(function(){


                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatableAppointment').dataTable({
                            'paging': false,  // Table pagination
                            'searching': false,
                            'ordering': true,  // Column ordering
                            'info': true,  // Bottom left status text
                            "destroy": true,
                            "scrollX": '2000px',
                            "scrollY": '500px',
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

                    });
                    // When scope is destroyed we unload all DT instances
                    // Also ColVis requires special attention since it attaches
                    // elements to body and will not be removed after unload DT
                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    });
                  });
                })
                .error(function (data,status) {
                    console.log(data);
                });
        };
        $scope.openSearch = function ($item, $model, $label, $event) {
          console.log($item, $model, $label, $event);
          $scope.viewDetails($model);
        }
        $scope.viewDetails = function (data) {
            localStorage.setItem('driverData',JSON.stringify(data));
            $state.go('drivers.driverDetails');
        }
        $scope.get_driver();
        $scope.viewDiv=function(a){
            $scope.view=a;
            if(a=='drivers'){
                $scope.get_driver();
            }
            if(a=='city'){
                $scope.get_city();
            }
        };
        $scope.addCity=function(){
            $http.post(MY_CONSTANT.url+'/add_city',{
                    city_name:$scope.city_name
                })
                .success(function (data,status) {
                    $scope.city_name='';
                })
                .error(function (data,status) {
                    $scope.city_name='';
                });
        };
        $scope.get_city=function(){
            $http.post(MY_CONSTANT.url+'/get_cities')
                .success(function (data,status) {
                    console.log(data.cities);
                    $scope.cities=data.cities;

                })
                .error(function (data,status) {
                    console.log(data.data);
                });
        };
        $scope.deleteVenue=function(id){
            console.log(id);
            $http.post(MY_CONSTANT.url+'/delete_venue',{venue_id:id})
                .success(function (data,status) {
                    console.log(data);
                })
                .error(function (data,status) {
                    console.log(data.data);
                });
        };
        $scope.venues=function(id){

            $scope.view='venues';
            $scope.city_id=id;
            $http.post(MY_CONSTANT.url+'/get_venues')
                .success(function (data,status) {
                    console.log(data.venues);
                    var v=data.venues;
                    $scope.venuesList=data.venues;
                })
                .error(function (data,status) {
                    console.log(data.data);
                });
        };
        $scope.addVenue=function(){
            $scope.latitude=$('#venueLat').val();
            $scope.longitude=$('#venueLong').val();
            $http.post(MY_CONSTANT.url+'/add_venue',{
                    city_id:$scope.city_id,
                    address:$scope.address,
                    latitude:$scope.latitude,
                    longitude:$scope.longitude

                })
                .success(function (data,status) {
                    $scope.address='';
                })
                .error(function (data,status) {
                    $scope.address='';
                });
        };
        $scope.driversCSV=[];
        var a={
            sno:'S.No',
            name:'Driver Name',
            email :'Email',
            mobile :'Mobile',
            city_name  :'City',
            zipcode  :'Zipcode',
            date_registered  :'Registration Date/Time',
            tlc_number :'TLC Image',
            tlc_num :'TLC License',
            dmv_license :'DMV Image',
            dmv_num :'DMV License',
            annual_income  :'Income',
            how_hear_us  :'Reference',
            uber_user  :'UBER User',
            uber_rating  :'UBER Rating',
            lyft_user  :'LYFT User',
            lyft_rating  :'LYFT Rating'
        };
        $scope.driversCSV.push(a);

        console.log(a);
        console.log($scope.driversCSV);

        $scope.exportData = function () {
            var d={};
            for(var i=0;i<$scope.driverList.length;i++){
                    d.sno=i+1;
                    d.name=$scope.driverList[i].first_name+' '+$scope.driverList[i].last_name;
                    d.email=$scope.driverList[i].email;
                    d.mobile=$scope.driverList[i].mobile;
                    d.city_name=$scope.driverList[i].city_name;
                    d.zipcode =$scope.driverList[i].zipcode;
                    d.date_registered =moment($scope.driverList[i].date_registered).format('MM-DD-YYYY hh:mm A');
                    d.tlc_number =$scope.driverList[i].tlc_number;
                    d.tlc_num =$scope.driverList[i].tlc_num;
                    d.dmv_license =$scope.driverList[i].dmv_license;
                    d.dmv_num =$scope.driverList[i].dmv_num;
                    d.annual_income =$scope.driverList[i].annual_income;
                    d.how_hear_us =$scope.driverList[i].how_hear_us;
                    if($scope.driverList[i].uber_rating>0){
                        d.uber_user  ='Yes';
                    }
                    else d.uber_user = 'No';
                    d.uber_rating  =$scope.driverList[i].uber_rating;
                    if($scope.driverList[i].lyft_rating>0){
                        d.lyft_user  ='Yes';
                    }
                    else d.lyft_user = 'No';
                    d.lyft_rating  =$scope.driverList[i].lyft_rating;
                $scope.driversCSV.push(d);
                d={};
            }
            console.log($scope.driversCSV);
            alasql('SELECT * INTO CSV("driversAppointmentsList.csv") FROM ?', [$scope.driversCSV]);
        };
    }
})();
