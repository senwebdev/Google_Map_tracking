/* Copyrights-Developed by Qudos USA LLC */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.drivers.driverDetails')
        .controller('driverDetailsCtrl', driverDetailsCtrl);
    function driverDetailsCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter,$rootScope,$stateParams) {

        $scope.car_info = {};
        $scope.edit = {};
        $scope.carTypes = [{name:'QS (4 max)',type:1},
            {name:'QLE (6 max)',type:2},
            {name:'LUXE (VIP 4 max)',type:3},
            {name:'Grande (SUV)',type:4}]
        $scope.minDate = moment()
          .add(7, "days")
          .format("YYYY-MM-DD");
        // $scope.minDate = moment($scope.minDate).format("YYYY-MM-DD");
        console.log('ttttt', $scope.minDate);

        $scope.accntParams = {
            individual: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                ssn: "",
                address: {
                    streetAddress: "",
                    locality: "",
                    region: "NY",
                    postalCode: ""
                }
            },
            business: {
                legalName: "",
                dbaName: "",
                taxId: "",
                address: {
                    streetAddress: "",
                    locality: "",
                    region: "NY",
                    postalCode: ""
                }
            },
            funding: {
                // descriptor: "",
                // destination: "destinationssss",
                // email: "",
                // mobilePhone: "",
                accountNumber: "",
                routingNumber: ""
            },
            tosAccepted: true,
            // masterMerchantAccountId: "14ladders_marketplace",
            id: ""
        };

        $scope.driverApproved = JSON.parse(localStorage.getItem('driverData')).hasOwnProperty('is_free');

        function getVehicleDetails(){
            $.post(MY_CONSTANT.url + '/admin/get_vehicle_details', {
                access_token: localStorage.getItem('access_token'),
                driver_id: $scope.driver.driver_id,
            })
            .success(function(data) {
                if(typeof data=='string'){
                    data = JSON.parse(data);
                }
                console.log('car details loaded successful.',data.data);
                $scope.car_info.car_name = data.data.car_name;
                $scope.car_info.car_type = data.data.car_type+'';
                $scope.car_info.car_no = data.data.car_no;
                $scope.car_info.passenger_count = data.data.passenger_count;
            })
            .error(function (data) {
                console.log('Error occured get car details',data);
            });
        }

        $scope.editDetails = function(editFor){
            console.log('editFor',editFor);
            if(!$scope.edit[editFor]) {
                $scope.edit[editFor] = true;
                return ;
            }
            console.log('$scope.edit[editFor]',$scope.edit[editFor]);
            if(editFor=='driver'){
                $.post(MY_CONSTANT.url + '/admin/edit_new_driver', {
                    access_token: localStorage.getItem('access_token'),
                    driver_id: $scope.driver.driver_id,
                    first_name: $scope.driver.first_name,
                    last_name: $scope.driver.last_name,
                    email: $scope.driver.email,
                    mobile: $scope.driver.mobile,
                    zipcode: $scope.driver.zipcode,
                    tlc_num: $scope.driver.tlc_num,
                    how_hear_us: $scope.driver.how_hear_us,
                    //uberUser: $scope.driver.uberUser,
                    uber_rating: $scope.driver.uber_rating || 0.0,
                    //lyftUser: $scope.driver.lyftUser,
                    lyft_rating: $scope.driver.lyft_rating || 0.0,
                    annual_income: $scope.driver.annual_income,
                    dmv_num: $scope.driver.dmv_num,
                })
                    .success(function(data) {
                        console.log('Edit successful.',data);
                        $rootScope.openToast('success', 'Driver updated successfully','');
                        $scope.edit[editFor] = false;
                    })
                    .error(function (data) {
                        console.log('Error occured on edit',data);
                        $rootScope.openToast('danger', 'Something went wrong. Updation failed!','');
                    });
            }else if(editFor=='car'){
                console.log('$scope.edit[editFor]',$scope.edit[editFor])
                $.post(MY_CONSTANT.url + '/admin/edit_vehicle_details', {
                    access_token: localStorage.getItem('access_token'),
                    driver_id: $scope.driver.driver_id,
                    car_name: $scope.car_info.car_name,
                    car_type: $scope.car_info.car_type,
                    car_no: $scope.car_info.car_no,
                    passenger_count: $scope.car_info.passenger_count,
                })
                .success(function(data) {
                    console.log('Edit successful.',data);
                    $rootScope.openToast('success', 'Car details updated successfully','');
                    $scope.edit[editFor] = false;
                })
                .error(function (data) {
                    console.log('Error occured on edit',data);
                    $rootScope.openToast('danger', 'Something went wrong. Updation failed!','');
                });
            }

        }

        $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY')
        .split(' ').map(function(state) {
            return {abbrev: state};
        });

        /* test end */

        $scope.data = {
            selectedIndex: $stateParams.selectedIndex || 0,
            secondLocked:  false,
            secondLabel:   "Documents",
            bottom:        false
        };
        $scope.next = function() {
            $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
        };
        $scope.previous = function() {
            $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
        };

        $scope.isActive = true;

        $scope.toggleActive = function(v) {

            if(v === 'driver_info' || v === 'car_info') {
                $scope.isActive = true;
            }else {
                $scope.isActive = false;
            }
        };

        // console.log('Driver data LOCAL STORAGE ', localStorage.getItem('driverData'));

        $scope.list_document_types = function() {

            $.post(MY_CONSTANT.url + '/admin/list_document_types', {
                access_token: localStorage.getItem('access_token'),
                region_id: $scope.region_id
            })
            .success(function(data) {

                console.log('firsttttttttttttttttttt',data);
                $scope.docTypes = data.doc_types;
                var driverData = JSON.parse(localStorage.getItem('driverData'));
                $scope.driverID = driverData.driver_id;
                $scope.nextapi();

            });

        }

        $scope.handleSubmit = function(is_form_valid) {
            // this.accntParams.individual.dateOfBirth = this.accntParams.individual.dateOfBirth.toISOString();
            const driver_data = JSON.parse(localStorage.getItem('driverData'));

            if (is_form_valid) {
                const test = {
                    braintree_params: {
                        ...this.accntParams,
                        id: driver_data.driver_id + ''
                    },
                    // 'funding.destination': braintree.MerchantAccount.FundingDestination.Bank,
                    access_token: localStorage.getItem('access_token'),

                };
                console.log("test", test);

                // $.post(MY_CONSTANT.url + '/admin/add_sub_merchant_account', {
                //         ...test
                //     })
                //     .success(function (data, status) {

                //         console.log(data);

                //     });

                fetch(MY_CONSTANT.url + '/add_sub_merchant_account',
                    {
                        headers: {
                            'content-type': 'application/json'
                        },
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify(test)
                    }
                ).then(res => res.json())
                .then(res => {
                    console.log('res', res);
                    if(res.flag === 3108) {
                        // Submerchant account generated successfully.
                        $rootScope.openToast("error", res.error, "");
                    }

                    if (res.flag === 3109) {
                        // Submerchant account generated successfully.
                        $rootScope.openToast("success", "Record saved successfully", "");
                    }
                })
                .catch(err => {
                    console.log('err', err);
                    $rootScope.openToast("error", "Something went wrong, please try again later", "");
                });


            }

        };

        $scope.get_all_car_types = function() {

            $.post(MY_CONSTANT.url + '/get_all_car_types', {
            access_token: localStorage.getItem('access_token'),
            })
            .success(function (data,status) {
            console.log(data);
            $scope.carTypes=data.car_types;
            });

        }

        $scope.get_all_docs = function() {

            $.post(MY_CONSTANT.url + '/admin/get_all_docs', {
                access_token: localStorage.getItem('access_token'),
                is_verified: 2,
                new_driver_id: $scope.driverID,
                limit: 50,
                offset: 0,
                region_id: $scope.region_id,
                test: 666
                
            })
            .success(function (data,status) {

                console.log(data);
                $scope.docLength = data.docs.length;
                $scope.docs = data.docs;
                $scope.driver.docs = [];

                for(var i=0; i< $scope.docLength; i++){
                    if($scope.docs[i].document_type_id == 1){
                        $scope.driver.dmv_license = $scope.docs[i].document_url;
                        if($scope.driver.dmv_license.length<3)$scope.driver.dmv_license='';
                        // console.log($scope.driver.dmv_license);
                        $scope.$apply();
                    }
                    else if($scope.docs[i].document_type_id == 2){
                        $scope.driver.tlc_number = $scope.docs[i].document_url;
                        if($scope.driver.tlc_number.length < 3)$scope.driver.tlc_number='';
                        // console.log($scope.driver.tlc_number);
                        $scope.$apply();
                    }
                    else{
                        if($scope.docs[i].document_url > 3)
                        $scope.driver.docs.push($scope.docs[i].document_url);
                        console.log($scope.driver.docs);
                        $scope.$apply();
                    }
                }
            });

        }

        if(!localStorage.getItem('driverData')) {
          $state.go('drivers.appointments');
        }
        else {

            $rootScope.showloader = false;
            $scope.driver = {};
            $scope.driver.tlc_number = '';
            $scope.driver.dmv_license = '';
            $scope.driver = JSON.parse(localStorage.getItem('driverData'));

            $scope.driverID = $scope.driver.driver_id;
            $scope.is_verified = $scope.driver.is_verified;
            $scope.is_blocked = $scope.driver.is_blocked;
            $scope.region_id = $scope.driver.region_id;

            console.log('driverid_driverid', $scope.driverID);
            console.log('region_id_region_id', $scope.region_id);
            console.log('is_verifiedis_verified', $scope.is_verified);

            if($scope.driver.uber_rating>0)$scope.driver.uberUser='Yes';
            else $scope.driver.uberUser='No';
            if($scope.driver.lyft_rating>0)$scope.driver.lyftUser='Yes';
            else $scope.driver.lyftUser='No';
            $scope.driverProfile='Driver ID '+$scope.driver.driver_id;
            if($scope.driver.dmv_num==null||$scope.driver.dmv_num=="null") $scope.driver.dmv_num='Na';
            if($scope.driver.tlc_num==null||$scope.driver.tlc_num=="null") $scope.driver.tlc_num='Na';
            console.log('Driver INFO: ', $scope.driver);

            $scope.list_document_types();
           // $scope.get_all_car_types();
            $scope.get_all_docs();

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
          $scope.driverApproved ? $state.go('drivers.approved') : $state.go('drivers.appointments')
        }

        $scope.driver.car_no = '';

        $scope.approveDriver = function() {
          // car_type: $scope.driver.carType.car_type,
          // car_type_name: $scope.driver.carType.car_name,
          // $scope.driver.carType.car_type&&
         // if($scope.driver.car_no != ''){

            $.post(MY_CONSTANT.url + '/admin/approve_driver', {
                  access_token: localStorage.getItem('access_token'),
                  driver_id: $scope.driver.driver_id,
                 // car_no: $scope.driver.car_no
            })
            .success(function (data, status) {
                $rootScope.openToast('success','Driver Approved Sucessfully','');
                $state.go('drivers.approved');
            });

          /* }
          else {
            if($scope.driver.car_no=='') $rootScope.openToast('error','Choose a car number','');
            // if(!$scope.driver.carType.car_type) $rootScope.openToast('error','Choose a car type','');
          } */
        }

        $scope.downloadForm = function(){
          var doc = new jsPDF();
          doc.fromHTML($('#driverProfile').html(), 15, 15, {
              'width': 170,
              'format': [4, 2]
          });

          doc.save('driverProfile.pdf');
        }

        $scope.addDocDialog = function() {
          $scope.type=0;
            ngDialog.open({
                template: 'document_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };

        $scope.newDoc = {
            reminder_before: '30'
        };

        $scope.addNewDocDialog = function(document_type_id, document_name, doc_type) {

            $scope.newDoc_type_id= document_type_id;
            $scope.newDoc_name= document_name;
            $scope.doc_type= doc_type;
            console.log('doc_type', $scope.doc_type);

            ngDialog.open({
                template: 'addNewDocDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        }

        $scope.addNewFile = function(files) {
            console.log(files);
            processNewfile(files[0]);
            // $scope.doc.doc_file=files[0];
            $scope.newDoc.doc_file_name = files[0].name;
            $scope.$apply();
        }

        function processNewfile(file) {

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
                    var resized = resizeNewImg(image); // send it to canvas
                    // console.log(resized);
                    $scope.dataURItoNewBlob(resized);
                }
            };
        }

        function resizeNewImg(img) {

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


        getVehicleDetails(); //get car details data;

        $scope.dataURItoNewBlob = function(dataURI) {

            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], {
                type: 'image/jpeg'
            });
            $scope.newDoc.doc_file = blob;
            // $scope.$apply();
        };

        $scope.addNewDocType = function(newDoc, newDoc_type_id, doc_type) {

            newDoc.newDoc_type_id = newDoc_type_id;
            newDoc.doc_type = doc_type;
            console.log('newDoc', newDoc);

            if (newDoc.newDoc_type_id === undefined) {
                // alert('Select Document Type');
                $rootScope.openToast('error','Select Document Type','');
                return false;
            }
            if (newDoc.expiry_date === '') {
                // alert('Select Expiry Date');
                $rootScope.openToast('error','Select Expiry Date','');
                return false;
            }

            $scope.submitText='Uploading...';

            var form = new FormData();
            // form.append('access_token', localStorage.getItem('access_token'));
            // form.append('document_type_id', doc.docType.document_type_id);
            // form.append('reminder_before', doc.reminder_before);
            // form.append('expiry_date', moment(doc.expiry_date).format());
            // form.append('pre_reg_driver_id', $scope.driverID);
            // form.append('doc_file', doc.doc_file);
            if(newDoc.expiry_date < moment().subtract(1, 'days').calendar()) {
                return;
            }

            form.append('access_token', localStorage.getItem('access_token'));
            form.append('document_type_id',newDoc.newDoc_type_id);
            form.append('reminder_before', newDoc.reminder_before || '30');
            form.append('expiry_date', moment(newDoc.expiry_date).format());
            form.append('new_driver_id', $scope.driverID);
            form.append('doc_file', newDoc.doc_file);
            form.append('doc_type', newDoc.doc_type);

            $http.post(MY_CONSTANT.url + '/admin/upload_driver_doc', form, {
                headers: {
                    'Content-Type': undefined
                }
            })
            .success(function(data, status) {

                console.log('uploadData', data);

                if (data.flag == 1303) {
                    $scope.submitText='Submit';
                    $rootScope.openToast('success','New Document Added Sucessfully','');
                    ngDialog.close({
                        template: 'addNewDocDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });

                    $scope.docsList = [];
                    $scope.pendingDocsList = [];

                    $scope.list_document_types();
                    $scope.get_all_car_types();
                    $scope.get_all_docs();
                    // $state.reload();
                    $state.go('drivers.driverDetails');
                }
                if (data.flag == 1302) {
                    $scope.submitText='Submit';
                    $rootScope.openToast('success','A valid document of this type already exist for this driver.', '');
                    ngDialog.close({
                        template: 'addNewDocDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });

                }
            })
        }
        $scope.pendingDocsList = [];

        $scope.getPendingDocsList = function() {

            // var allDocTypes = [
            //     {document_type_id: 1, document_name: "Driving License"},
            //     {document_type_id: 2, document_name: "PAN Card"},
            //     {document_type_id: 3, document_name: "Aadhar"},
            //     {document_type_id: 4, document_name: "GST IN"}
            //     ];

            // var driverDocs = [
            //     {document_type_id: 1, document_name: "Driving License"},
            //     {document_type_id: 4, document_name: "GST IN"}
            //     ];

            var driverDocs = $scope.docsList;
            $scope.car_info.driverDocs = driverDocs;
            var driver = JSON.parse(localStorage.getItem("driverData"));
            //$scope.car_info.car_name = driver.car_name;
            //$scope.car_info.car_type = driver.car_type;

            var allDocTypes =  $scope.docTypes;

            console.log('driverDocs', driverDocs);
            console.log("car_info", $scope.car_info);
            console.log('allDocTypes', allDocTypes);

                // Rejecting the allDocTypes that have "some" (at least one) match in the other list.
                function getUnmatched(allDocTypes, driverDocs) {
                   return _.reject(allDocTypes, function(country) {
                       return _.some(driverDocs, function(match) {

                            return country.document_type_id === match.document_type_id;

                       });
                   });
                };

            _.each(getUnmatched(allDocTypes, driverDocs), function(unmatched) {
                // console.log('unmatched', unmatched);
                $scope.pendingDocsList.push(unmatched);

            });

            console.log('$scope.pendingDocsList', $scope.pendingDocsList);

        }

        $scope.nextapi=function() {

            $.post(MY_CONSTANT.url + '/admin/get_all_docs', {
                access_token: localStorage.getItem('access_token'),
                is_verified: 2,
                new_driver_id: $scope.driverID,
                limit: 50,
                offset: 0,
                region_id: $scope.region_id,
                test: 555
            })
            .success(function(data, status) {

                console.log('get_all_docsget_all_docs', data);
                $scope.docLength = data.docs.length;
                $scope.docsList = data.docs;

                for (var i = 0; i < $scope.docsList.length; i++) {
                    for (var j = 0; j < $scope.docTypes.length; j++) {
                        if ($scope.docsList[i].document_type_id == $scope.docTypes[j].document_type_id) {
                            $scope.docsList[i].document_name = $scope.docTypes[j].document_name;
                        }
                    }
                }
                console.log('docsList', $scope.docsList);
                $scope.getPendingDocsList();
            });
        }

        $scope.valid_invalid_doc = function(doc_id, valid_flag) {

            console.log('doc_id', doc_id);
            console.log('valid_flag', valid_flag);

            $.post(MY_CONSTANT.url + '/valid_invalid_doc', {
                access_token: localStorage.getItem('access_token'),
                doc_id: doc_id,
                valid_flag: valid_flag
            })
            .success(function(data, status) {

                var msg = '';
                $scope.docsList = [];
                $scope.pendingDocsList = [];

                console.log('Success_valid', data.message);
                if(data.flag == 1306) {
                    console.log("Working hg");
                    msg  = data.message;

                    $rootScope.openToast('success', msg, '');
                    $scope.nextapi();

                }else {
                    msg  = data.message;
                    console.log("2");

                    $rootScope.openToast('success', msg, '');
                    $scope.nextapi();
                }
                $state.go('drivers.driverDetails');

            });

        }

        $scope.doc = {};
        $scope.driver.carType = {};
        $scope.doc.expiry_date = '';
        $scope.doc.reminder_before = '30';

        $scope.typeSelect = function(a) {
            $scope.doc.docType = a;
        }

        $scope.carSelect = function(a) {
            $scope.driver.carType = a;
        }

        $scope.file_to_upload = function(files) {
            // console.log(files)
            processfile(files[0]);
            // $scope.doc.doc_file=files[0];
            $scope.doc.doc_file_name = files[0].name;
            $scope.$apply();
        }

         $scope.reloadPage = function(){
            $state.go($state.current, {}, {reload: true});
        }

        $scope.verify_driver_doc = function(doc_id) {

            $.post(MY_CONSTANT.url + '/admin/verify_driver_doc', {
                access_token: localStorage.getItem('access_token'),
                doc_id: doc_id
            })
            .success(function(data, status) {

                var msg = '';
                console.log('tatatatattatatatat', data);

                if(data.flag == 1307) {
                    msg  = data.message;
                    //$state.reload();
                    var index = $scope.docsList.findIndex(function (doc) {
                        return doc.doc_id == doc_id
                    });
                    $scope.docsList[index].is_verified = 1;
                    $rootScope.openToast('success', msg,'');
                }else {
                    msg  = data.message;
                    $rootScope.openToast('success', msg,'');
                }

                //$scope.reloadPage();

            });

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
            // form.append('access_token', localStorage.getItem('access_token'));
            // form.append('document_type_id', doc.docType.document_type_id);
            // form.append('reminder_before', doc.reminder_before);
            // form.append('expiry_date', moment(doc.expiry_date).format());
            // form.append('pre_reg_driver_id', $scope.driverID);
            // form.append('doc_file', doc.doc_file);

            form.append('access_token', localStorage.getItem('access_token'));
            form.append('document_type_id', doc.docType.document_type_id);
            form.append('reminder_before', doc.reminder_before || '30');
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
