  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    onClose: function(val) {
        val = this.get();

        var modelName = this.$node.attr("ng-model");
        var scope = angular.element(this.$node).scope();
        scope.$apply(function() {
            scope.data[modelName] = val;
        });
    }
  });

  angular.module('SponsorForm', ['LocalStorageModule'])
    .controller('FormController', ['$scope','localStorageService', function($scope, localStorageService) {


    	new Imgur({
            clientid: 'cc86a8de0e7c459',
            callback: function (res) {
	            if (res.success === true) {

	              $scope.data.hackathon_logo_url = res.data.link;
	               console.log(res.data.link);
	            }
	        }
        });

  	  $scope.data = {
        hackathon_logo_url: "",
        hackathon_type: {
          University: false,
          Company: false,
          HighSchool: false,
          Other: false
      	},
        hackathon_timetable: [
          {date: "", from: "", to: "", event_desc: "Registration"},
          {date: "", from: "", to: "", event_desc: "Hacking Starts"},
          {date: "", from: "", to: "", event_desc: "Sponsor Presentation"},
          {date: "", from: "", to: "", event_desc: "Closing Ceremony"}
        ],
        hackathon_floorplan_urls: [],
        hackathon_travel: false,
        hackathon_links: {
        	h_website: "",
        	h_facebook: "",
        	h_twitter: "",
        	h_slack: "",
        	h_medium: "",
        	h_snapchat: "",
        	h_devpost: "",
        	h_other: ""
        },
        hackathon_sponsors: [
        	{rank: 0, organization: ""}
        ],
        hackathon_judges: [
        	{name: "", title: ""}
        ],
        hackathon_prizes: [
        	{name: "", category: ""}
        ],
        hackathon_hardware: [
        	{amount: 0, type: ""}
        ],
        hackathon_contact: ""
  	  };

      $scope.update = function() {
        $scope.master = angular.copy($scope.data);
  		localStorageService.set('localStorageKey', JSON.stringify($scope.master));
      };

      $scope.reset = function() {
      	if ($scope.master) {
      	  $scope.data = angular.copy($scope.master);
    	}
      };

	  $scope.removeRowTimetable = function(time) {
		  var index = $scope.data.hackathon_timetable.indexOf(time);
		  if (index >= 0 && $scope.data.hackathon_timetable.length > 1) {
			$scope.data.hackathon_timetable.splice(index, 1);
		  }
	  };

	  $scope.addRowTimetable = function() {
		  $scope.data.hackathon_timetable.push({date: "", from: "", to: "", event_desc: ""});
	  };

	  $scope.removeRowSponsor = function(time) {
		  var index = $scope.data.hackathon_sponsors.indexOf(time);
		  if (index >= 0 && $scope.data.hackathon_sponsors.length > 1) {
			$scope.data.hackathon_sponsors.splice(index, 1);
		  }
	  };

	  $scope.addRowSponsor = function() {
		  $scope.data.hackathon_sponsors.push({rank: 0, organization: ""});
	  };

	  $scope.removeRowJudge = function(time) {
		  var index = $scope.data.hackathon_judges.indexOf(time);
		  if (index >= 0 && $scope.data.hackathon_judges.length > 1) {
			$scope.data.hackathon_judges.splice(index, 1);
		  }
	  };

	  $scope.addRowJudge = function() {
		  $scope.data.hackathon_judges.push({name: "", title: ""});
	  };

	  $scope.removeRowPrize = function(time) {
		  var index = $scope.data.hackathon_prizes.indexOf(time);
		  if (index >= 0 && $scope.data.hackathon_prizes.length > 1) {
			$scope.data.hackathon_prizes.splice(index, 1);
		  }
	  };

	  $scope.addRowPrize = function() {
		  $scope.data.hackathon_prizes.push({name: "", category: ""});
	  };


	  $scope.removeRowHardware = function(time) {
		  var index = $scope.data.hackathon_hardware.indexOf(time);
		  if (index >= 0 && $scope.data.hackathon_hardware.length > 1) {
			$scope.data.hackathon_hardware.splice(index, 1);
		  }
	  };

	  $scope.addRowHardware = function() {
		  $scope.data.hackathon_hardware.push({amount: "", type: ""});
	  };
    	try {
  	  		$scope.master = JSON.parse(localStorageService.get('localStorageKey'));
  	  		$scope.reset();
  	  	} catch(e) {
  	  		$scope.master = null;
  	  	}

  	  	if (!$scope.master) {
  	  		$scope.update();
  	  	}
    



    }]);