var LIMIT = 500;
var storageKey = 'WolfBeaconCMS';
var imgurClientId = 'cc86a8de0e7c459';

angular.module('SponsorForm')
    .controller('HomeController', ['$scope', '$localForage', '$timeout', 'submit', function($scope, $localForage, $timeout, submit) {
        $scope.data = {
            name: "",
            logo: "",
            type: {
                university: false,
                company: false,
                school: false,
                other: false
            },
		    routes: [[{location: ""}]],
            startDate: new Date(),
            endDate: new Date(),
            size: 1,
            desc: "",
			schoolTitle: "",
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
        $scope.linksLength = $scope.data.links.length;
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
            $localForage.setItem(storageKey, JSON.stringify($scope.master)).then(function() {
                Materialize.toast('Saved data to the cache.', 4000);
            });
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
            $localForage.setItem(storageKey, JSON.stringify($scope.master));
        };

        $scope.validateEmail = function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        $scope.validate = function() {
            var errors = [];
            if (!$scope.data.name) {
                errors.push("Name of Hackathon is required");
            } else if ($scope.data.name.length < 3 || $scope.data.name.length > 50) {
                errors.push("Name of Hackathon must be appropriate length");
            }
            if (!$scope.data.desc) {
                errors.push("Description is required");
            } else if ($scope.data.desc.length < 10 || $scope.data.desc.length > 100) {
                errors.push("Description must be appropriate length");
            }
            if (!$scope.data.logo || !$scope.data.logo.startsWith("http") || $scope.data.logo.indexOf("imgur.com") < 0) {
                errors.push("Logo is required");
            }
            if (!$scope.data.type.university && !$scope.data.type.school && !$scope.data.type.company && !$scope.data.type.other) {
                errors.push("Type of Hackathon is required");
            }
            if (!$scope.data.schoolTitle) {
                errors.push("Institution is required");
            } else if ($scope.data.schoolTitle.length < 3 || $scope.data.schoolTitle.length > 100) {
                errors.push("Institution must be appropriate length");
            }
            if (!$scope.data.size || isNaN($scope.data.size) || parseInt($scope.data.size) !== $scope.data.size || $scope.data.size <= 0) {
                errors.push("Size is required");
            }
            if ($scope.data.endDate < $scope.data.startDate) {
                errors.push("Invalid start date and end date");
            }
            if (!$scope.data.city) {
                errors.push("City is required");
            }
            if (!$scope.data.address) {
                errors.push("Address is required");
            }
            if (!$scope.data.contact || !$scope.validateEmail($scope.data.contact)) {
                errors.push("Contact is required to be a valid e-mail");
            }

            $scope.data.floorplan.forEach(function (plan) {
                if (!plan || !plan.startsWith("http") || plan.indexOf("imgur.com") < 0) {
                    errors.push("Invalid floor plan");
                }
            });
            $scope.data.links.forEach(function (plan) {
                if (plan.required && !plan.value) {
                    errors.push("Invalid " + plan.text + " URL");
                }
            });
            $scope.data.prizes.forEach(function (plan) {
                if (plan.winners < 1 || isNaN(plan.winners) || parseInt(plan.winners) !== plan.winners
                        || plan.value < 0 || isNaN(plan.value) || parseInt(plan.value) !== plan.value) {
                    errors.push("Invalid " + plan.name + " prize");
                }
            });
            $scope.data.hardware.forEach(function (plan) {
                if (plan.amount < 1 || isNaN(plan.amount) || parseInt(plan.amount) !== plan.amount) {
                    errors.push("Invalid " + plan.type + " hardware");
                }
            });
            $scope.data.timetable.forEach(function (plan) {
                if (plan.from.length !== plan.to.length 
                        || plan.from.length !== 5 || plan.from.charAt(2) !== ':' 
                        || parseInt(plan.from.split(':')[0]) < 0 || parseInt(plan.from.split(':')[0]) >= 24
                        || parseInt(plan.from.split(':')[1]) < 0 || parseInt(plan.from.split(':')[1]) >= 60
                        || plan.to.length !== 5 || plan.to.charAt(2) !== ':' 
                        || parseInt(plan.to.split(':')[0]) < 0 || parseInt(plan.to.split(':')[0]) >= 24
                        || parseInt(plan.to.split(':')[1]) < 0 || parseInt(plan.to.split(':')[1]) >= 60) {
                    errors.push("Invalid " + plan.description + " event");
                }
            });
            $scope.data.userData.forEach(function (plan) {
                if (!(plan.target in $scope.targetTypes) || !plan.target) {
                    errors.push("Invalid " + plan.type + " user data");
                }
                plan.fields.forEach(function(field) {
                    if (!field.name || !(field.type in $scope.questionTypes) || !field.type || !('value' in field)) {
                        errors.push("Invalid " + field.name + " user data question under " + plan.type);
                    }
                });
            });

            if ($scope.data.links.length != $scope.linksLength
                    || $scope.data.judges.length > LIMIT || $scope.data.judges.length < 1 
                    || $scope.data.sponsors.length > LIMIT || $scope.data.sponsors.length < 1 
                    || $scope.data.prizes.length > LIMIT || $scope.data.prizes.length < 1 
                    || $scope.data.hardware.length > LIMIT || $scope.data.hardware.length < 1 
                    || $scope.data.timetable.length > LIMIT || $scope.data.timetable.length < 1 
                    || $scope.data.routes.length > LIMIT || $scope.data.routes.length < 1 
                    || $scope.data.advancedQuestions.length > LIMIT || $scope.data.advancedQuestions.length < 1 
                    || !('advanced' in $scope.data)) {
                errors.push("Invalid links");
            }

            if (!!$scope.data.advanced) {
                $scope.data.advancedQuestions.forEach(function (plan) {
                    if (!plan.name || !plan.type || !plan.target 
                            || !(plan.target in $scope.targetTypes) || !(plan.type in $scope.questionTypes)) {
                        errors.push("Invalid " + plan.name + " advanced user data");
                    }
                });
            }
            return errors;
        };

        $scope.clickSubmit = function() {
            var err = $scope.validate();
            if (err.length > 0) {
                Materialize.toast('Error: ' + err[0], 4000);
                return;
            }
            submit.submitHackathon($scope.data).then(function(res) {
                if (res.status === 200 && res.statusText === "OK" && res.data.toLowerCase().indexOf("error") < 0) {
                    Materialize.toast('Successfully sent data.', 4000);
                } else {
                    Materialize.toast('There was an error.', 4000);
                }
            }).catch(function(error) {
                Materialize.toast('There was an error: ' + error, 4000);
            })
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
            $scope.addRow($scope.data.timetable, q, { date: $scope.data.startDate, from: "00:00", to: "00:00", description: "", ticket: false });
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

        $scope.removeRowJudge = function(q) {
            $scope.removeRow($scope.data.judges, q);
        };

        $scope.addRowJudge = function(q) {
            $scope.addRow($scope.data.judges, q, { name: "", title: "" });
        };
		
        $scope.addRoute = function(q, r) {
            $scope.addRow(q, r, {location: "Location"});
        };
		
        $scope.removeRoute = function(q, r) {
			if (q.length <= 1) {
				$scope.removeRow($scope.data.routes, q);
			} else {
				$scope.removeRow(q, r);
			}
        };

        $scope.addRowRoute = function(q) {
            $scope.addRow($scope.data.routes, q, [[{location: ""}]]);
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
            if (arr.length >= LIMIT) {
                return;
            }
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
            $localForage.getItem(storageKey, true).then(function(data) {
                $scope.master = JSON.parse(data);
                $scope.master.startDate = new Date($scope.master.startDate);
                $scope.master.endDate = new Date($scope.master.endDate);
                $scope.master.timetable.forEach(function(ob) {
                    ob.date = new Date(ob.date);
                });
                $scope.reset();
            }).catch(function() {
                $scope.master = null;
            });
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
    .directive('bindLocation', function($timeout) {
        return {
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function(scope, element, attributes) {
				$timeout(function() {
					var $elem = $(element);
					autocomplete(attributes.id, [], $elem);
					
					$elem.change(function() {
						scope.$apply(function() {
							scope.model = $elem.val();
						});
					});
				});
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
