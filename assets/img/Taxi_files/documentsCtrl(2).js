/* Copyrights-Developed by Taxi Technologies INC. */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.documentsAll')
        .controller('documentsAllCtrl', documentsAllCtrl);

    function documentsAllCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
        $scope.title = 'Driver Documents';
        $scope.currentPage = 1;
        $rootScope.showloader=true;
        $scope.itemsPerPage = 10;
        $scope.maxSize = 5;
        $scope.skip = 0;
        var dtInstance;
        $scope.pageChanged = function(currentPage) {
            $scope.currentPage = currentPage;
            console.log('Page changed to: ' + $scope.currentPage);
            for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
                if ($scope.currentPage == i) {
                    $scope.skip = 10 * (i - 1);
                    console.log('Offset changed to: ' + $scope.skip);
                    //$scope.$apply();
                }
            }
            dtInstance.fnDestroy();
            $scope.initTable();
        };
        $.post(MY_CONSTANT.url + '/get_document_types', {
                access_token: localStorage.getItem('access_token'),
            })
            .success(function(data, status) {
                console.log(data);
                $scope.docTypes = data.doc_types;

                $.post(MY_CONSTANT.url + '/get_all_docs', {
                        access_token: localStorage.getItem('access_token'),
                        is_verified: 2
                    })
                    .success(function(data, status) {
                        console.log(data);
                        $scope.docLength = data.docs.length;
                        $scope.docsList1 = data.docs;
                        $scope.docsList=[];
                        for (var i = 0; i < $scope.docsList1.length; i++) {
                            console.log($scope.docsList1[i].document_url.length);
                            if($scope.docsList1[i].document_url.length>3){
                              console.log($scope.docsList1[i].document_url.length>3);
                              for (var j = 0; j < $scope.docTypes.length; j++) {
                                  if ($scope.docsList1[i].document_type_id == $scope.docTypes[j].document_type_id) {
                                      $scope.docsList1[i].document_type_name = $scope.docTypes[j].document_name;
                                      $scope.docsList.push($scope.docsList1[i]);
                                  }
                              }
                            }
                        }
                        $rootScope.showloader=false;
                        $scope.$apply(function() {
                            // var dtInstance;
                            $timeout(function() {
                                if (!$.fn.dataTable) return;
                                dtInstance = $('#datatableDriverDocs').dataTable({
                                    'paging': true, // Table pagination
                                    'ordering': true, // Column ordering
                                    'info': true,
                                    'scrollX': '2000px',
                                    'bDestroy': true,
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
            });
        $scope.doc = {};
        $scope.doc.expiry_date = '2017-05-05 00:00:00';
        $scope.doc.reminder_before = '2';
        $scope.addDocDialog = function() {
            $scope.type = 0;
            ngDialog.open({
                template: 'document_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
            // $scope.$apply();
        };
        $scope.editDocDialog = function(data) {
            $scope.type = 1;
            $scope.doc.document_type_id = data.document_type_id;
            $scope.docName = data.document_type_name;
            $scope.doc.doc_id = data.doc_id;
            ngDialog.open({
                template: 'document_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
            // $scope.$apply();
        };
        $scope.typeSelect = function(a) {
            $scope.doc.docType = a;
            // $scope.$apply();
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
        $scope.addEditDocType = function(doc, type) {
            console.log(doc);
            if (doc.docType === undefined) {
                alert('Select Document Type');
                return false;
            }
            var form = new FormData();
            form.append('access_token', localStorage.getItem('access_token'));
            form.append('document_type_id', doc.docType.document_type_id);
            form.append('reminder_before', doc.reminder_before);
            form.append('expiry_date', doc.expiry_date);
            if (type == 0) {
                form.append('driver_id', $scope.driverID);
                form.append('doc_file', doc.doc_file);
                $http.post(MY_CONSTANT.url + '/admin/upload_driver_doc', form, {
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function(data, status) {
                        console.log(data);
                        if (data.flag == 1303) {
                            $scope.docmsg = 'Document Added Successfully'
                            $timeout(function() {
                                ngDialog.close({
                                    template: 'document_dialog',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                });
                                $scope.docmsg = '';
                                $state.reload();
                            }, 2500);
                        }
                        if (data.flag == 1302) {
                            $scope.docmsg = 'A valid document of this type already exist for this driver.';
                            $timeout(function() {
                                $scope.docmsg = '';
                            }, 2500);
                        }
                    })

            } else {
                // form.append('doc_id',doc.doc_id);
                $.post(MY_CONSTANT.url + '/edit_document', {
                        access_token: localStorage.getItem('access_token'),
                        document_type_id: doc.docType.document_type_id,
                        reminder_before: doc.reminder_before,
                        expiry_date: doc.expiry_date,
                        doc_id: doc.doc_id
                    })
                    .success(function(data, status) {
                        console.log(data);
                        if (data.flag == 1308) {
                            $scope.docmsg = 'Document Edited Successfully'
                            $timeout(function() {
                                ngDialog.close({
                                    template: 'document_dialog',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                });
                                $scope.docmsg = '';
                                $state.reload();
                            }, 2500);
                        }
                        if (data.flag == 1302) {
                            $scope.docmsg = 'A valid document of this type already exist for this driver.';
                            $timeout(function() {
                                $scope.docmsg = '';
                            }, 2500);
                        }
                    })
            }
        }
        $scope.closeThisDialog = function() {
            $scope.doc = {};
        }
        $scope.validate_doc_dialog = function(doc_id, v) {
            $scope.validate = v;
            $scope.doc_id = doc_id;

            ngDialog.open({
                template: 'validate_doc_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };
        $scope.validateDoc = function(docID, flag) {
            $.post(MY_CONSTANT.url + '/valid_invalid_doc', {
                access_token: localStorage.getItem('access_token'),
                doc_id: docID,
                valid_flag: flag
            }).success(function(data) {
                if (data.flag == 1305) {
                    $scope.validatemsg = 'Document Validated Successfully'
                    $timeout(function() {
                        ngDialog.close({
                            template: 'validate_doc_dialog',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                        $scope.validatemsg = '';
                        $state.reload();
                    }, 2500)
                }
                if (data.flag == 1306) {
                    $scope.validatemsg = 'Document Invalidated Successfully'
                    $timeout(function() {
                        ngDialog.close({
                            template: 'validate_doc_dialog',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                        $scope.validatemsg = '';
                        $state.reload();
                    }, 2500)
                }
            })
        }
        $scope.attention_doc_dialog = function(doc_id, a) {
            $scope.attention_required = a;
            $scope.doc_id = doc_id;

            ngDialog.open({
                template: 'attention_doc_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };
        $scope.attentionDoc = function(docID, flag) {
            $.post(MY_CONSTANT.url + '/change_attention_doc', {
                access_token: localStorage.getItem('access_token'),
                doc_id: docID,
                attention_flag: flag
            }).success(function(data) {
                if (data.flag == 1309) {
                    $scope.attentionmsg = 'Attention Raised Successfully'
                    $timeout(function() {
                        ngDialog.close({
                            template: 'attention_doc_dialog',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                        $scope.attentionmsg = '';
                        $state.reload();
                    }, 2500)
                }
                if (data.flag == 1310) {
                    $scope.attentionmsg = 'Attention Withdrawn Successfully'
                    $timeout(function() {
                        ngDialog.close({
                            template: 'attention_doc_dialog',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                        $scope.attentionmsg = '';
                        $state.reload();
                    }, 2500)
                }
            })
        }
        $scope.verify_doc_dialog = function(doc_id) {

            $scope.doc_id = doc_id;

            ngDialog.open({
                template: 'verify_doc_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };
        $scope.verify = function(docID) {
            $.post(MY_CONSTANT.url + '/verify_doc', {
                access_token: localStorage.getItem('access_token'),
                doc_id: docID
            }).success(function(data) {
                if (data.flag == 1307) {
                    $scope.verifymsg = 'Document Verified Successfully'
                    $timeout(function() {
                        ngDialog.close({
                            template: 'verify_doc_dialog',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                        $scope.verifymsg = '';
                        $state.reload();
                    }, 2500)
                }
            })
        };
    }
})();
