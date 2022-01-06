declare var mapboxgl: any;

interface Location {
  lon: number;
  lat: number;
}

interface FeatureCollection {
  type: "FeatureCollection";
  query: Location;
  features: Array<Feature>;
}

interface Feature {
  id: string;
  type: "Feature";
  place_type: Array<"street">;
  relevance: number;
  properties: { osm_id?: string };
  text: string;
  place_name: string;
  bbox: Array<number>;
  center: Array<number>;
  geometry: Geometry;
  context: {
    id: string;
    osm_id: string;
    text: string;
  };
  address: string;
}

interface Geometry {
  type: "Point";
  coordinates: Array<number>;
}

const MAPTILERKEY =
  "f0zkb15NK1sqOcE72HCf";
const maptilerEndpoints = {
  street: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILERKEY}`,
  osm: `https://api.maptiler.com/maps/osm-standard/style.json?key=${MAPTILERKEY}`,
  sat: "https://api.maptiler.com/maps/fd41a7e9-86be-4da8-aff1-f8edfcf37a4b/style.json?key=f0zkb15NK1sqOcE72HCf",
  reverseGeocode: (
    location: Location
  ) =>
    `https://api.maptiler.com/geocoding/${location.lon},${location.lat}.json?key=${MAPTILERKEY}`,
};

export async function run() {
  const whereAmI =
    await getCurrentLocation();
  const map = new mapboxgl.Map({
    container: "map",
    style:
      "https://api.maptiler.com/maps/outdoor/style.json?key=f0zkb15NK1sqOcE72HCf",
    center: [
      whereAmI.lon,
      whereAmI.lat,
    ],
    zoom: 20,
  });
}

async function reverseGeocode(
  location: Location
) {
  const response = await fetch(
    maptilerEndpoints.reverseGeocode(
      location
    )
  );
  const data =
    (await response.json()) as FeatureCollection;
  return data;
}

async function getCurrentLocation() {
  return new Promise<Location>(
    (good, bad) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // good
          const lat =
            position.coords.latitude;
          const lon =
            position.coords.longitude;
          good({ lon, lat });
        },
        (msg) => {
          // bad
          bad(msg);
        }
      );
    }
  );
}

function reportAddress(
  location: FeatureCollection
) {
  if (!location.features)
    throw "nothing found";
  const street = location.features.find(
    (f) =>
      f.place_type.includes("street")
  );
  if (street) {
    return (
      street.address || street.text
    );
  }
  return location.features[0]
    .place_name;
}
