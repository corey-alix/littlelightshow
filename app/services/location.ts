import { StorageModel } from "./StorageModel";

const TABLE_NAME = "location";

export interface Location {
  id?: string;
  date: number;
  lon: number;
  lat: number;
}

export class LocationModel extends StorageModel<Location> {}

export const locationModel =
  new LocationModel({
    tableName: TABLE_NAME,
    offline: false,
    maxAge: 60 * 60 * 24,
  });
