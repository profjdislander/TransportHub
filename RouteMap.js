import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RouteMap = ({ route, center, zoom }) => {
  useEffect(() => {
    // Make sure the map container exists
    if (typeof window === 'undefined') return;

    // Create map instance
    const map = L.map('map').setView(center, zoom);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Define route coordinates for St Helena
    // These are approximate coordinates for demonstration
    const routeCoordinates = {
      'longwood': [
        [-15.9367, -5.6733], // Jamestown
        [-15.9433, -5.6683], // The Briars
        [-15.9500, -5.6633], // Alarm Forest
        [-15.9567, -5.6583], // Longwood
      ],
      'levelwood': [
        [-15.9367, -5.6733], // Jamestown
        [-15.9433, -5.6833], // Half Tree Hollow
        [-15.9500, -5.6933], // St Pauls
        [-15.9567, -5.7033], // Levelwood
      ],
      'blue_hill': [
        [-15.9367, -5.6733], // Jamestown
        [-15.9433, -5.6833], // Half Tree Hollow
        [-15.9500, -5.6933], // St Pauls
        [-15.9567, -5.7133], // Blue Hill
      ],
      'sandy_bay': [
        [-15.9367, -5.6733], // Jamestown
        [-15.9433, -5.6833], // Half Tree Hollow
        [-15.9500, -5.6933], // St Pauls
        [-15.9567, -5.7233], // Sandy Bay
      ]
    };

    // Define colors for different routes
    const routeColors = {
      'longwood': '#FF5733',
      'levelwood': '#33FF57',
      'blue_hill': '#3357FF',
      'sandy_bay': '#FF33F5'
    };

    // Get the coordinates for the selected route
    const coordinates = routeCoordinates[route.id] || routeCoordinates['longwood'];
    const color = routeColors[route.id] || '#FF5733';

    // Create a polyline for the route
    const polyline = L.polyline(coordinates, {
      color: color,
      weight: 5,
      opacity: 0.7
    }).addTo(map);

    // Add markers for each stop
    coordinates.forEach((coord, index) => {
      const stopName = route.stops[index] || `Stop ${index + 1}`;
      
      // Create a custom icon for the stop
      const stopIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: white; border: 2px solid ${color}; border-radius: 50%; width: 12px; height: 12px;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      
      // Add marker with popup
      L.marker(coord, { icon: stopIcon })
        .addTo(map)
        .bindPopup(`<b>${stopName}</b><br>Route: ${route.name}`)
        .on('mouseover', function (e) {
          this.openPopup();
        });
    });

    // Fit the map to the route bounds
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

    // Clean up on unmount
    return () => {
      map.remove();
    };
  }, [route, center, zoom]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

export default RouteMap;
