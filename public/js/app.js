// Declare app level module which depends on filters, and services
angular.module('SponsorForm', ['LocalForageModule', 'ngAnimate', 'ngAria', 'ngResource', 'ui.materialize', 'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home/home.html', 
        controller: 'HomeController'})
      .otherwise({redirectTo: '/'});
  }]);
