import React, { useState, useEffect } from 'react';
import L from 'leaflet';
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
  const [markers, setMarkers] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [markerName, setMarkerName] = useState('');
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize the map
    const newMap = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(newMap);

    // Add event listener for double-click on the map
    newMap.on('dblclick', handleMapDoubleClick);

    setMap(newMap);

    // Clean up on component unmount
    return () => {
      newMap.off('dblclick', handleMapDoubleClick);
      newMap.remove();
    };
  }, []);

  const handleMapDoubleClick = (e) => {
    const { lat, lng } = e.latlng;
    setCoordinates({ lat, lng });
  };

  const handleMarkerNameChange = (e) => {
    setMarkerName(e.target.value);
  };

  const handleMarkerAppend = () => {
    if (!map) return;

    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);

    marker.bindPopup(markerName || '').openPopup(); // Display name as a popup
    setMarkers((prevMarkers) => [...prevMarkers, { marker, name: markerName }]);

    // Clear the input after adding the marker
    setMarkerName('');
  };

  return (
    <div className="map-container">
      <div id="map" className="map"></div>
      <div className="form-container">
        <form>
          <input type="text" value={markerName} onChange={handleMarkerNameChange} />
          <label>Marker Name:</label>

          <div>Latitude: {coordinates.lat}</div>
          <div>Longitude: {coordinates.lng}</div>

          <button type="button" onClick={handleMarkerAppend}>
            Add Marker
          </button>
        </form>
        <div className="saved-markers">
          <h2>Saved Markers</h2>
          {markers.map((markerObj, index) => (
            <div key={index}>
              <strong>{markerObj.name || 'Unnamed Marker'}:</strong>{' '}
              {markerObj.marker.getLatLng().toString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
