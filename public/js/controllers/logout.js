angular.module('SponsorForm')
    .controller('LogoutController', ['$state', '$timeout', 'authService', 
    function logoutController($state, $timeout, authService) {
        if (authService.isAuthenticated()) {
            authService.logout();
        } else {
            $timeout(function() {
                $state.go('home');
            });
        }
    }]);