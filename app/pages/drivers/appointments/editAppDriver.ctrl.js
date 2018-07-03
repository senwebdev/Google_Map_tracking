/* Copyrights-Developed by Taxi Technologies INC. */
(function() {
    'use strict';
    angular.module('BlurAdmin.pages.drivers.editAppDriver').controller('editAppDriverCtrl', editAppDriverCtrl);
    function editAppDriverCtrl($timeout, $rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
         $rootScope.showloader = false;
        $scope.back = function() {
            $state.go('drivers.appointments')
        }
        if (!localStorage.getItem('appdriver')) {
            $state.go('drivers.appointments');
        } else {
            $rootScope.showloader = false;
            $scope.driver = {};
            $scope.driver.tlc_number = '';
            $scope.driver.dmv_license = '';
            $scope.driver = JSON.parse(localStorage.getItem('appdriver'));
            $scope.driverID = $scope.driver.driver_id;
            if ($scope.driver.uber_rating > 0) $scope.driver.uberUser = 'Yes';
            else $scope.driver.uberUser = 'No';
            if ($scope.driver.lyft_rating > 0) $scope.driver.lyftUser = 'Yes';
            else $scope.driver.lyftUser = 'No';
            $scope.driverProfile = 'Driver ID ' + $scope.driver.driver_id;
            console.log($scope.driver);
            var m = $scope.driver.mobile.split('-');
            $scope.driver.countrycode= m[0];
            $scope.driver.driver_mobile = m[1];
            $scope.mobile= m[1];
            $scope.email= $scope.driver.driver_email;
            $scope.driverTemp = {};
            console.log($scope.driver);
            $scope.driverTemp = $scope.driver;
            $scope.driverTemp.driver_email=$scope.driver.email;
    $scope.driverTemp.driver_name=$scope.driver.first_name+" "+$scope.driver.last_name;
    $scope.driverTemp.driver_image=$scope.driver.driver_image_name;
        }

        $scope.dataURItoBlob = function(dataURI) {
            // console.log(dataURI);
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], {
                type: 'image/jpeg'
            });
            // console.log(blob);
            $scope.driverTemp.driver_image = dataURI;
            $scope.driverTemp.driver_image_file = blob;
            $scope.$apply();
        };

        $scope.file_to_upload = function(files) {

            console.log(files);
            if (!files || files.length == 0) {

                $scope.driverTemp.driver_image = '';
                $scope.driverTemp.driver_image_name = '';
                $scope.$apply();
                return false;
            }

            processfile(files[0]);
            $scope.driverTemp.driver_image_name = files[0].name;
            $scope.$apply();
        };

        function processfile(file) {

            if (!file) {
                $scope.driverTemp.driver_image = '';
                $scope.driverTemp.driver_image_name = '';
                $scope.$apply();
                return false;
            }
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

        $scope.driverTemp.driver_image_name='';

        $scope.editSave = function() {

            console.log("sdfg");
            var form = new FormData();
            if($scope.driverTemp.driver_image_name!=''){
              $scope.driverTemp.image_flag = 1
              form.append("image",$scope.driverTemp.driver_image_file);
            }
            else {
              $scope.driverTemp.image_flag = 0;
            }

            console.log($scope.driverTemp.driver_mobile);
            console.log($scope.driver.driver_mobile);

            if($scope.driverTemp.driver_email!=$scope.email)$scope.driverTemp.is_email_changed = 1;
            else $scope.driverTemp.is_email_changed = 0;
            if($scope.driverTemp.driver_mobile!=$scope.mobile)$scope.driverTemp.is_mobile_changed = 1;
            else $scope.driverTemp.is_mobile_changed = 0;
            $scope.driverTemp.with_otp=0;

            form.append("driver_id",$scope.driverID);
            form.append("access_token",localStorage.getItem('access_token'));
            form.append("driver_name",$scope.driverTemp.driver_name);
            form.append("driver_mobile",$scope.driverTemp.countrycode+'-'+$scope.driverTemp.driver_mobile);
            form.append("driver_email",$scope.driverTemp.driver_email);
            form.append("is_mobile_changed",$scope.driverTemp.is_mobile_changed);
            form.append("is_email_changed",$scope.driverTemp.is_email_changed);
            form.append("with_otp",$scope.driverTemp.with_otp);
            form.append("image_flag",$scope.driverTemp.image_flag);

            $http({
                method: "POST",
                url: MY_CONSTANT.url +'/admin/edit_info_driver',
                headers:{
                    'Content-Type': undefined
                },
                data:form
            })
            // $http.post(MY_CONSTANT.url + '/edit_info_driver', form,{headers: {
            //     'Content-Type': undefined
            // }})
            .success(function(data, status) {
                console.log(data);
                $rootScope.openToast('success','Driver profile saved successfully','');
                $state.go('drivers.appointments');
            })
            .error(function(data, status)
            {
                $rootScope.openToast('error','Something Went Wrong','');
            })


        }
    }
})();
