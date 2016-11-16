var storageKey = 'WolfBeaconOSH';

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
            links: [
                { text: "Website", slug: "website", value: "", required: true },
                { text: "Facebook", slug: "facebook", value: "" },
                { text: "Twitter", slug: "twitter", value: "" },
                { text: "Slack", slug: "slack", value: "" },
                { text: "Medium", slug: "medium", value: "" },
                { text: "Snapchat", slug: "snapchat", value: "" },
                { text: "DevPost", slug: "devpost", value: "" },
                { text: "Other", slug: "other", value: "" }
            ],
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
            address: "",
            advanced: false,
            advancedQuestions: [
                { name: "", type: "", target: "", options: [], domain: "", limit: -1, policy: "" }
            ],
            userData: [{
                type: "Personal Info",
                target: "all",
                fields: [
                    { name: "Full Name", type: "text", limit: 50, value: true },
                    { name: "Gender", type: "option", options: ["Male", "Female", "Unspecified or Other"], value: true },
                    { name: "Birth Date", type: "date", value: true },
                    { name: "Phone Number", type: "phone", value: true },
                    { name: "E-mail Address", type: "email", value: true },
                    { name: "City of Residence", type: "location", value: true },
                    { name: "GitHub URL", type: "url", domain: "github.com", value: true },
                    { name: "Twitter URL", type: "url", domain: "twitter.com", value: true },
                    { name: "LinkedIn URL", type: "url", domain: "linkedin.com", value: true },
                    { name: "Personal Website URL", type: "url", value: true },
                    { name: "Dietary restrictions", type: "text", limit: 50, value: true },
                    { name: "Reimbursements?", type: "option", options: ["Yes", "No"], value: true },
                    { name: "T-shirt size", type: "option", options: ["XXL", "XL", "L", "M", "S", "XS"], value: true }
                ]
            }, {
                type: "Career Info",
                target: "all",
                fields: [
                    { name: "Level of Study", type: "option", options: ["High School", "Undergraduate", "Graduate"], value: true },
                    { name: "Major of Study", type: "text", limit: 50, value: true },
                    { name: "School last attended", type: "school", value: true },
                    { name: "Current Year of Study", type: "number", value: true },
                    { name: "Graduation Year", type: "number", value: true },
                    { name: "Most recent workplace", type: "text", limit: 50, value: true },
                    { name: "Industry", type: "text", limit: 50, value: true },
                    { name: "Resume", type: "file", value: true }
                ]
            }, {
                type: "Hacker Info",
                target: "hackers",
                fields: [
                    { name: "Goals", type: "multioption", options: ["Learning experience", "Meeting new people", "Win prizes", "Other"], value: true },
                    { name: "Special Hardware", type: "textarea", limit: 200, value: true },
                    { name: "First Hackathon?", type: "option", options: ["Yes", "No"], value: true },
                    { name: "Have a team already in mind?", type: "option", options: ["Yes", "No"], value: true },
                    { name: "Scale of planned project", type: "textarea", limit: 100, value: true }, {
                        name: "Greatest areas of proficiency",
                        type: "multioption",
                        options: ["User Experience and Design (UX / UI)", "Quality Assurance (QA / Testing)", "Front-end Development",
                            "Back-end Development", "Data Analytics", "Mobile App Development", "Application Development",
                            "Information Systems", "Planning / Management", "Other"
                        ],
                        value: true
                    },
                    { name: "Level of experience", type: "option", options: ["Expert", "Advanced", "Intermediate", "Amateur", "Novice"], value: true },
                    { name: "Technical proficiencies", type: "tech", value: true }
                ]
            }, {
                type: "Volunteer Info",
                target: "volunteers",
                fields: [
                    { name: "Why volunteer?", type: "textarea", limit: 300, value: true },
                    { name: "Availability", type: "multidate", value: true },
                    { name: "Previous experience", type: "textarea", limit: 300, value: true }
                ]
            }, {
                type: "Mentor Info",
                target: "mentors",
                fields: [
                    { name: "Why mentor?", type: "textarea", limit: 300, value: true },
                    { name: "Availability", type: "multidate", value: true },
                    { name: "Types of previous experiences", type: "textarea", limit: 100, value: true },
                    { name: "Years of professional experience", type: "number", value: true },
                    { name: "Areas you have experience in", type: "textarea", limit: 100, value: true },
                    { name: "Previous experience and works", type: "textarea", limit: 300, value: true }
                ]
            }, {
                type: "Miscellaneous",
                target: "all",
                fields: [
                    { name: "Other special needs", type: "textarea", limit: 100, value: true },
                    { name: "How you heard about us", type: "textarea", limit: 300, value: true },
                    { name: "Comments or suggestions for us", type: "textarea", limit: 300, value: true }
                ]
            }]
        };
        /*
        Custom questions (question name, type of question, target)
        option/multioption: options, text/textarea: limit, policy: long block text, url: domain
        */
        $scope.targetTypes = ["All", "Hackers", "Volunteers", "Mentors"];
        $scope.questionTypes = {
            "Hardware": "tech",
            "Short text": "text",
            "Long text": "textarea",
            "Single option": "option",
            "Multiple option": "multioption",
            "Numeric": "number",
            "Single date and time": "date",
            "Multiple dates and times": "multidate",
            "File upload": "file",
            "Phone number": "phone",
            "Email address": "email",
            "Location": "location",
            "URL": "url",
            "University or school": "school"
        };
        $scope.questionTypeText = Object.keys($scope.questionTypes);
        $scope.backup = angular.copy($scope.data);

        $scope.clickUpdate = function() {
            $scope.update();
            localStorageService.set(storageKey, JSON.stringify($scope.master));
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
            localStorageService.set(storageKey, JSON.stringify($scope.master));
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

        $scope.isDataBoxChecked = function(index) {
            return $scope.data.userData[index].fields.some(function(el) {
                return el.value;
            });
        };

        $scope.isDataBoxIndeterminate = function(index) {
            return $scope.isDataBoxChecked(index) && !$scope.data.userData[index].fields.every(function(el) {
                return el.value;
            });
        };

        $scope.updateDataBox = function(index) {
            var toSet = !$scope.isDataBoxChecked(index);
            // Set unchecked
            $scope.data.userData[index].fields.forEach(function(el) {
                el.value = toSet;
            });
        };

        try {
            $scope.master = JSON.parse(localStorageService.get(storageKey));
            $scope.reset();
        } catch (e) {
            $scope.master = null;
        }

        if (!$scope.master) {
            $scope.update();
        }
    }])
    .directive('ngIndeterminate', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                scope.$watch(attributes['ngIndeterminate'], function(value) {
                    element.prop('indeterminate', !!value);
                });
            }
        };
    });
