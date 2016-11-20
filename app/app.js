var storageKey = 'WolfBeaconOSH';
var imgurClientId = 'cc86a8de0e7c459';
var service;

function autocomplete(id, data) {
    if (!data) {
        data = [];
    }
    if (!id || !service) {
        return;
    }
    var $elem = $('#' + id);
    if (!$elem || $elem.length <= 0) {
        return;
    }
    var lastVal = $elem.val();
    var type = id;
    if (id === 'city') {
        type = '(cities)';
    }
    $('.autocomplete-content').remove();

    var arg = {};
    data.forEach(function(d) {
        arg[d] = null;
    });

    $elem.off('keyup').off('.change').autocomplete({ data: arg }).keyup().change(function() {
            var val = $(this).val();
            var scope = angular.element('#' + id).scope();
            scope.$apply(function() {
                scope.data[id] = val;
            });
        })
        .on('keyup', function(e) {
            var val = $(this).val();
            if (!e || val === lastVal || e.which === 13 || val.length === 0) {
                return;
            }
            lastVal = val;
            service.getPlacePredictions({ input: val, types: [type] }, function(data, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    console.log(status);
                    return;
                }
                autocomplete(id, data.map(function(prediction) {
                    return prediction.description;
                }));
            });
        });
}

$(document).ready(function() {

    $('#show-help').click(function() {
        $('#help-text').slideToggle();
    });

    service = new google.maps.places.AutocompleteService();

    autocomplete('city');
    autocomplete('address');
});

