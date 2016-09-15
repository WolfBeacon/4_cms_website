  angular.module('SponsorForm', ['LocalStorageModule'])
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
        hackathon_type: {
          University: false,
          Company: false,
          HighSchool: false,
          Other: false },
        hackathon_start_date: new Date(2016, 9, 22),
        hackathon_end_date:  new Date(2016, 9, 23),
        hackathon_timetable: [
          {date: "", from: "", to: "", event_desc: "Registration"},
          {date: "", from: "", to: "", event_desc: "Hacking Starts"},
          {date: "", from: "", to: "", event_desc: "Sponsor Presentation"},
          {date: "", from: "", to: "", event_desc: "Closing Ceremony"}
        ],
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
        hackathon_sponsors: {},
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
	  
	  $scope.removeRow = function(time) {
		  var index = $scope.data.hackathon_timetable.indexOf(time);
		  if (index >= 0) {
			$scope.data.hackathon_timetable.splice(index, 1);
		  }
	  };
	  
	  $scope.addRow = function() {
		  $scope.data.hackathon_timetable.push({date: "", from: "", to: "", event_desc: ""});
	  };

      //$scope.reset();


       var feedback = function (res) {
            if (res.success === true) {

              $scope.data.hackathon_logo_url = res.data.link;
               console.log(res.data.link);
            }
        };

    



    }]);