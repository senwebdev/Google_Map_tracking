/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.appointments')
        .controller('appointmentsDriverCtrl', appointmentsDriverCtrl);

    function appointmentsDriverCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter,$rootScope,calendarConfig,moment) {

        $scope.selectedIndex = 0;
        $rootScope.showloader=true;
        $scope.view='drivers';
        $scope.city_name='';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize=5;
        $scope.skip = 0;
        var bookmark;
        $scope.isLoading = false;

        $scope.pendingDrivers=[];
        $scope.verifiedDrivers=[];
        var dtInstance;

        'use strict';

        $scope.selected = [];
        $scope.limitOptions = [10, 25, 35];

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
            page: 1,
            requestType: 0
        };

        $scope.setRequestType = function(id) {
            console.log('id', id)
            $scope.query.requestType = id;
        }

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

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

        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';
            console.log("removed filter");
        };

        $scope.$watch('query.filter', function (newValue, oldValue) {

            if(!oldValue) {
                bookmark = $scope.query.page;
            }

            if(newValue !== oldValue) {
                $scope.query.page = 1;
            }

            if(!newValue) {
                $scope.query.page = bookmark;
            }

            $scope.get_driver();

        });

        $scope.get_driver = function() {

            $scope.isLoading = true;
            $scope.skip = ($scope.query.page - 1) * $scope.query.limit;

            $http({
                method: "POST",
                url: MY_CONSTANT.url +'/admin/drivers_by_type',
                header:{
                    'Content-Type':'application/json;'
                },
                data:{
                    access_token: localStorage.getItem('access_token'),
                    limit: $scope.query.limit,
                    offset: $scope.skip,
                    searchFlag: $scope.query.filter? 1 : 0,
                    searchString: $scope.query.filter,
                    requestType: $scope.query.requestType,
                    sort_by: 'date_registered',
                    sort_order: 'DESC',
                    test: 679
                 }
            })
            .success(function (data,status) {

                $scope.isLoading = false;
                var arr = [];
                var d = data;
                var pendingDriversData = null;
                var verifiedDriversData = null;

                if($scope.query.requestType === 0) {

                    console.log('requestType = 0');
                    pendingDriversData = d.pendingDrivers;
                    verifiedDriversData = d.verifiedDrivers;

                    $scope.pendingDrivers = {
                        "count": pendingDriversData.total_drivers,
                        "data":pendingDriversData.drivers
                    };
                    $scope.verifiedDrivers = {
                        "count": verifiedDriversData.total_drivers,
                        "data": verifiedDriversData.drivers
                    }

                } else if($scope.query.requestType === 1) {

                    console.log('requestType = 1');
                    pendingDriversData = data;
                    $scope.pendingDrivers = {
                        "count": pendingDriversData.total_drivers,
                        "data":pendingDriversData.drivers
                    }

                } else if($scope.query.requestType === 2) {

                    console.log('requestType = 2');
                    verifiedDriversData = data;
                    $scope.verifiedDrivers = {
                        "count": verifiedDriversData.total_drivers,
                        "data": verifiedDriversData.drivers
                    }

                }
                $rootScope.showloader = false;

            }).error(function (data,status) {
                console.log(data);
            });
        };

        $scope.editDriver = function (data) {
            localStorage.setItem('appdriver',JSON.stringify(data));
            $state.go('drivers.editAppDrivers');
        };
//*************************************** new    driver**************************************   */
        // $scope.deleteDriver = function(data){
        //     console.log("data",data);
        //     // localStorage.setItem('driverID',$scope.resId);
        // //   localStorage.setItem('driverData',JSON.stringify($scope.data));
        // //   $state.go('drivers.editDriver');
         
        //   ngDialog.open({
        //       template: 'delete_driver_modalDialog',
        //       className: 'ngdialog-theme-default',
        //       showClose: false,
        //       scope: $scope
        //   });
  
        //   ngDialog.close({
        //       template: 'delete_driver_modalDialog',
        //       className: 'ngdialog-theme-default',
        //       scope: $scope
        //   });
            
        // }

