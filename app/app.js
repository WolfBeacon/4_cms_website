var GOOGLE_KEY = 'AIzaSyBaNRkaMJ0gY7fCPgjsaX0Fr2FuzwJJRnY';

function updatePicker($root) {

    $root.find('.datepicker').pickadate({
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

    $root.find('.clockpicker').clockpicker({ donetext: 'Submit', autoclose: true })
        .find('input').change(function() {
            var val = this.value;

            var modelName = $(this).attr("ng-model");
            modelName = modelName.substr(modelName.indexOf('.') + 1);

            var scope = angular.element('#' + $root.attr('id')).scope();
            scope.$apply(function() {
                scope.data.timetable[modelName] = val;
            });
        });
}
$(document).ready(function() {

    updatePicker($('form'));
    var service = new google.maps.places.AutocompleteService();

    $('#location').materialize_autocomplete({
        dropdown: {
            el: '#singleDropdown'
        },
        getData: function(value, callback) {
            service.getPlacePredictions({ input: value, types: ['(cities)'] }, function(data, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    console.log(status);
                    return;
                }
                var ret = [];
                data.forEach(function(prediction) {
                    ret.push({ id: prediction.place_id, text: prediction.description });
                });
                callback(value, ret);
            });
        }
    });
});

angular.module('SponsorForm', ['LocalStorageModule'])
    .controller('FormController', ['$scope', 'localStorageService', function($scope, localStorageService) {

        updatePicker($('form'));

        new Imgur({
            clientid: 'cc86a8de0e7c459',
            callback: function(res, elem) {
                if (res.success === true) {
                    var $elem = $(elem);
                    $scope.$apply(function() {
                        if ($elem.attr("id") === "logo-upload") {
                            $scope.data.logo_url = res.data.link;
                        } else {
                            $scope.data.floorplan.push(res.data.link);
                        }
                    });
                }
            }
        });

        $scope.data = {
            logo_url: "",
            type: {
                University: false,
                Company: false,
                HighSchool: false,
                Other: false
            },
            timetable: [
                { date: "", from: "00:00", to: "00:00", event_desc: "Registration" },
                { date: "", from: "00:00", to: "00:00", event_desc: "Hacking Starts" },
                { date: "", from: "00:00", to: "00:00", event_desc: "Sponsor Presentation" },
                { date: "", from: "00:00", to: "00:00", event_desc: "Closing Ceremony" }
            ],
            floorplan: [],
            travel: false,
            links: {
                h_website: "",
                h_facebook: "",
                h_twitter: "",
                h_slack: "",
                h_medium: "",
                h_snapchat: "",
                h_devpost: "",
                h_other: ""
            },
            tickets: [
                { name: "Registration" },
                { name: "Breakfast" },
                { name: "Lunch" },
                { name: "Dinner" }
            ],
            sponsors: [
                { rank: 1, organization: "" }
            ],
            judges: [
                { name: "", title: "" }
            ],
            prizes: [
                { name: "", category: "" }
            ],
            hardware: [
                { amount: 1, type: "" }
            ],
            contact: ""
        };

        $scope.backup = angular.copy($scope.data);

        $scope.clickUpdate = function() {
            $scope.update();
            Materialize.toast('Saved data to the cache.', 4000);
        };

        $scope.clickReset = function() {
            $scope.reset();
            Materialize.toast('Reset fields to the saved data.', 4000);
        };

        $scope.update = function() {
            $scope.master = angular.copy($scope.data);
            localStorageService.set('localStorageKey', JSON.stringify($scope.master));
        };

        $scope.reset = function() {
            if ($scope.master) {
                $scope.data = angular.copy($scope.master);
                updatePicker($('form'));
            }
        };

        $scope.clear = function() {
            $scope.master = angular.copy($scope.backup);
            localStorageService.set('localStorageKey', JSON.stringify($scope.master));
        };

        $scope.clickClear = function() {
            $scope.clear();
            Materialize.toast('Cleared all saved data.', 4000);
        };

        $scope.removeRowTimetable = function(index) {
            $scope.data.timetable.splice(index, 1);
        };

        $scope.addRowTimetable = function(index) {
            $scope.addRow($scope.data.timetable, index, { date: "", from: "", to: "", event_desc: "" });
            updatePicker($('#timetables'));
        };

        $scope.removeRowTicket = function(index) {
            $scope.data.tickets.splice(index, 1);
        };

        $scope.removeRowFloor = function(index) {
            $scope.data.floorplan.splice(index, 1);
        };

        $scope.addRowTicket = function(index) {
            $scope.addRow($scope.data.tickets, index, { name: "" });
        };

        $scope.removeRowSponsor = function(index) {
            $scope.data.sponsors.splice(index, 1);
        };

        $scope.addRowSponsor = function(index) {
            $scope.addRow($scope.data.sponsors, index, { rank: 0, organization: "" });
        };

        $scope.removeRowJudge = function(index) {
            $scope.data.judges.splice(index, 1);
        };

        $scope.addRowJudge = function(index) {
            $scope.addRow($scope.data.judges, index, { name: "", title: "" });
        };

        $scope.removeRowPrize = function(index) {
            $scope.data.prizes.splice(index, 1);
        };

        $scope.addRowPrize = function(index) {
            $scope.addRow($scope.data.prizes, index, { name: "", category: "" });
        };

        $scope.removeRowHardware = function(index) {
            $scope.data.hardware.splice(index, 1);
        };

        $scope.addRowHardware = function(index) {
            $scope.addRow($scope.data.hardware, index, { amount: "", type: "" });
        };

        $scope.addRow = function(arr, index, ob) {
            if (index >= arr.length - 1) {
                arr.push(ob);
            } else {
                arr.splice(index + 1, 0, ob);
            }
        };

        try {
            $scope.master = JSON.parse(localStorageService.get('localStorageKey'));
            $scope.reset();
        } catch (e) {
            $scope.master = null;
        }

        if (!$scope.master) {
            $scope.update();
        }
    }]);
