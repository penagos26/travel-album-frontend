import { useState, useEffect } from 'react';
import { Place } from '../../core/models/Place';
import { LocalStoragePlaceRepository } from '../../infraestructure/LocalStoragePlaceRepository';

const repo = new LocalStoragePlaceRepository();

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeMusic, setActiveMusic] = useState<{ url: string, name: string } | null>(null);

  useEffect(() => {
    setPlaces(repo.getAll());
  }, []);

  const addPlace = (place: Place) => {
    repo.save(place);
    setPlaces(repo.getAll());
  };

  const updatePlace = (place: Place) => {
    repo.update(place);
    setPlaces(repo.getAll());
  };

  const handleMarkerClick = (place: Place | null) => {
    if (place?.musicUrl) {
      setActiveMusic({ url: place.musicUrl, name: place.cityName });
    } else {
      setActiveMusic(null);
    }
  };

  return { places, addPlace, updatePlace, activeMusic, handleMarkerClick };
};