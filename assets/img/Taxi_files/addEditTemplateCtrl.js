/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.addEditTemplate')
        .controller('addEditTemplateCtrl', addEditTemplateCtrl);
    function addEditTemplateCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $rootScope.showloader=false;
        $scope.template={};
        $scope.template.email_template_html='';
        $scope.template.template_variables='';
        if(localStorage.getItem('templateMode')=='add'){
          $scope.template.templateMode='add';
        }
        else{
          $scope.template=JSON.parse(localStorage.getItem('template'));
          console.log($scope.template);
          $scope.template.templateMode='edit';
          if($scope.template.template_variables!=''){
            var template_variables=$scope.template.template_variables.split(',');
            console.log(template_variables);
            for(var i=0;i<template_variables.length;i++){
              console.log(template_variables[i]);
              var t=$scope.template.template_content.replace(template_variables[i],'{{'+template_variables[i]+'}}');
              $scope.template.template_content=t.replace('{{'+template_variables[i]+'}}','{{'+template_variables[i]+'}}');
              console.log($scope.template.template_content);
            }
          }
          console.log($scope.template.template_content);
        }
        $scope.list=[
          {
            email_template_id:0,
            email_template_name:'Body'
          }

          // {
          //   email_template_id:1,
          //   email_template_name:'Base Email'
          // }
        ];

        $scope.set = function(id){
          $scope.template.template_type_id=id;
        }

        $scope.addEditEmailTemplate = function(template){

            var t= template.template_content;
            // var variables = t.match(/{{(.*)}}/);
            // console.log(variables);


            var re = /{{((?!}}{{)[a-zA-Z0-9_-]*)}}/g;
            var m;
            var v=[];
            while (m = re.exec(t)) {
              v.push(m[1])
              console.log(m[1]);
            }
            for (var i = 0; i < v.length; i++) {
                if (i == 0)
                    template.template_variables= v[i];
                else
                    template.template_variables = template.template_variables + "," + v[i];
            }

            console.log(template.template_variables);


            // return false;
            console.log(template.template_type_id);
            var t=template.template_content;
            var t1=t.replace(/{{/g,'');
            var t2=t1.replace(/}}/g,'');
            template.template_content=t2;
            if(template.templateMode=='add'&&!template.template_type_id){
              $rootScope.openToast('error','Select template type','');
              return false;
            }
            if(template.templateMode=='add'){
              $.post(MY_CONSTANT.url + '/add_template',{
                access_token: localStorage.getItem('access_token'),
                template_type:template.template_type_id,
                template_name:template.template_name,
                template_content:template.template_content,
                template_variables:template.template_variables,
                subject:template.subject
              })
              .success(function(data, status) {
                console.log(data.flag);
                $scope.mode='saved';
                if (data.flag != 1403) {
                  // alert("No Such region");
                  $rootScope.openToast('error','Some Error Occured','');
                  $state.reload();
                }
                if (data.flag == 1403) {
                  // alert('Fare Added Sucessfully');
                  $rootScope.openToast('success','Template Added Sucessfully','');
                  $state.go('emailTemplate');
                }
              })
            }
            else if(template.templateMode=='edit'){
              $.post(MY_CONSTANT.url + '/edit_template',{
                access_token: localStorage.getItem('access_token'),
                template_id:template.template_id,
                template_name:template.template_name,
                template_content:template.template_content,
                template_variables:template.template_variables,
                subject:template.subject
              })
              .success(function(data, status) {
                console.log(data.flag);
                $scope.mode='saved';
                $state.go('emailTemplate');
                if (data.flag != 1402) {
                  // alert("No Such region");
                  $rootScope.openToast('error','Some Error Occured','');
                  $state.reload();
                }
                if (data.flag == 1402) {
                  // alert('Fare Added Sucessfully');
                  $rootScope.openToast('success','Template Edited Sucessfully','');
                  $state.go('emailTemplate');
                }
              })
            }
        }
    }
})();
