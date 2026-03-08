'use client';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
});

export default function MiniMap({ location }: any) {
  return (
    <MapContainer 
      center={[location.lat, location.lng]} 
      zoom={11} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} icon={icon} />
    </MapContainer>
  );
}