angular.module('SponsorForm', ['LocalStorageModule', 'ngAnimate', 'ngAria', 'ngResource'])
    .controller('FormController', ['$scope', 'localStorageService', '$timeout', function($scope, localStorageService, $timeout) {

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
                { date: new Date(), from: "00:00", to: "00:00", description: "Registration", ticket: true },
                { date: new Date(), from: "00:00", to: "00:00", description: "Hacking Starts", ticket: false },
                { date: new Date(), from: "00:00", to: "00:00", description: "Sponsor Presentation", ticket: false },
                { date: new Date(), from: "00:00", to: "00:00", description: "Closing Ceremony", ticket: false }
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
                { name: "", type: "", target: "", options: [], domain: "", limit: 100, policy: "" }
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
        $scope.targetTypes = {
            "": "Target",
            "all": "All",
            "hackers": "Hackers",
            "volunteers": "Volunteers",
            "mentors": "Mentors"
        };
        $scope.questionTypes = {
            "": "Type",
            "tech": "Hardware",
            "text": "Short text",
            "textarea": "Long text",
            "option": "Single option",
            "multioption": "Multiple option",
            "number": "Numeric",
            "date": "Single date and time",
            "multidate": "Multiple dates and times",
            "file": "File upload",
            "phone": "Phone number",
            "email": "Email address",
            "location": "Location",
            "url": "URL",
            "school": "University or school",
            "policy": "Agree to terms"
        };
        $scope.backup = angular.copy($scope.data);

        $scope.blur = function() {
            if (document.activeElement) {
                document.activeElement.blur();
            }
        };

        $scope.clickUpdate = function() {
            $scope.blur();
            $scope.update();
            localStorageService.set(storageKey, JSON.stringify($scope.master));
            Materialize.toast('Saved data to the cache.', 4000);
        };

        $scope.clickReset = function() {
            $scope.blur();
            $scope.reset();
            Materialize.toast('Reset fields to the saved data.', 4000);
        };

        $scope.update = function() {
            $scope.master = angular.copy($scope.data);
        };

        $scope.reset = function() {
            if ($scope.master) {
                $scope.data = angular.copy($scope.master);
            }
        };

        $scope.clear = function() {
            $scope.blur();
            $scope.master = angular.copy($scope.backup);
            localStorageService.set(storageKey, JSON.stringify($scope.master));
        };

        $scope.clickClear = function() {
            $scope.blur();
            $scope.clear();
            Materialize.toast('Cleared all saved data.', 4000);
        };

        $scope.removeRowTimetable = function(q) {
            $scope.removeRow($scope.data.timetable, q);
        };

        $scope.addRowTimetable = function(q) {
            $scope.addRow($scope.data.timetable, q, { date: new Date(), from: "00:00", to: "00:00", description: "", ticket: false });
        };

        $scope.removeRowFloor = function(q) {
            $scope.removeRow($scope.data.floorplan, q);
        };

        $scope.removeRowSponsor = function(q) {
            $scope.removeRow($scope.data.sponsors, q);
        };

        $scope.addRowSponsor = function(q) {
            $scope.addRow($scope.data.sponsors, q, { rank: 0, organization: "" });
        };

        $scope.checkSponsor = function(q) {
            var has = $scope.data.sponsors.some(function(curr) {
                return curr === q.sponsor;
            });
            q.$setValidity("sponsor", has);
        };

        $scope.removeRowJudge = function(q) {
            $scope.removeRow($scope.data.judges, q);
        };

        $scope.addRowJudge = function(q) {
            $scope.addRow($scope.data.judges, q, { name: "", title: "" });
        };

        $scope.removeRowPrize = function(q) {
            $scope.removeRow($scope.data.prizes, q);
        };

        $scope.addRowPrize = function(q) {
            $scope.addRow($scope.data.prizes, q, { name: "", sponsor: "", winners: 1, value: 0, description: "" });
        };

        $scope.removeRowHardware = function(q) {
            $scope.removeRow($scope.data.hardware, q);
        };

        $scope.addRowHardware = function(q) {
            $scope.addRow($scope.data.hardware, q, { amount: "", type: "" });
        };

        $scope.removeRowData = function(q) {
            $scope.removeRow($scope.data.advancedQuestions, q);
        };

        $scope.addRowData = function(q) {
            $scope.addRow($scope.data.advancedQuestions, q, { name: "", type: "", target: "", options: [], domain: "", limit: 100, policy: "" });
        };

        $scope.removeRow = function(arr, val) {
            var index = arr.indexOf(val);
            if (arr.length <= 1 || index < 0) {
                return;
            }
            arr.splice(index, 1);
        };

        $scope.addRow = function(arr, val, ob) {
            var index = arr.indexOf(val);
            if (index >= arr.length - 1) {
                arr.push(ob);
            } else {
                arr.splice(index + 1, 0, ob);
            }
        };

        $scope.isDataBoxChecked = function(q) {
            return q.fields.some(function(el) {
                return el.value;
            });
        };

        $scope.isDataBoxIndeterminate = function(q) {
            return $scope.isDataBoxChecked(q) && !q.fields.every(function(el) {
                return el.value;
            });
        };

        $scope.updateDataBox = function(q) {
            var toSet = !$scope.isDataBoxChecked(q);
            // Set unchecked
            q.fields.forEach(function(el) {
                el.value = toSet;
            });
        };

        /*
        option/multioption: options
        */

        try {
            $scope.master = JSON.parse(localStorageService.get(storageKey));
            $scope.master.startDate = new Date($scope.master.startDate);
            $scope.master.endDate = new Date($scope.master.endDate);
            $scope.master.timetable.forEach(function(ob) {
                ob.date = new Date(ob.date);
                ob.from = new Date(ob.from);
                ob.to = new Date(ob.to);
            });
            $scope.reset();
        } catch (e) {
            $scope.master = null;
        }

        if (!$scope.master) {
            $scope.update();
        }
    }])
    .directive('ngIndeterminate', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                scope.$watch(attributes.ngIndeterminate, function(value) {
                    element.prop('indeterminate', !!value);
                });
            }
        };
    })
    .directive('bindSelect', function() {
        return {
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function(scope, element, attributes) {
                $(element).val('string:' + scope.model);
                $(element).material_select();
            }
        };
    })
    .directive('bindDate', function() {
        return {
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function(scope, element, attributes) {
                $(element).pickadate({
                    min: -1,
                    max: new Date(2037, 12, 31),
                    formatSubmit: 'yyyy-mm-dd',
                    onSet: function(val) {
                        scope.$apply(function() {
                            scope.model = new Date(val.select);
                        });
                    }
                });
            }
        };
    })
    .directive('bindTime', function() {
        return {
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function(scope, element, attributes) {
                $(element).clockpicker({
                    donetext: 'Submit',
                    autoclose: true,
                    afterDone: function(element, val) {
                        scope.$apply(function() {
                            scope.model = val;
                        });
                    }
                });
            }
        };
    })
    .directive('bindImgur', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                new Imgur({
                    id: '#' + attributes['id'],
                    clientid: imgurClientId,
                    callback: function(res) {
                        if (res.success === true) {
                            scope.$apply(function() {
                                if (attributes.id === "logo-upload") {
                                    scope.data.logo = res.data.link;
                                } else {
                                    scope.data.floorplan.push(res.data.link);
                                }
                            });
                        }
                    }
                });
            }
        };
    })

    .directive('chips', function() {
        return {
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function(scope, element, attributes) {
                var chips = [];
                scope.model.forEach(function(t) {
                    chips.push({ tag: t });
                });
                $(element).material_chip({ data: chips });

                element.bind('chip.add', function(e, chip) {
                    scope.$apply(function() {
                        scope.model.push(chip.tag);
                    });
                });
                element.bind('chip.delete', function(e, chip) {
                    scope.$apply(function() {
                        var index = scope.model.indexOf(chip.tag);
                        if (index < 0) {
                            return;
                        }
                        scope.model.splice(index, 1);
                    });
                });
            }
        };
    });