//  DELETING IN APPOINTMENT DRIVERS 
        $scope.deleteDriver = function (data) {
            $scope.deleteDriverData= data;
            ngDialog.open({
                template: 'delete_driver_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };
// CLICKING ON YES DRIVER NEEDS TO BE DELETED
        $scope.delete_driver = function () {
            console.log($scope.deleteDriverData.driver_id);
            localStorage.getItem('access_token')
            ngDialog.close({
                template: 'delete_driver_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $http.post(MY_CONSTANT.url + '/delete/driver', {
                           access_token: localStorage.getItem('access_token'),
                           driver_id: $scope.deleteDriverData.driver_id,
                           driver_mobile:$scope.deleteDriverData.mobile,
                       })
                       .success(function (data) {
                           $state.reload();
                           if (data.status == 200) {
                               $scope.displaymsg = "Driver deleted successfully";
                           }
                           else if (data.status == 401){
                               $state.go('page.login');
                           }
                           else {
                               $scope.displaymsg = data.message;
                           }
                           $scope.list = $scope.list.filter(function (el) {
                            return el.delete_id !== delete_driver;
                        });
                          
                          
                       });
                    }
            
        // $scope.delete_driver=function(id){
        //     console.log("ID",id);
          
        //     $http.post(MY_CONSTANT.url+'/delete/driver',{
        //                    access_token: localStorage.getItem('access_token'),
        //                    driver_id: data.driver_id.toString()
        // })
        //         .success(function (data,status) {
        //             console.log(data);
        //         })
        //         .error(function (data,status) {
        //             console.log(data.data);
        //         });
        // };

        // $scope.deleteDriver = function(data){
        //     localStorage.setItem('driverID',$scope.resId);
        //   localStorage.setItem('driverData',JSON.stringify($scope.driver_data));
        //   // $state.go('drivers.editDriver');
        // //   ngDialog.open({
        // //       template: 'delete_driver_modalDialog',
        // //       className: 'ngdialog-theme-default',
        // //       showClose: false,
        // //       scope: $scope
        // //   });

        //   $http.post(MY_CONSTANT.url + '/delete/driver', {
        //     access_token: localStorage.getItem('access_token'),
        //    driver_id: data.driver_id.toString()
        // })
        // .success(function (data) {
        //     // data = JSON.parse(data);
        //     $state.reload();
        //     if (data.status == 200) {
        //         $scope.displaymsg = "Driver deleted successfully";
               
        //     }
        //     else if (data.status == 401){
        //         $state.go('page.login');
        //     }
        //     else {
        //         $scope.displaymsg = data.message.toString();
        //     }
        //     // $scope.list = $scope.list.filter(function (el) {
        //     //     return el.user_id !== driver_id
        //     // });
            
           
        // });
  
        // //   ngDialog.close({
        // //       template: 'delete_driver_modalDialog',
        // //       className: 'ngdialog-theme-default',
        // //       scope: $scope
        // //   });
            
        // }

        // $scope.delete_driver = function(data) {
            
        //     localStorage.setItem('driverID',$scope.resId);
        //    ngDialog.close({
        //        template: 'delete_user_modalDialog',
        //        className: 'ngdialog-theme-default',
        //        scope: $scope
        //    });
        //    $http.post(MY_CONSTANT.url + '/delete/driver', {
        //     access_token: localStorage.getItem('access_token'),
        //    driver_id: data.driver_id.toString()
        // })
        //    .success(function (data) {
              
        //        $state.reload();
        //       // $scope.refresh();
        //        //data = JSON.parse(data);
        //        $scope.refreshPage = function () {

        //           ngDialog.close({
        //               template: 'display_msg_modalDialog',
        //               className: 'ngdialog-theme-default',
        //               scope: $scope
        //           });
        //           $state.reload();
        //       };
        //        if (data.status == 200) {
        //            $scope.displaymsg = "Driver deleted successfully";
        //        }
        //        else if (data.status == 401){
        //            $state.go('page.login');
        //        }
        //        else {
        //            $scope.displaymsg = data.message.toString();
        //        }
        //        $scope.list = $scope.list.filter(function (el) {
        //            return el.user_id !== delete_user;
        //        });
        //     //    $scope.$apply();
        //     //    ngDialog.open({
        //     //        template: 'delete_user_modalDialog',
        //     //        className: 'ngdialog-theme-default',
        //     //        showClose: false,
        //     //        scope: $scope
        //     //    });
        //    });


    //    };

    //     $scope.deleteDriver = function(data){
    //         console.log("pta nai kya hoga?");
    //     ngDialog.open({
    //         template: 'delete_user_modalDialog',
    //         className: 'ngdialog-theme-default',
    //         showClose: false,
    //         scope: $scope
    //     });

    // };


    //     $scope.new_delete_driver = function(data) {
    //         console.log("NEW DRIVER DEEETE",data)
    //        ngDialog.close({
    //            template: 'delete_driver_modalDialog',
    //            className: 'ngdialog-theme-default',
    //            scope: $scope
    //        });

    //        $http.post(MY_CONSTANT.url + '/delete/driver', {
    //            access_token: localStorage.getItem('access_token'),
    //            driver_id: delete_driver_id.toString()
    //        })
    //        .success(function (data) {
    //            //data = JSON.parse(data);

    //            if (data.status == 200) {
    //                $scope.displaymsg = "Driver deleted successfully";
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
    //            $scope.$apply();
    //            ngDialog.open({
    //                template: 'display_msg_modalDialog',
    //                className: 'ngdialog-theme-default',
    //                showClose: false,
    //                scope: $scope
    //            });
    //        });


    //    };

    // $scope.delete_driver=function(id){
    //     console.log("ID",id);
    //     console.log(id);
    //     $http.post(MY_CONSTANT.url+'/delete_venue',{venue_id:id})
    //         .success(function (data,status) {
    //             console.log(data);
    //         })
    //         .error(function (data,status) {
    //             console.log(data.data);
    //         });
    // };

//*************************Functions of verify drivers***************************************** */


    $scope.verifyDriver = function (driver_id) {
        $scope.verifyDriverId= driver_id;
        ngDialog.open({
            template: 'verify_driver_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };


    $scope.verify_driver = function () {
        // localStorage.getItem('access_token')
        ngDialog.close({
            template: 'verify_driver_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

        $scope.isLoading = true;

            $.post(MY_CONSTANT.url + '/admin/verify_driver', {
                access_token: localStorage.getItem('access_token'),
                driver_id: $scope.verifyDriverId,
                flag:1
            })
            .success(function (data,status) {
                $scope.isLoading = false;

                var arr = [];
                var d = data;
                var msg = '';
                $scope.query.requestType = 0;
                $rootScope.showloader = false;
                msg = d.message;
                $rootScope.openToast('success', msg, '');

                $scope.get_driver();
                // $scope.$apply(function(){ });

            })
            .error(function (data,status) {
                console.log(data);
            });
                }
        
                $scope.unVerified = function (driver_id) {
                    $scope.unverifyDriverId= driver_id;
                    ngDialog.open({
                        template: 'unverify_driver_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                };

        $scope.unverify_driver= function(){
            $scope.isLoading = true;
            $.post(MY_CONSTANT.url + '/admin/verify_driver', {
                access_token: localStorage.getItem('access_token'),
                driver_id: $scope.unverifyDriverId,
                flag:0
            })
            .success(function (data,status) {
                $scope.isLoading = false;
                var arr = [];
                var d = data;
                var msg = '';
                $scope.query.requestType = 0;
                $rootScope.showloader = false;
                msg = d.message;
                $rootScope.openToast('success', msg, '');
                $scope.get_driver();
                // $scope.$apply(function(){ });

            })
            .error(function (data,status) {
                console.log(data);
            });

        }
//*********************************************************************** */
        $scope.approveDriver = function(driver_id) {

            $scope.isLoading = true;

            $.post(MY_CONSTANT.url + '/approve_driver', {
                access_token: localStorage.getItem('access_token'),
                driver_id: driver_id
            })
            .success(function (data, status) {
               console.log("---->,data, ", data);
               console.log("---->,, status", status);
                $scope.isLoading = false;

                var arr = [];
                var d = data;
                var msg = '';
                console.log('approve_driver', d);

                if(d.flag == 1600) {
                   msg  = d.message;
                   console.log("d.flag",msg);
                    $rootScope.showloader = false;
                   $rootScope.openToast('success', 'Driver approved successfully','');
                    $scope.get_driver();
                }else{
                    msg  = d.message;
                    $rootScope.openToast('danger', msg,'');
                }

               /* $state.go('drivers.approved');
                $scope.$apply(function(){ });*/

            })
            .error(function (data,status) {
                console.log(data);
            });

        }

        $scope.openSearch = function ($item, $model, $label, $event) {
          console.log($item, $model, $label, $event);
          $scope.viewDetails($model);
        }

        $scope.viewDetails = function (data) {
            localStorage.setItem('driverData',JSON.stringify(data));
            $state.go('drivers.driverDetails');
        }

        $scope.addPayment= function(data){
            localStorage.setItem('driverData',JSON.stringify(data));
            $state.go('drivers.driverDetails',{selectedIndex:2});
        }
        
        

        $scope.get_driver();

        $scope.viewDiv=function(a){
            $scope.view=a;
            if(a=='drivers'){
               //  $scope.get_driver();
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

        // console.log(a);
        // console.log($scope.driversCSV);

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
        var vm = this;

            //These variables MUST be set as a minimum for the calendar to work
            vm.calendarView = 'month';
            vm.viewDate = new Date();
            var actions = [{
              label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
              onClick: function(args) {
                  console.log(args);
                alert.show('Edited', args.calendarEvent);
              }
            }, {
              label: '<i class=\'glyphicon glyphicon-remove\'></i>',
              onClick: function(args) {
                alert.show('Deleted', args.calendarEvent);
              }
            }];
            vm.events = [
              {
                title: 'An event',
                color: calendarConfig.colorTypes.warning,
                startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
                endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
                draggable: true,
                resizable: true,
                actions: actions
              }, {
                title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
                color: calendarConfig.colorTypes.info,
                startsAt: moment().subtract(1, 'day').toDate(),
                endsAt: moment().add(5, 'days').toDate(),
                draggable: true,
                resizable: true,
                actions: actions
              }, {
                title: 'This is a really long event title that occurs on every year',
                color: calendarConfig.colorTypes.important,
                startsAt: moment().startOf('day').add(7, 'hours').toDate(),
                endsAt: moment().startOf('day').add(19, 'hours').toDate(),
                recursOn: 'year',
                draggable: true,
                resizable: true,
                actions: actions
              }
            ];

            vm.cellIsOpen = true;

            vm.addEvent = function() {
              vm.events.push({
                title: 'New event',
                startsAt: moment().startOf('day').toDate(),
                endsAt: moment().endOf('day').toDate(),
                color: calendarConfig.colorTypes.important,
                draggable: true,
                resizable: true
              });
            };

            vm.eventClicked = function(event) {
              alert.show('Clicked', event);
            };

            vm.eventEdited = function(event) {
              alert.show('Edited', event);
            };

            vm.eventDeleted = function(event) {
              alert.show('Deleted', event);
            };

            vm.eventTimesChanged = function(event) {
              alert.show('Dropped or resized', event);
            };

            vm.toggle = function($event, field, event) {
              $event.preventDefault();
              $event.stopPropagation();
              event[field] = !event[field];
            };

            vm.timespanClicked = function(date, cell) {
              if (vm.calendarView === 'month') {
                if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                  vm.cellIsOpen = false;
                } else {
                  vm.cellIsOpen = true;
                  vm.viewDate = date;
                }
              } else if (vm.calendarView === 'year') {
                if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
                  vm.cellIsOpen = false;
                } else {
                  vm.cellIsOpen = true;
                  vm.viewDate = date;
                }
              }
            }
        }

})();
