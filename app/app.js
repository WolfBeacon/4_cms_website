function updatePicker($root) {

    $root.find('.datepicker, .clockpicker').each(function(elem) {
        var $elem = $(this);
        var $parent = $elem.parent();

        $elem.remove().appendTo($parent);
    });

    $root.find('.datepicker').pickadate({
        min: -1,
        max: new Date(2037, 12, 31),
        formatSubmit: 'yyyy-mm-dd',
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

    $('#show-help').click(function() {
        $('#help-text').slideToggle();
    });

    updatePicker($('form'));
    var service = new google.maps.places.AutocompleteService();

    $('#city').materialize_autocomplete({
        dropdown: {
            el: '#firstDropdown'
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

    $('#address').materialize_autocomplete({
        dropdown: {
            el: '#secondDropdown'
        },
        getData: function(value, callback) {
            service.getPlacePredictions({ input: value, types: ['address'] }, function(data, status) {
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
    .controller('FormController', ['$scope', 'localStorageService', '$timeout', function($scope, localStorageService, $timeout) {

        updatePicker($('form'));

        new Imgur({
            clientid: 'cc86a8de0e7c459',
            callback: function(res, elem) {
                if (res.success === true) {
                    var $elem = $(elem);
                    $scope.$apply(function() {
                        if ($elem.attr("id") === "logo-upload") {
                            $scope.data.logo = res.data.link;
                        } else {
                            $scope.data.floorplan.push(res.data.link);
                        }
                    });
                }
            }
        });

        $scope.data = {
            name: "",
            logo: "",
            type: {
                university: false,
                company: false,
                school: false,
                other: false
            },
            startDate: "",
            endDate: "",
            size: 1,
            desc: "",
            timetable: [
                { date: "", from: "00:00", to: "00:00", description: "Registration", ticket: true },
                { date: "", from: "00:00", to: "00:00", description: "Hacking Starts", ticket: false },
                { date: "", from: "00:00", to: "00:00", description: "Sponsor Presentation", ticket: false },
                { date: "", from: "00:00", to: "00:00", description: "Closing Ceremony", ticket: false }
            ],
            floorplan: [],
            travel: false,
            links: {
                website: "",
                facebook: "",
                twitter: "",
                slack: "",
                medium: "",
                snapchat: "",
                devpost: "",
                other: ""
            },
            sponsors: [
                { rank: 1, organization: "" }
            ],
            judges: [
                { name: "", title: "" }
            ],
            prizes: [
                { name: "", sponsor: "", winners: 1, value: 0, description: "" }
            ],
            hardware: [
                { amount: 1, type: "" }
            ],
            contact: "",
            city: "",
            address: ""
        };

        $scope.backup = angular.copy($scope.data);

        $scope.clickUpdate = function() {
            $scope.update();
            localStorageService.set('localStorageKey', JSON.stringify($scope.master));
            Materialize.toast('Saved data to the cache.', 4000);
        };

        $scope.clickReset = function() {
            $scope.reset();
            Materialize.toast('Reset fields to the saved data.', 4000);
        };

        $scope.update = function() {
            $scope.master = angular.copy($scope.data);
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
            if ($scope.data.timetable.length <= 1) {
                return;
            }
            $scope.data.timetable.splice(index, 1);
        };

        $scope.addRowTimetable = function(index) {
            $scope.addRow($scope.data.timetable, index, { date: "", from: "00:00", to: "00:00", description: "", ticket: false });
        };

        $scope.$watchCollection(function() {
            return $scope.data.timetable;
        }, function(newVal, oldVal) {
            if (newVal === oldVal) {
                return;
            }
            $timeout(function() {
                updatePicker($('#timetables'));
            }, 0, false);
        });

        $scope.removeRowFloor = function(index) {
            $scope.data.floorplan.splice(index, 1);
        };

        $scope.removeRowSponsor = function(index) {
            if ($scope.data.sponsors.length <= 1) {
                return;
            }
            $scope.data.sponsors.splice(index, 1);
        };

        $scope.addRowSponsor = function(index) {
            $scope.addRow($scope.data.sponsors, index, { rank: 0, organization: "" });
        };

        $scope.checkSponsor = function(index) {

            var sponsor = $scope.data.prizes[index].sponsor;
            var has = $scope.data.sponsors.some(function(curr) {
                return curr === sponsor;
            });
            console.log($scope);
            $scope.data.prizes[index].$setValidity("sponsor", has);
        };

        $scope.removeRowJudge = function(index) {
            if ($scope.data.judges.length <= 1) {
                return;
            }
            $scope.data.judges.splice(index, 1);
        };

        $scope.addRowJudge = function(index) {
            $scope.addRow($scope.data.judges, index, { name: "", title: "" });
        };

        $scope.removeRowPrize = function(index) {
            if ($scope.data.prizes.length <= 1) {
                return;
            }
            $scope.data.prizes.splice(index, 1);
        };

        $scope.addRowPrize = function(index) {
            $scope.addRow($scope.data.prizes, index, { name: "", sponsor: "", winners: 1, value: 0, description: "" });
        };

        $scope.removeRowHardware = function(index) {
            if ($scope.data.hardware.length <= 1) {
                return;
            }
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
