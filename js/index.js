var map,
    baseLayer,
    emergencyLayer = undefined,
    source,
    view,
    feature,
    polygon,
    size,
    style,
    emergencyFeature,
    emergencyLayerSource = undefined,
    vicLayer;

style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0)'
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(255, 255, 255, 0)'
  }),
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 1)'
    }),
    stroke: new ol.style.Stroke({
      color: '#319FD3',
      width: 1
    })
  })
});

baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

vicLayerSource = new ol.source.Vector({
  url: 'data/vic.json',
  format: new ol.format.GeoJSON()
});

vicLayer = new ol.layer.Vector({
  source: vicLayerSource,
  style: style
});

view = new ol.View({
  center: [0, 0],
  zoom: 1
});

map = new ol.Map({
  target: 'vic-emergency-map',
  layers: [baseLayer, vicLayer],
  view: view
});

vicLayerSource.once('addfeature', function(e) {
  view.fit(e.feature.getGeometry(), map.getSize(), {constrainResolution: false});
});

function getEmergencyFeature(emergency) {
  return new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([emergency.longitude, emergency.latitude], 'EPSG:4326', 'EPSG:3857'))
  });
}

function onIncidentJSONLoaded(response) {
  features = response.results.map(function(item) {
    return getEmergencyFeature(item);
  });

  if (emergencyLayerSource == undefined) {
    emergencyLayerSource = new ol.source.Vector({ features: features });
  }
  else {
    emergencyLayerSource.clear();
    emergencyLayerSource.addFeatures(features);
  }

  if (emergencyLayer == undefined) {
    emergencyLayer = new ol.layer.Vector({
      source: emergencyLayerSource,
      style: style
    });

    map.addLayer(emergencyLayer);
  }

  $('#app').html((new Date()).toTimeString());
}

(function fetch() {
  $.ajax({
    url: 'https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON',
    method: 'GET',
    cache: false,
    dataType: 'jsonp',
    jsonpCallback: 'onIncidentJSONLoaded',
    complete: setTimeout(function() {fetch()}, 10000),
    timeout: 10000
  });
})();
