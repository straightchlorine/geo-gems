import React, { useState, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { Form, Button } from 'react-bootstrap';

// Fix for default icon markers, on Firefox there
// seems to be a problem.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create a default icon for Leaflet markers
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36]
});

// Set the default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
  // States for the map
  const [markers, setMarkers] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [markerName, setMarkerName] = useState('');
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize the map
    const newMap = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(newMap);

    // Add event listener for click on the map
    newMap.on('click', handleMapClick);
    setMap(newMap);

    // Load markers from localStorage on component mount
    const savedMarkers = JSON.parse(localStorage.getItem('markers')) || [];

    setMarkers([]);
    // Add existing markers to the map
    savedMarkers.forEach(({ lat, lng, name }) => {
      const marker = L.marker([lat, lng]).addTo(newMap);
      marker.bindPopup(name);
      setMarkers((prevMarkers) => [...prevMarkers, { marker, name: name }]);
    });

    // Clean up on component unmount
    return () => {
      newMap.off('click', handleMapClick);
      newMap.remove();
    };
  }, []);

  useEffect(() => {
    // Save markers to localStorage whenever the markers state changes
    const basicMarkers = [];
    markers.forEach(({ marker, name }) => {
      basicMarkers.push({ lat: marker.getLatLng().lat, lng: marker.getLatLng().lng, name });
    });
    localStorage.setItem('markers', JSON.stringify(basicMarkers));
  }, [markers]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCoordinates({ lat, lng });
  };

  const handleMarkerNameChange = (e) => {
    setMarkerName(e.target.value);
  };

  const handleMarkerAppend = () => {
    if (!map) return;

    // Create a new marker and add it to the map
    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);

    // Create a default name for the marker if no name is provided
    const defaultName = `Marker ${markers.length + 1}`;
    marker.bindPopup(markerName || defaultName);

    // Update the markers state with the new marker and its name
    setMarkers((prevMarkers) => [...prevMarkers, { marker, name: markerName || defaultName }]);

    // After creating the marker, clear the coordinates;
    // purely for visual feedback.
    setCoordinates({ lat: null, lng: null });

    // Clear the input after adding the marker
    setMarkerName('');
  };

  const handleMarkerClick = (markerObj) => {
    if (!map) return;

    // Center the map on the clicked marker
    const { marker } = markerObj;
    map.setView(marker.getLatLng(), map.getZoom());
  };

return (
  <div className='container'>
    <div className="main-container">
      <div className="map-container">
        <div id="map" className="map"></div>
      </div>
      <div className="form-container">
        <Form>
          <Form.Group controlId="markerName">
          <Form.Label>Nazwa:</Form.Label>
          <Form.Control type="text" value={markerName} onChange={handleMarkerNameChange} />
        </Form.Group>

          <div className="coordinates-info">
            <div>
              <div>Szerokość geograficzna: </div>
              <div>{coordinates.lat ? Math.round(coordinates.lat * 100) / 100 : '-'}</div>
            </div>
            <div>
              <div>Długość geograficzna: </div>
              <div>{coordinates.lng ? Math.round(coordinates.lng * 100) / 100 : '-'}</div>
            </div>
          </div>

          <Button id='favouritesButton' variant="primary" type="button" onClick={handleMarkerAppend}>
            Dodaj do ulubionych!
          </Button>

        </Form>

        <div className="saved-markers">
        <h2>Ulubione lokalizacje:</h2>
          <div className="saved-list">
            {markers.slice().reverse().map((markerObj, index) => (
              <div
              key={index}
              onClick={() => handleMarkerClick(markerObj)}
              className="saved-marker card"
              >
              <div className="card-body">
              <strong>{markerObj.name}:</strong>{' '}
              {Math.round(markerObj.marker.getLatLng().lat * 100) / 100},{' '}
              {Math.round(markerObj.marker.getLatLng().lng * 100) / 100}
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default MapPage;
