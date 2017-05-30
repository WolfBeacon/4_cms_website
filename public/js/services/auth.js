'use strict';

angular.module('SponsorForm')
 .service('authService', ['$state', 'lock', '$timeout', 'authManager',
 function authService($state, lock, $timeout, authManager) {
    return {
      userProfile: function() {
        return JSON.parse(localStorage.getItem('profile')) || {};
      },
      login: function () {
        lock.show();
      },
      registerAuthenticationListener: function () {
        lock.on('authenticated', function (authResult) {
          localStorage.setItem('access_token', authResult.accessToken);
          localStorage.setItem('id_token', authResult.idToken);
          authManager.authenticate();
          lock.getProfile(authResult.idToken, function (error, profile) {
            if (error) {
              return console.log(error);
            }
            localStorage.setItem('profile', JSON.stringify(profile));
            $state.go('home');
          });
        });

        lock.on('authorization_error', function (err) {
          $timeout(function() {
            $state.go('login');
          });
          console.log(err);
        });
      },
      logout: function () {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        authManager.unauthenticate();
        $state.go('login');
      },
      isAuthenticated: function() {
        return authManager.isAuthenticated();
      }
    }
  }]);