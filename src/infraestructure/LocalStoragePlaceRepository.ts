import { Place } from "../core/models/Place";
import { IPlaceRepository } from "../core/repositories/IPlaceRepository";

const STORAGE_KEY = 'user_places_v1';

export class LocalStoragePlaceRepository implements IPlaceRepository {
  getAll(): Place[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  save(place: Place): void {
    const places = this.getAll();
    places.push(place);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  }

  update(updatedPlace: Place): void {
    const places = this.getAll().map(p => p.id === updatedPlace.id ? updatedPlace : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  }

  delete(id: string): void {
    const places = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  }
}