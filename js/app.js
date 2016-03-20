'use strict';

var dmApp = angular.module('dmApp', ['ui.router', 'ui.bootstrap', 'ui.tree', 'ngResource', 'pascalprecht.translate'])
dmApp.config(function($stateProvider){
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "partials/home.html"
        })
        .state('newDM', {
            url: "/newDM",
            templateUrl: "partials/newDM.html",
            controller: "ServerListCtrl"
        })
        .state('export', {
            url: "/:server/:agency/:type/list",
            templateUrl: "partials/jobList.html",
            controller: "JobListCtrl"
        })
        .state('feature', {
            url: "/:type",
            templateUrl: "partials/jobList.html",
            controller: "JobListCtrl"
        })
        .state('job', {
            url: "/:type/job/:jobName",
            abstract: true,
            templateUrl: "partials/workspace.html",
            controller: "WorkspaceCtrl"
        })
        .state('job.detail', {
            url: "/:key",
            templateUrl: "partials/dataList.html",
            controller: "JobDetailCtrl"
        })
        .state('job.summary', {
            url: "/summary",
            templateUrl: "partials/summary.html",
            controller: "SummaryCtrl"
        })
        .state('job.aca', {
            url: "/aca",
            templateUrl: "partials/acaPage.html",
            controller: ""
        })
});
dmApp.run(function ($rootScope,$state,$log) {
    $rootScope.$log = $log;
    $rootScope.$state = $state;
})

dmApp.config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home')
});
dmApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en-us');
}]);




















