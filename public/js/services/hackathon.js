'use strict';

angular.module('SponsorForm')
 .factory('submit', ['$http', function($http) {

    var urlBase = '/api';   

    return {
      submitHackathon: function (data) {
        return $http.post(urlBase + '/submitHackathon', data)
      }
    };

}]);
/*  .factory('Hackathon', ['$resource', function ($resource) {
    return $resource('wolfbeacon-cms/hackathons/:id', {}, {
      'query': { method: 'GET', isArray: true},
      'get': { method: 'GET'},
      'update': { method: 'PUT'}
    });
  }]);*/
