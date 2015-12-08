'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('WorkspaceCtrl', ['$scope', '$stateParams', 'DataManagerService', '$rootScope', '$state', function($scope, $stateParams, DataManagerService, $rootScope, $state) {

    $scope.$on('jobDetail', function(event, data) {
        $scope.job = data;
    });
    DataManagerService.getFeatures().then(function(data) {
        $scope.data = data
    });
    $scope.jobName = $stateParams.jobName;
    $scope.type = $stateParams.type;

    var type = $stateParams.type;
    type = type.firstUpperCase();
    $scope.translationData = {
        jobType: type,
        current: 1,
        all: 10
    };

    $scope.$on('saveData', function(event, data) {
       $scope.saveData = data;
    });

    $scope.$on('saveJob', function(event, data) {
        //console.log(data);
        $scope.job = data;
    });

    $scope.save = function() {
        //console.log($scope.saveData);
        console.log($scope.job);
    };

}])


