'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('GlobalCtrl', ['$scope', '$translate', function($scope, $translate) {
    $scope.changeLang = function(key) {
        if(angular.equals(key, 'English')) {
            $translate.use('en-us');
        }else if(angular.equals(key, 'Chinese')) {
            $translate.use('zh-cn');
        }
    };
    $scope.options = {
        lang: 'English',
        langs: ['English', 'Chinese']
    }
}]);

