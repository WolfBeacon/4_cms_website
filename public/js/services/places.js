var service;
var universities;

function autocomplete(id, data, $elem) {
    if (!data) {
        data = [];
    }
    if (!id || !service) {
        return;
    }
	if (!$elem) {
		$elem = $('#' + id);
	}
    if (!$elem || $elem.length <= 0) {
        return;
    }
    var lastVal = $elem.val();
    var type = id;
    if (id !== 'address') {
        type = '(cities)';
    }
    $('.autocomplete-content').remove();

    var arg = {};
    data.forEach(function(d) {
        arg[d] = null;
    });

    var e = $elem.off('keyup').off('.change').autocomplete({ data: arg }).keyup().on('keyup', function(e) {
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

function autocomplete_university(id, data) {
    if (!data) {
        data = [];
    }
    if (!id) {
        return;
    }
    var $elem = $('#' + id);
    if (!$elem || $elem.length <= 0) {
        return;
    }
    var lastVal = $elem.val();
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
            autocomplete_university(id, universities.map(p => p.name).filter(p => p.toLowerCase().indexOf(val.toLowerCase()) > 0));
        });
}

$(document).ready(function() {
    $('#show-help').click(function() {
        $('#help-text').slideToggle();
    });

    service = new google.maps.places.AutocompleteService();

	autocomplete('city');
	
	
	$.getJSON("https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json", function(data) {
		universities = data;
		autocomplete_university('schoolTitle');
	});
});