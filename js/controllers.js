'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('JobListCtrl', ['$scope', '$stateParams', 'DataManagerService', '$resource', '$uibModal', '$log', '$rootScope', '$timeout', function($scope, $stateParams, DataManagerService, $resource, $uibModal, $log, $rootScope, $timeout) {

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

    $scope.newJob = function() {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'partials/newJob.html',
            controller: 'JobModalCtrl',
            //size: size,
            resolve: {
                type: function() {
                    return type;
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.jobs.push(data);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.schedule = function(size,job) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'partials/schedule.html',
            controller: 'ScheduleModalCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                job: job
            }
        });
        modalInstance.result.then(function () {
            $scope.job = job;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
        //console.log($scope.jobs);
    };

    $scope.jobDetail = function(job) {
        $timeout(function() {
            $rootScope.$broadcast('jobDetail', job);
        }, 100)
    };

}]);

dmApp.controller('JobModalCtrl', function ($scope, $uibModalInstance, type) {

    type = type.firstUpperCase();
    $scope.translationData = {
        jobType: type,
        value: 'Name'
    };
    $scope.createJob = function () {
        $uibModalInstance.close($scope.job);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

dmApp.controller('ScheduleModalCtrl', function ($scope, $uibModalInstance, job) {

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

        job.batchJobModel.scheduleDate = $scope.dt;
        job.batchJobModel.scheduleTime = $scope.mytime;
        job.batchJobModel.scheduleStatus = $scope.options.scheduleStatus;
        $uibModalInstance.close(job);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});




dmApp.controller('WorkspaceCtrl', ['$scope', '$stateParams', 'DataManagerService', '$rootScope', function($scope, $stateParams, DataManagerService) {

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
        console.log(data);
        $scope.job = data;
    });

    $scope.save = function() {
        //console.log($scope.saveData);
        console.log($scope.job);
    };

}])

dmApp.controller('JobDetailCtrl', ['$scope', '$stateParams', '$state', 'DataManagerService', '$uibModal', function($scope, $stateParams, $state, DataManagerService, $uibModal) {

    if($stateParams.key == 'summary') {
        return $state.go('job.summary',{jobName: $stateParams.jobName})
    }else if($stateParams.key == 'aca') {
        return $state.go('job.aca', {jobName: $stateParams.jobName})
    }

    var feature = $stateParams.key;
    var jobType = $stateParams.type;
    var colTyp = '';
    if(feature == 'record') {
        colTyp = 'RecordType';
    }else if(feature == 'addrType') {
        colTyp = 'AddrType';
    }

    DataManagerService.getColDef().then(function(data) {
        $scope.cols = data[colTyp];
    });
    DataManagerService.getAll(feature, jobType).then(function(data) {
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

    $scope.$watch('rows', function() {
        $scope.$emit('saveData', $scope.rows);
    })

    $scope.save = function() {
        console.log($scope.rows)

    }
}]);

dmApp.controller('SummaryCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.$on('jobDetail', function(event, data) {
        $scope.job = data;
        var job = $scope.job;
        $scope.mytime = job.batchJobModel.scheduleTime;
        $scope.dt = job.batchJobModel.scheduleDate;
        $scope.options.scheduleStatus = job.batchJobModel.scheduleStatus;
    });

    $scope.$watch('job', function() {
        $scope.$emit('saveJob', $scope.job);
    })

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

