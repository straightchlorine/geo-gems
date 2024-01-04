import React, { useState, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { Form, Button } from 'react-bootstrap';

// Fix for default icon markers, on firefox there
// seems to be a problem.
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

    // Clean up on component unmount
    return () => {
      newMap.off('click', handleMapClick);
      newMap.remove();
    };
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCoordinates({ lat, lng });
  };

  const handleMarkerNameChange = (e) => {
    setMarkerName(e.target.value);
  };

  const handleMarkerAppend = () => {
    if (!map) return;

    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);

    const defaultName = `Marker ${markers.length + 1}`;
    marker.bindPopup(markerName || defaultName).openPopup();
    setMarkers((prevMarkers) => [...prevMarkers, { marker, name: markerName }]);

    // After creating the marker, clearing the coordinates,
    // so that the next marker can't be created on the same coords
    // and so that the user knows that the marker was created
    setCoordinates({ lat: null, lng: null })

    // Clear the input after adding the marker
    setMarkerName('');
  };

  const handleMarkerClick = (markerObj) => {
    if (!map) return;

    const { marker } = markerObj;
    map.setView(marker.getLatLng(), map.getZoom());
  };

return (
    <div className="map-container" >
      <div id="map" className="map"></div>
      <div className="form-container">
        <Form>
          <Form.Group controlId="markerName">
            <Form.Label>Nazwa:</Form.Label>
            <Form.Control type="text" value={markerName} onChange={handleMarkerNameChange} />
          </Form.Group>

          <div>
            <div>
              <div>Szerokość geograficzna: </div>
              <div>{coordinates.lat ? Math.round(coordinates.lat * 100) / 100 : '-'}</div>
            </div>
            <div>
              <div>Długość geograficzna: </div>
              <div>{coordinates.lng ? Math.round(coordinates.lng * 100) / 100 : '-'}</div>
            </div>
          </div>

          <br />
          <Button variant="primary" type="button" onClick={handleMarkerAppend}>
            Dodaj do ulubionych!
          </Button>
        </Form>
        <div className="saved-markers">
          <h2>Ulubione lokalizacje:</h2>
          {markers.map((markerObj, index) => (
            <div key={index} onClick={() => handleMarkerClick(markerObj)} className="saved-marker">
              <strong>{markerObj.name || `Miejsce ${index + 1}`}:</strong>{' '}
              {Math.round(markerObj.marker.getLatLng().lat * 100) / 100}, {Math.round(markerObj.marker.getLatLng().lng * 100) / 100}{' '}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
