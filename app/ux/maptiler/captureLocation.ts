import { locationModel } from "../../services/location.js";
import { reportError } from "../Toaster.js";
import type { Location } from "../../dts/location";

export async function captureLocation(
  location?: Location
) {
  if (!location) {
    location =
      await getCurrentLocation();
  }
  locationModel
    .upsertItem({
      date: new Date().valueOf(),
      lat: location.lat,
      lon: location.lon,
    })
    .catch((ex) => {
      reportError(ex);
    });
}

export async function getCurrentLocation() {
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
