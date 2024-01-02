import React, { useEffect } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24, 36],
    iconAnchor: [12, 36]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {

  useEffect(() => {
    const map = L.map('map').setView([51.1079, 17.0385], 13); // Default center: Wrocław, Poland

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    if ('geolocation' in navigator) {
      const geoOptions = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: Infinity,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // add the marker and move the view there
          map.setView([latitude, longitude], 13);
          L.marker([latitude, longitude]).addTo(map)
            .openPopup();
        },
        (error) => {
          console.error(`Error getting user location: ${error.message}`);
        },
        geoOptions
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <div>
        <div id="map" style={{ height: '100vh', width: '100%' }}></div>
    </div>
  );
};

export default MapPage;
