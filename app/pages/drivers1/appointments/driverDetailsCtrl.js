/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.drivers.driverDetails')
        .controller('driverDetailsCtrl', driverDetailsCtrl);
    function driverDetailsCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter,$rootScope) {
        console.log(localStorage.getItem('driverData'));
        if(!localStorage.getItem('driverData')){
          $state.go('drivers.appointments');
        }
        else{
          $rootScope.showloader=false;
          $scope.driver={};
          $scope.driver.tlc_number='';
          $scope.driver.dmv_license='';
          $scope.driver=JSON.parse(localStorage.getItem('driverData'));
          $scope.driverID=$scope.driver.driver_id;
          if($scope.driver.uber_rating>0)$scope.driver.uberUser='Yes';
          else $scope.driver.uberUser='No';
          if($scope.driver.lyft_rating>0)$scope.driver.lyftUser='Yes';
          else $scope.driver.lyftUser='No';
          $scope.driverProfile='Driver ID '+$scope.driver.driver_id;
          if($scope.driver.dmv_num==null||$scope.driver.dmv_num=="null")$scope.driver.dmv_num='';
          if($scope.driver.tlc_num==null||$scope.driver.tlc_num=="null")$scope.driver.tlc_num='';
          console.log($scope.driver);
          // $.post(MY_CONSTANT.url + '/get_document_types', {
          //     access_token: localStorage.getItem('access_token'),
          //     })
          //     .success(function (data,status) {
          //       console.log(data);
          //
          //       $scope.docTypes=data.doc_types;
          $.post(MY_CONSTANT.url + '/get_all_car_types', {
              access_token: localStorage.getItem('access_token'),
              })
              .success(function (data,status) {
                console.log(data);
                $scope.carTypes=data.car_types;
              });
                $.post(MY_CONSTANT.url + '/get_all_docs', {
                  new_driver_id:$scope.driverID,
                  access_token: localStorage.getItem('access_token'),
                  is_verified:2,
                  limit: 10,
                  offset: 0
                })
                .success(function (data,status) {
                  console.log(data);
                  $scope.docLength=data.docs.length;
                  $scope.docs=data.docs;
                  $scope.driver.docs=[];
                  for(var i=0;i<$scope.docLength;i++){
                    if($scope.docs[i].document_type_id==1){
                      $scope.driver.dmv_license=$scope.docs[i].document_url;
                      if($scope.driver.dmv_license.length<3)$scope.driver.dmv_license='';
                      console.log($scope.driver.dmv_license);
                      $scope.$apply();
                    }
                    else if($scope.docs[i].document_type_id==2){
                      $scope.driver.tlc_number=$scope.docs[i].document_url;
                      if($scope.driver.tlc_number.length<3)$scope.driver.tlc_number='';
                      console.log($scope.driver.tlc_number);
                      $scope.$apply();
                    }
                    else{
                      if($scope.docs[i].document_url>3)
                      $scope.driver.docs.push($scope.docs[i].document_url);
                      console.log($scope.driver.docs);
                      $scope.$apply();
                    }
                  }
                })
              // })
        }
        $scope.formats = ['MM/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.popup = {
        opened: false
        };
        $scope.open = function () {
        $scope.popup.opened = true;
        };
        $scope.dateOptions = {
          maxDate: new Date(2040, 5, 22),
          minDate: new Date(),
          startingDay: 1
        };
        $scope.back = function() {
          $state.go('drivers.appointments')
        }
        $scope.driver.car_no='';
        $scope.approveDriver = function() {
          // car_type: $scope.driver.carType.car_type,
          // car_type_name: $scope.driver.carType.car_name,
          // $scope.driver.carType.car_type&&
          if($scope.driver.car_no!=''){
          $.post(MY_CONSTANT.url + '/admin/approve_driver', {
                  access_token: localStorage.getItem('access_token'),
                  driver_id: $scope.driver.driver_id,
                  car_no: $scope.driver.car_no
              })
              .success(function (data,status) {
                  $rootScope.openToast('success','Driver Approved Sucessfully','');
                  $state.go('drivers.approved');
              });
          }
          else {
            if($scope.driver.car_no=='') $rootScope.openToast('error','Choose a car number','');
            // if(!$scope.driver.carType.car_type) $rootScope.openToast('error','Choose a car type','');
          }
        }
        $scope.downloadForm = function(){
          var doc = new jsPDF();
          doc.fromHTML($('#driverProfile').html(), 15, 15, {
              'width': 170,
              'format': [4, 2]
          });

          doc.save('driverProfile.pdf');
        }
        $scope.addDocDialog = function(){
          $scope.type=0;
            ngDialog.open({
                template: 'document_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };
        $.post(MY_CONSTANT.url + '/get_document_types', {
                access_token: localStorage.getItem('access_token'),
            })
            .success(function(data, status) {
                console.log(data);
                $scope.docTypes = data.doc_types;

                $scope.driverID = localStorage.getItem('driverID');
                $.post(MY_CONSTANT.url + '/get_all_docs', {
                        access_token: localStorage.getItem('access_token'),
                        is_verified: 2,
                        driver_id: $scope.driverID,
                        limit: 10
                        ,offset: 0
                    })
                    .success(function(data, status) {
                        console.log(data);
                        $scope.docLength = data.docs.length;
                        $scope.docsList = data.docs;

                        for (var i = 0; i < $scope.docsList.length; i++) {
                            for (var j = 0; j < $scope.docTypes.length; j++) {
                                if ($scope.docsList[i].document_type_id == $scope.docTypes[j].document_type_id) {
                                    $scope.docsList[i].document_type_name = $scope.docTypes[j].document_name;
                                }
                            }

                        }
                        $rootScope.showloader=false;
                        $scope.$apply(function() {
                            var dtInstance;
                            $timeout(function() {
                                if (!$.fn.dataTable) return;
                                dtInstance = $('#datatableDriverDocs').dataTable({
                                    'paging': true, // Table pagination
                                    'ordering': true, // Column ordering
                                    'info': true,
                                    'scrollX': '1650px',
                                    'scrollY': '500px',
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
                                    }
                                });
                                var inputSearchClass = 'datatable_input_col_search';
                            }, 1000);

                        });

                    });
            })
        $scope.doc = {};
        $scope.driver.carType={};
        $scope.doc.expiry_date = '';
        $scope.doc.reminder_before = '';
        $scope.typeSelect = function(a) {
            $scope.doc.docType = a;
        }
        $scope.carSelect = function(a) {
            $scope.driver.carType = a;
        }
        $scope.file_to_upload = function(files) {
            processfile(files[0]);
            // $scope.doc.doc_file=files[0];
            $scope.doc.doc_file_name = files[0].name;
            $scope.$apply();
        }

        function processfile(file) {

            if (!(/image/i).test(file.type)) {
                alert("File " + file.name + " is not an image.");
                return false;
            }

            // read the files
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = function(event) {
                // blob stuff
                var blob = new Blob([event.target.result]); // create blob...
                window.URL = window.URL || window.webkitURL;
                var blobURL = window.URL.createObjectURL(blob); // and get it's URL

                // helper Image object
                var image = new Image();
                image.src = blobURL;
                //preview.appendChild(image); // preview commented out, I am using the canvas instead
                image.onload = function() {
                    // have to wait till it's loaded
                    var resized = resizeMe(image); // send it to canvas
                    // console.log(resized);
                    $scope.dataURItoBlob(resized);
                }
            };
        }

        function resizeMe(img) {

            var canvas = document.createElement('canvas');

            var width = img.width;
            var height = img.height;
            var max_width = 1024;
            var max_height = 720;
            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > max_width) {
                    //height *= max_width / width;
                    height = Math.round(height *= max_width / width);
                    width = max_width;
                }
            } else {
                if (height > max_height) {
                    //width *= max_height / height;
                    width = Math.round(width *= max_height / height);
                    height = max_height;
                }
            }

            // resize the canvas and draw the image data into it
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // preview.appendChild(canvas); // do the actual resized preview

            return canvas.toDataURL("image/jpeg", 0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

        }
        $scope.dataURItoBlob = function(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], {
                type: 'image/jpeg'
            });
            $scope.doc.doc_file = blob;
            // $scope.$apply();
        };
        $scope.submitText='Submit';
        $scope.addEditDocType = function(doc, type) {
            console.log(doc);
            if (doc.docType === undefined) {
                // alert('Select Document Type');
                $rootScope.openToast('error','Select Document Type','');
                return false;
            }
            if (doc.expiry_date === '') {
                // alert('Select Expiry Date');
                $rootScope.openToast('error','Select Expiry Date','');
                return false;
            }
            $scope.submitText='Uploading...';
            var form = new FormData();
            form.append('access_token', localStorage.getItem('access_token'));
            form.append('document_type_id', doc.docType.document_type_id);
            form.append('reminder_before', doc.reminder_before);
            form.append('expiry_date', moment(doc.expiry_date).format());
            form.append('new_driver_id', $scope.driverID);
            form.append('doc_file', doc.doc_file);

            $http.post(MY_CONSTANT.url + '/admin/upload_driver_doc', form, {
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function(data, status) {
                        console.log(data);
                        if (data.flag == 1303) {
                            $scope.submitText='Submit';
                            $rootScope.openToast('success','Document Added Sucessfully','');
                            ngDialog.close({
                                template: 'document_dialog',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });
                            $state.reload();
                        }
                        if (data.flag == 1302) {
                            $scope.submitText='Submit';
                            $rootScope.openToast('success','A valid document of this type already exist for this driver.','');
                            ngDialog.close({
                                template: 'document_dialog',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });

                        }
                    })


        }
        $scope.closeThisDialog = function() {
            $scope.doc = {};
        }
    }
})();
