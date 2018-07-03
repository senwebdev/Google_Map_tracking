/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.cars')
        .controller('carsCtrl', carsCtrl);
    function carsCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $rootScope.showloader=true;
        $scope.cars = function(){
          $.post(MY_CONSTANT.url + '/get_all_car_types', {
              access_token: localStorage.getItem('access_token'),
              })
              .success(function (data,status) {
                console.log(data);
                $scope.carTypes=data.car_types;
                $rootScope.showloader=false;
                $scope.$apply();
                var dtInstance;

                $timeout(function () {
                  console.log("Asd");
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatableCarTypes').dataTable({
                        'paging': true,  // Table pagination
                        'ordering': true,  // Column ordering
                        'info': true,
                        'bDestroy':true,
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
                },1000);

              })
        }
        $scope.cars();
        $scope.addCarDialog = function(){
          $scope.type=0;
            ngDialog.open({
                template: 'car_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };
        $scope.editCarDialog = function(data){
          $scope.type=1;
            $scope.car.car_type_id=data.car_type_id;
            $scope.car.car_name=data.car_name;
            ngDialog.open({
                template: 'car_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };
        $scope.file_to_upload = function (files) {
            processfile(files[0]);
            // $scope.car.car_type_image=files[0];
            $scope.car.car_type_image_name= files[0].name;
            $scope.$apply();
        }
        function processfile(file) {

        if( !( /image/i ).test( file.type ) )
            {
                alert( "File "+ file.name +" is not an image." );
                return false;
            }

        // read the files
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function (event) {
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
        var max_width=1024;
        var max_height=720;
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

        return canvas.toDataURL("image/jpeg",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

        }
        $scope.dataURItoBlob = function(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob= new Blob([ab], { type: 'image/jpeg' });
        $scope.car.car_type_image=blob;
        // $scope.$apply();
        };

        $scope.car={};
        $scope.addEditCarType = function(carType,type){
            var image=0;
            if($scope.car.car_type_image)image=0;
            else image=1;
            var form = new FormData();
            form.append('access_token',localStorage.getItem('access_token'));
            form.append('car_name',$scope.car.car_name);
            form.append('image_flag',image);
            if(image==1)form.append('car_type_image',$scope.car.car_type_image);
              $http.post(MY_CONSTANT.url + '/add_car_type',
                  form,{headers:{'Content-Type':undefined}}).success(function (data) {
                      //data = JSON.parse(data);

                      if (data.status == 200||data.flag==1511) {
                          $scope.car.successMsg = data.message;
                          $scope.$apply();
                          console.log(data)
                          setTimeout(function () {
                              $scope.car.successMsg = "";
                              //$scope.$apply();
                              ngDialog.close({
                                  template: 'car_dialog',
                                  className: 'ngdialog-theme-default',
                                  showClose: false,
                                  scope: $scope
                              });
                              $scope.car.car_name='';
                              $state.reload();
                          }, 1000);
                      }
                      else if (data.status == 101){
                          $state.go('page.login');
                      }
                      else {
                          $scope.car.errorMsg = data.error;
                          //$scope.$apply();
                          setTimeout(function () {
                              $scope.car.errorMsg = "";
                              //$scope.$apply();
                              ngDialog.close({
                                  template: 'car_dialog',
                                  className: 'ngdialog-theme-default',
                                  showClose: false,
                                  scope: $scope
                              });
                          }, 3000);
                      }
                  });
        };
    }
})();
