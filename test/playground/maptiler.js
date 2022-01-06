// maptiler.ts
var MAPTILERKEY = "f0zkb15NK1sqOcE72HCf";
var maptilerEndpoints = {
  street: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILERKEY}`,
  osm: `https://api.maptiler.com/maps/osm-standard/style.json?key=${MAPTILERKEY}`,
  sat: "https://api.maptiler.com/maps/fd41a7e9-86be-4da8-aff1-f8edfcf37a4b/style.json?key=f0zkb15NK1sqOcE72HCf",
  reverseGeocode: (location) => `https://api.maptiler.com/geocoding/${location.lon},${location.lat}.json?key=${MAPTILERKEY}`
};
async function run() {
  var map = new ol.Map({
    target: "map",
    view: new ol.View({
      constrainResolution: true,
      center: ol.proj.fromLonLat([-79.54049, 31.45498]),
      zoom: 5
    })
  });
  const markers = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({
            color: "red"
          }),
          stroke: new ol.style.Stroke({
            color: "white",
            width: 1
          })
        })
      })
    ]
  });
  olms.apply(map, maptilerEndpoints.street);
  const currentLocation = await getCurrentLocation();
  console.log(currentLocation);
  const [x, y] = [currentLocation.lon, currentLocation.lat];
  const center = ol.proj.transform([x, y], "EPSG:4326", "EPSG:3857");
  console.log(currentLocation, center);
  map.getView().setCenter(center);
  map.getView().setZoom(21);
  if (false) {
    const locationInfo = await reverseGeocode(currentLocation);
    const address = reportAddress(locationInfo);
    console.log(address, locationInfo);
    createMarker({ layer: markers, text: address, location: currentLocation });
  }
  map.on("click", async (event) => {
    const { pixel } = event;
    const coord = map.getCoordinateFromPixel(pixel);
    const location = ol.proj.toLonLat(coord);
    const latlon = { lon: location[0], lat: location[1] };
    const locationInfo = await reverseGeocode(latlon);
    const address = reportAddress(locationInfo);
    createMarker({ layer: markers, text: address, location: latlon });
  });
  setTimeout(() => map.addLayer(markers), 1e3);
}
async function reverseGeocode(location) {
  const response = await fetch(maptilerEndpoints.reverseGeocode(location));
  const data = await response.json();
  return data;
}
async function getCurrentLocation() {
  return new Promise((good, bad) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      good({ lon, lat });
    }, (msg) => {
      bad(msg);
    });
  });
}
function reportAddress(location) {
  if (!location.features)
    throw "nothing found";
  const street = location.features.find((f) => f.place_type.includes("street"));
  if (street) {
    return street.address || street.text;
  }
  return location.features[0].place_name;
}
function createMarker(options) {
  const marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([options.location.lon, options.location.lat])));
  if (options.text) {
    setTextStyle(options.text, marker);
  }
  options.layer.getSource().addFeature(marker);
}
function setTextStyle(text, marker) {
  marker.setStyle([
    new ol.style.Style({
      text: new ol.style.Text({
        text
      }),
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: "red"
        }),
        stroke: new ol.style.Stroke({
          color: "white",
          width: 1
        })
      })
    })
  ]);
}
export {
  run
};
