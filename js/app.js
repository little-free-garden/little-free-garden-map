//var basemap = new L.TileLayer(baseUrl, {maxZoom: 18, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});
var basemap = L.tileLayer(baseUrl, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: mapboxId,
});

var center = new L.LatLng(0, 0);
var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]});

var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true,
    minWidth: 400
};

var points = L.geoCsv (null, {
    firstLineTitles: true,
    deleteDoubleQuotes: false,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content">';
        var title = feature.properties['title'];
        var description = feature.properties['description'];
        var garden_type = feature.properties['garden_type'];
        var unique_id = feature.properties['unique_id'];
        var enabled = (feature.properties['enabled']) == "TRUE" ? true : false;
        popup += "<h1>" + title + "</h1>";
        popup += "<img class='logo' src='img/little-free-garden.png'/>";
        popup += "<div><span class='garden-type'>" + garden_type + " (lfg-id #" + unique_id + ")</span></div>";
        popup += "<div><span class='description'>" + description + "</span></div>";
        //popup += "<div class='unique-id'>#" + unique_id + "</div>";
        popup += "</div>";
        layer.bindPopup(popup, popupOpts);
    },
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});

var hits = 0;
var total = 0;
var filterString;
var markers = new L.MarkerClusterGroup();
var dataCsv;

var addCsvMarkers = function() {
    hits = 0;
    total = 0;
    //filterString = document.getElementById('filter-string').value;

    // strip out disabled points, then rebuild csv
    /*
    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }*/

    map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);

    map.addLayer(markers);
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }

    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};

var typeAheadSource = [];

function ArrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

function populateTypeAhead(csv, delimiter) {
    var lines = csv.split("\n");
    for (var i = lines.length - 1; i >= 1; i--) {
        var items = lines[i].split(delimiter);
        // skip if the final field (ENABLED) is false:
        if (items[items.length - 1] == "FALSE") {
            continue;
        }

        // only include relevant fields
        //for (var j = items.length - 4; j >= 0; j--) {
        for (j=1; j <= 3; j++) {
            var item = items[j].strip();
            item = item.replace(/"/g,'');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        }
    }
}

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

map.addLayer(markers);

$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
        },
        success: function(csv) {
            dataCsv = csv;
            // remove things that are not enabled
            var lines = dataCsv.split("\n");
            var c = '';
            for (var i=0; i < lines.length; i++) {
                var items = lines[i].split(fieldSeparator);
                if (items.length <= 1) {
                    continue;
                }
                // skip if the final field (ENABLED) is false:
                if (items[items.length - 1].strip() == "FALSE") {
                    continue;
                }
                c += items.join(',') + '\n';
            }
            dataCsv = c;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers();
    });

});
