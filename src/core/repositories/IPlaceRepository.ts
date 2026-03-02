import { Place } from "../models/Place";

export interface IPlaceRepository {
  getAll(): Place[];
  save(place: Place): void;
  update(place: Place): void;
  delete(id: string): void;
}