import React, { useEffect, useRef } from 'react';
import { Property } from '@/types/property';

interface MapViewProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

// Zimbabwe city coordinates
const CITY_COORDS: Record<string, [number, number]> = {
  'Harare': [-17.8292, 31.0522],
  'Bulawayo': [-20.1325, 28.6265],
  'Victoria Falls': [-17.9243, 25.8572],
  'Mutare': [-18.9707, 32.6709],
  'Gweru': [-19.4500, 29.8167],
  'Masvingo': [-20.0724, 30.8322],
};

const MapView: React.FC<MapViewProps> = ({ properties, onPropertyClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Dynamically load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      if (!mapRef.current) return;

      // Initialize map centered on Zimbabwe
      const map = L.map(mapRef.current).setView([-19.0154, 29.1549], 6);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles (free, no API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Group properties by city
      const propertiesByCity: Record<string, Property[]> = {};
      properties.forEach(p => {
        if (p.city && CITY_COORDS[p.city]) {
          if (!propertiesByCity[p.city]) propertiesByCity[p.city] = [];
          propertiesByCity[p.city].push(p);
        }
      });

      // Add markers for each city
      Object.entries(propertiesByCity).forEach(([city, cityProperties]) => {
        const coords = CITY_COORDS[city];
        if (!coords) return;

        const marker = L.marker(coords).addTo(map);

        // Build popup content
        const popupContent = `
          <div style="min-width: 200px; max-width: 280px;">
            <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #0891b2;">
              ${city} — ${cityProperties.length} ${cityProperties.length === 1 ? 'property' : 'properties'}
            </h3>
            <div style="max-height: 200px; overflow-y: auto;">
              ${cityProperties.map(p => `
                <div
                  style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 6px; cursor: pointer; background: #f9fafb;"
                  onclick="window.__proplink_click('${p.id}')"
                >
                  <p style="font-size: 12px; font-weight: 600; color: #1f2937; margin: 0 0 2px 0;">${p.title}</p>
                  <p style="font-size: 12px; color: #0891b2; margin: 0 0 2px 0;">$${p.price.toLocaleString()}${p.transactionType === 'rent' ? '/mo' : ''}</p>
                  <p style="font-size: 11px; color: #6b7280; margin: 0;">${p.location}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      // Global click handler for property cards in popups
      (window as any).__proplink_click = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        if (property) onPropertyClick(property);
      };
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete (window as any).__proplink_click;
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const map = mapInstanceRef.current;
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const propertiesByCity: Record<string, Property[]> = {};
    properties.forEach(p => {
      if (p.city && CITY_COORDS[p.city]) {
        if (!propertiesByCity[p.city]) propertiesByCity[p.city] = [];
        propertiesByCity[p.city].push(p);
      }
    });

    Object.entries(propertiesByCity).forEach(([city, cityProperties]) => {
      const coords = CITY_COORDS[city];
      if (!coords) return;

      const marker = L.marker(coords).addTo(map);
      const popupContent = `
        <div style="min-width: 200px; max-width: 280px;">
          <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #0891b2;">
            ${city} — ${cityProperties.length} ${cityProperties.length === 1 ? 'property' : 'properties'}
          </h3>
          <div style="max-height: 200px; overflow-y: auto;">
            ${cityProperties.map(p => `
              <div
                style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 6px; cursor: pointer; background: #f9fafb;"
                onclick="window.__proplink_click('${p.id}')"
              >
                <p style="font-size: 12px; font-weight: 600; color: #1f2937; margin: 0 0 2px 0;">${p.title}</p>
                <p style="font-size: 12px; color: #0891b2; margin: 0 0 2px 0;">$${p.price.toLocaleString()}${p.transactionType === 'rent' ? '/mo' : ''}</p>
                <p style="font-size: 11px; color: #6b7280; margin: 0;">${p.location}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
    });

    (window as any).__proplink_click = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId);
      if (property) onPropertyClick(property);
    };
  }, [properties]);

  return (
    <div
      ref={mapRef}
      style={{ height: '500px', width: '100%', borderRadius: '12px', zIndex: 0 }}
      className="shadow-lg"
    />
  );
};

export default MapView;
