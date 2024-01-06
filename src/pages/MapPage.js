import React, { useState, useEffect } from 'react';
import L from 'leaflet';

import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Import toast from react-toastify

import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleGeolocation = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map) {
            map.setView([latitude, longitude], 12); // You can adjust the zoom level (12 in this case)
            toast.success('Geolokacjizacja zakończona sukcesem!');
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error.message);
          toast.error('Niestety, podczas geolokalizacji wystąpiły problemy...');
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser or map is not initialized.');
      toast.error('Twoja przeglądarka nie obsługuję geolokalizacji.');
    }
  };

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
      
      var popup = L.popup({ offset: L.point(0, -30) }).setLatLng([lat, lng]).setContent(name)
      marker.bindPopup(popup);

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

  useEffect(() => {
    handleGeolocation(map); // Automatically ask for geolocation when the map is initialized
  }, [map]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCoordinates({ lat, lng });
  };

  const handleMarkerNameChange = (e) => {
    setMarkerName(e.target.value);
  };

  const handleMarkerAppend = () => {
    if (!map) return;

    if (coordinates.lat === null || coordinates.lng === null) {
        // Notify the user that no location has been chosen using toast
        toast.error('Aby dodać lokalizację, najpierw kliknij na mapę!')
        return;
    }

    // Create a new marker and add it to the map
    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);

    // Create a default name for the marker if no name is provided
    const defaultName = `📍 Perełka ${markers.length + 1}`;
    marker.bindPopup(markerName || defaultName);

    // Update the markers state with the new marker and its name
    setMarkers((prevMarkers) => [...prevMarkers, { marker, name: markerName || defaultName }]);

    // After creating the marker, clear the coordinates;
    // purely for visual feedback.
    setCoordinates({ lat: null, lng: null });

    // Clear the input after adding the marker
    setMarkerName('');

    // Notify the user with a success toast
    toast.success(`Znacznik "${markerName || defaultName}" został pomyślnie dodany do ulubionych!`);
  };

  const handleMarkerClick = (markerObj) => {
    if (!map) return;

    // Center the map on the clicked marker
    const { marker } = markerObj;
    map.setView(marker.getLatLng(), 10);
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
              <div><strong>{coordinates.lat ? Math.round(coordinates.lat * 100) / 100 : '❌'}</strong></div>
            </div>
            <div>
              <div>Długość geograficzna: </div>
              <div><strong>{coordinates.lng ? Math.round(coordinates.lng * 100) / 100 : '❌'}</strong></div>
            </div>
          </div>

          <Button id='favouritesButton' variant="primary" type="button" onClick={handleMarkerAppend}>
            &#128149; Dodaj do ulubionych! &#128149;
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
