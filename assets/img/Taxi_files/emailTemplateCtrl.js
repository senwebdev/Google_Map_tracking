/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.emailTemplate0')
        .controller('emailTemplateCtrl0', emailTemplateCtrl0);
    function emailTemplateCtrl0($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $scope.template_id = '';
        $scope.template = {};

        var dataArray = [];

        $http.post("http://52.36.135.147:3002" + '/ViewDetailsofEmailTemplates',
            {
                access_token: localStorage.getItem('access_token')
            }).success(function(response,status){

                if (response.status== 200) {
                    var templates = response.data;
                    templates.forEach(function (column) {
                        var d = {};
                        d.email_from = column.email_from;
                        d.email_template_default_html = column.email_template_default_html;
                        d.email_template_default_subject = column.email_template_default_subject;
                        d.email_template_html = column.email_template_html;
                        d.email_template_id = column.email_template_id;
                        d.email_template_name = column.email_template_name;
                        d.email_template_subject = column.email_template_subject;
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    scrollTo(0, 0);
                }
                else{
                    //$state.go('page.login');
                }

            });

        /*--------------------------------------------------------------------------
         *----------------- funtion when car type change ---------------------------
         --------------------------------------------------------------------------*/
        $scope.set = function (id) {
            console.log($scope.template_id,id);
            if(id){
                $scope.template_id=id;
            }
            $http.post("http://52.36.135.147:3002" + '/ViewDetailsofEmailTemplates', {access_token: localStorage.getItem('access_token')})

                .success(function (response) {
                    if (response.status == 200) {
                        var length = response.data.length;
                        for (var i = 0; i < length; i++) {
                            if ($scope.template_id == response.data[i].email_template_id) {
                                //$scope.$apply(function () {
                                    $scope.template = {
                                        email_from: response.data[i].email_from,
                                        email_template_default_html: response.data[i].email_template_default_html,
                                        email_template_default_subject: response.data[i].email_template_default_subject,
                                        email_template_html: response.data[i].email_template_html,
                                        email_template_name: response.data[i].email_template_name,
                                        email_template_subject: response.data[i].email_template_subject
                                    };
                                //});
                            }
                        }
                    }
                    else {
                        $scope.errorMsg = data.message;

                        setTimeout(function () {
                            $scope.errorMsg = "";

                        }, 3000);
                    }
                });
        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion for update car fare ----------------------------
         --------------------------------------------------------------------------*/
        $scope.updateEmailTemplate = function (template) {

            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.template.access_token = localStorage.getItem('access_token');
            $scope.template.uniqueId = $scope.template_id;
            $scope.template.email_template_subject = template.email_template_subject;
            $scope.template.email_template_html = template.email_template_html;
            $scope.template.email_from = template.email_from;

            if($scope.template.uniqueId == '' || $scope.template.uniqueId == undefined) {
                $scope.errorMsg = "Please select template type";
                setTimeout(function () {
                    $scope.errorMsg  = "";

                }, 3000);
            }
            else{
                $http.post("http://52.36.135.147:3002" + '/UpdateDetailsofEmailTemplates', $scope.template
                ).success(
                    function (data) {
                        //data = JSON.parse(data);

                        if (data.status == 200) {
                            $scope.successMsg = data.message;
                            //alert('Updated email template successfully');
                            $scope.promo = {};

                            setTimeout(function () {
                                $scope.successMsg = "";

                            }, 3000);
                        } else {
                            $scope.errorMsg = data.message;

                            setTimeout(function () {
                                $scope.errorMsg = "";

                            }, 3000);
                        }
                        scrollTo(0, 0);
                    });
            }


        };


    }
})();
