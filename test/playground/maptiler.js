// maptiler.ts
var MAPTILERKEY = "f0zkb15NK1sqOcE72HCf";
var maptilerEndpoints = {
  street: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILERKEY}`,
  osm: `https://api.maptiler.com/maps/osm-standard/style.json?key=${MAPTILERKEY}`,
  sat: "https://api.maptiler.com/maps/fd41a7e9-86be-4da8-aff1-f8edfcf37a4b/style.json?key=f0zkb15NK1sqOcE72HCf",
  reverseGeocode: (location) => `https://api.maptiler.com/geocoding/${location.lon},${location.lat}.json?key=${MAPTILERKEY}`
};
async function run() {
  const whereAmI = await getCurrentLocation();
  const map = new mapboxgl.Map({
    container: "map",
    style: "https://api.maptiler.com/maps/outdoor/style.json?key=f0zkb15NK1sqOcE72HCf",
    center: [
      whereAmI.lon,
      whereAmI.lat
    ],
    zoom: 20
  });
  const addressInfo = await reverseGeocode(whereAmI);
  const popupInfo = reportAddress(addressInfo);
  const marker = new mapboxgl.Marker({
    color: "#FF0000",
    draggable: true
  }).setLngLat([
    whereAmI.lon,
    whereAmI.lat
  ]).setPopup(new mapboxgl.Popup().setHTML(`${popupInfo}`)).addTo(map);
  marker.on("dragend", async () => {
    const { lng: lon, lat } = marker.getLngLat();
    const addressInfo2 = await reverseGeocode({
      lon,
      lat
    });
    const popupInfo2 = reportAddress(addressInfo2);
    marker.setPopup(new mapboxgl.Popup().setHTML(`${popupInfo2}`));
    marker.togglePopup();
  });
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
export {
  run
};
