import type { Location } from "../../dts/location";

declare var mapboxgl: any;

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

import { globals } from "../../globals.js";

const MAPTILERKEY = globals.MAPTILERKEY;

const maptilerEndpoints = {
  street: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILERKEY}`,
  osm: `https://api.maptiler.com/maps/osm-standard/style.json?key=${MAPTILERKEY}`,
  sat: "https://api.maptiler.com/maps/fd41a7e9-86be-4da8-aff1-f8edfcf37a4b/style.json?key=f0zkb15NK1sqOcE72HCf",
  reverseGeocode: (
    location: Location
  ) =>
    `https://api.maptiler.com/geocoding/${location.lon},${location.lat}.json?key=${MAPTILERKEY}`,
};

import { on } from "../../fun/on.js";
import { init as systemInit } from "../../index.js";
import {
  getCurrentLocation,
  captureLocation,
} from "./captureLocation";

export async function run() {
  await systemInit();

  on(document.body, "nav-back", () => {
    window.history.back();
  });

  const whereAmI =
    await getCurrentLocation();

  captureLocation(whereAmI);
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

  const addressInfo =
    await reverseGeocode(whereAmI);
  const popupInfo = reportAddress(
    addressInfo
  );

  const marker = new mapboxgl.Marker({
    color: "#FF0000",
    draggable: true,
  })
    .setLngLat([
      whereAmI.lon,
      whereAmI.lat,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `${popupInfo}`
      )
    )
    .addTo(map);

  marker.on("dragend", async () => {
    const { lng: lon, lat } =
      marker.getLngLat();
    const addressInfo =
      await reverseGeocode({
        lon,
        lat,
      });
    const popupInfo = reportAddress(
      addressInfo
    );
    marker.setPopup(
      new mapboxgl.Popup().setHTML(
        `${popupInfo}`
      )
    );
    marker.togglePopup();
    captureLocation({ lat, lon });
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
