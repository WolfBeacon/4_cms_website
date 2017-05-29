angular.module('SponsorForm')
    .controller('LoginController', ['$state', '$timeout', 'authService', 
    function loginController($state, $timeout, authService) {
        if (!authService.isAuthenticated()) {
            authService.login();
        } else {
            $timeout(function() {
                $state.go('home');
            });
        }
    }]);