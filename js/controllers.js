'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('JobListCtrl', ['$scope', '$stateParams', 'DataManagerService', '$resource', '$uibModal', '$log', function($scope, $stateParams, DataManagerService, $resource, $uibModal, $log) {

    var type = $stateParams.type;
    type = type.firstUpperCase();
    DataManagerService.getJobs(type).then(function(data) {
        $scope.jobs = data;

    });

    $scope.currentPage = 1;

    $scope.type = $stateParams.type;
    $scope.isopen = false;

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.isopen = !$scope.isopen;
    };
    $scope.maxSize = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
        console.log(pageNo);
        $scope.jobs = $scope.alljobs.slice($scope.currentPage * 10 - 10, $scope.currentPage * 10);
    };
    $scope.pageChanged = function() {
        $scope.jobs = $scope.alljobs.slice($scope.currentPage * 10 - 10, $scope.currentPage * 10);
    };

    $scope.translationData = {
        jobType: type
    };

    $scope.newJob = function(type) {
        var job = {"jobName": "", "agency": "Test Agency", "email": "", "description": ""};
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'partials/newJob.html',
            controller: 'JobModalCtrl',
            //size: size,
            resolve: {
                job: function() {
                    return job;
                },
                type: function() {
                    return type;
                }
            }
        });
        modalInstance.result.then(function (type) {
            $scope.type = type;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.schedule = function(size) {
        var job = {"jobName": "", "agency": "Test Agency", "email": "", "description": ""};
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'partials/schedule.html',
            controller: 'ScheduleModalCtrl',
            windowClass: 'app-modal-window',
            resolve: {

            }
        });
        modalInstance.result.then(function (type) {
            $scope.type = type;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

}]);

dmApp.controller('JobModalCtrl', function ($scope, $uibModalInstance, job, type) {

    type = type.firstUpperCase();
    $scope.translationData = {
        jobType: type,
        value: 'Name'
    };
    $scope.job = job;
    $scope.createJob = function () {
        console.log(job);
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

dmApp.controller('ScheduleModalCtrl', function ($scope, $uibModalInstance) {

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.status = {
        opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };
    $scope.options = {
        scheduleStatus: 'On Hold',
        status: ['On Hold', 'Active']
    };

    $scope.schedule = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});




dmApp.controller('WorkspaceCtrl', ['$scope', '$stateParams', 'DataManagerService', function($scope, $stateParams, DataManagerService) {
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
}])

dmApp.controller('JobDetailCtrl', ['$scope', '$stateParams', '$state', 'DataManagerService', '$uibModal', function($scope, $stateParams, $state, DataManagerService, $uibModal) {

    if($stateParams.key == 'summary') {
        return $state.go('job.summary',{jobName: $stateParams.jobName})
    }else if($stateParams.key == 'aca') {
        return $state.go('job.aca', {jobName: $stateParams.jobName})
    }

    var feature = $stateParams.key;
    var colTyp = '';
    if(feature == 'record') {
        colTyp = 'RecordType';
    }else if(feature == 'addrType') {
        colTyp = 'AddrType';
    }

    DataManagerService.getColDef().then(function(data) {
        $scope.cols = data[colTyp];
    });
    DataManagerService.getAll(feature).then(function(data) {
        $scope.allrows = data.result;
    });
    $scope.$watch('allrows', function() {
        if(!angular.isUndefined($scope.allrows)) {
            $scope.totalItems = $scope.allrows.length;
            $scope.rows = $scope.allrows.slice(0, 10);
        }
    });
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function() {
        $scope.rows = $scope.allrows.slice($scope.currentPage * 10 - 10, $scope.currentPage * 10);
    };

    $scope.showConflict = function(size) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'partials/conflict.html',
            controller: 'ScheduleModalCtrl',
            //windowClass: 'app-modal-window',
            size: size,
            resolve: {

            }
        });
        modalInstance.result.then(function (type) {
            $scope.type = type;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }
}]);

dmApp.controller('SummaryCtrl', ['$scope', '$http', function($scope, $http) {
    //$http.get('/portlets/commons/datamanager/js/test.json').success(function(data) {
    //    $scope.cols = data.columns.slice(1);
    //    $scope.rows = data.result;
    //})

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.status = {
        opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };
    $scope.options = {
        scheduleStatus: 'On Hold',
        status: ['On Hold', 'Active']
    };

}]);

