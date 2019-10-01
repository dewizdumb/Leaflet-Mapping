function getColor(d){
	return d > 5 ? "#ff0000":
	d  > 4 ? "#ff6600":
	d > 3 ? "#ffa500":
	d > 2 ? "#ffb37e":
	d > 1 ? "#ffff66":
			 "#90ee90";
  };
  
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeURL,function (data){
	createFeatures(data.features);
});

function createFeatures(earthquakeData) {
	var earthquakes = L.geoJSON(earthquakeData,{
		onEachFeature: function(feature,layer){
			layer.bindPopup(`<h3>Magnitude:${feature.properties.mag}</h3>\
				<h3>Location:${feature.properties.place}</h3>\
				<hr><p>${new Date(feature.properties.time)}</p>`);
		},
		pointToLayer:function(feature,latlng){
			return new L.circle(latlng,{
				stroke:false,
				fillOpacity:.75,
				radius: feature.properties.mag * 30000,
				fillColor: getColor(feature.properties.mag),
			})
		}
	});

	createMap(earthquakes);
}

function createMap(earthquakes) {
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        accessToken:API_KEY
      });
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        accessToken:API_KEY
      });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        accessToken: API_KEY
    });

    var baseMaps = {
    	"Outdoor Map": outdoors,
    	"Satellite Map": satellite,
    	"Dark Map": darkmap
    };

    var overlayMaps ={
    	"Earthquakes": earthquakes,
    };

  	var myMap = L.map("map", {
  		center: [20, -10],
  		zoom: 2,
  		layers: [outdoors, earthquakes]
  	}); 

  	L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

	var legend = L.control({position: 'bottomright'});

legend.onAdd = function(myMap){

	var div = L.DomUtil.create('div', 'info legend'),
	grades = [0,1,2,3,4,5],
	labels = [];

// loop through our density intervals and generate a label with a colored square for each interval
for (var i = 0; i < grades.length; i++) {
	div.innerHTML +=
		'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};


  legend.addTo(myMap);
};
