  angular.module('SponserForm', ['LocalStorageModule'])
    .controller('FormController', ['$scope','localStorageService', function($scope, localStorageService) {


    	new Imgur({
            clientid: 'cc86a8de0e7c459',
            callback: feedback
        });

  // To add to local storage
  localStorageService.set('localStorageKey','Test123');

  // Read that value back
  var value = localStorageService.get('localStorageKey');



  //$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml('<label>test123</label>');
 //$scope.thisCanBeusedInsideNgBindHtml = '<label>test123</label>';
  

  //For the MM/HH field you need a 'input mask' 

  	  $scope.master = {};

  	  $scope.data = {
  	  	hackathon_name: "",
        hackathon_logo_url: "",
        hackaton_type: {
          University: false,
          Company: false,
          HighSchool: false,
          Other: false },
        hackathon_start_date: new Date(2015, 9, 22),
        hackathon_end_date:  new Date(2015, 9, 23),
        hackathon_timetable: {
          e1: {date: "", from: "", to: "", event_desc: ""},
          e2: {date: "", from: "", to: "", event_desc: ""},
          e3: {date: "", from: "", to: "", event_desc: ""},
          e4: {date: "", from: "", to: "", event_desc: ""}
        },
        hackathon_location: "",
        hackathon_floorplan_urls: {},
        hackathon_size: 0,
        hackathon_desc: "",
        hackathon_travel: false,
        hackathon_links: {
        	h_website: "",
        	h_facebook: "",
        	h_twitter: "",
        	h_slack: "",
        	h_medium: "",
        	h_snapchat: "",
        	h_devpost: ""
        },
        hackathon_sponsers: {},
        hackathon_judges: {},
        hackathon_prizes: {},
        hackathon_hardware: {},
        hackathon_contact: ""
  	  };


      $scope.update = function(current) {
        $scope.master = angular.copy(current);
      };

      $scope.reset = function() {
        $scope.data = angular.copy($scope.master);
      };

      //$scope.reset();


       var feedback = function (res) {
            if (res.success === true) {

              $scope.data.hackathon_logo_url = res.data.link;
               console.log(res.data.link);
            }
        };

    



    }]);