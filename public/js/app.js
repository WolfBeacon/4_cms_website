  'use strict';

  angular
    .module('SponsorForm', 
      ['LocalForageModule', 'angular-jwt', 'ngAnimate', 'ngAria', 'ngResource', 'ui.materialize', 'auth0.lock', 'ui.router'])
    .config([
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'lockProvider',
    'jwtOptionsProvider',
    '$httpProvider',

  function config($stateProvider,$locationProvider,$urlRouterProvider,lockProvider,jwtOptionsProvider,$httpProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'views/callback.html'
      })
      .state('logout', {
        url: '/logout',
        controller: 'LogoutController',
        templateUrl: 'views/callback.html'
      });

    // Initialization for the angular-auth0 library
    lockProvider.init({
      clientID: '0H9D3fjZDCX4Msdpt0gwdnmiYvpnpgJ8',
      domain: 'wolf-beacon.auth0.com',
      options: {
        _idTokenVerification: false
      }
    });



    // Configure a tokenGetter so that the isAuthenticated
    // method from angular-jwt can be used
    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('id_token');
      },
      unauthenticatedRedirectPath: '/login'
    });
      // Add the jwtInterceptor to the array of HTTP interceptors
      // so that JWTs are attached as Authorization headers
      $httpProvider.interceptors.push('jwtInterceptor');

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);
  }])
    .run(['authService',  'lock', 'authManager', '$state', function run(authService, lock, authManager, $state) {
    // Handle the authentication
    // result in the hash
      authService.registerAuthenticationListener();
      authManager.checkAuthOnRefresh();
      lock.interceptHash();
  }]);