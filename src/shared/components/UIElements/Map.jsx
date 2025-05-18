import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import MapOL from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    const map = new MapOL({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });
  
    return () => map.setTarget(null);  // ✅ Clean up on unmount
  }, [center, zoom]);
  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className || ''}`}
      style={props.style || { height: '300px', width: '100%' }}
    ></div>
  );
};

export default Map;
