import React, { useState } from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";

const center = [51.505, -0.09];
const zoom = 13;

function DisplayPosition({ map, positionH }) {
  const [position, setPosition] = useState(() => map.getCenter());
  if (map && positionH) {
    L.marker(positionH).addTo(map);
  }
  //map.removeLayer(layerGroup);
  //L.marker(positionH).addTo(map);

  const onClick = useCallback(() => {
    // map.removeLayer(layerGroup);
    // L.marker(position).addTo(map);
  }, [map]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{" "}
      <button onClick={onClick}>reset</button>
    </p>
  );
}

function MyComponent({ onClick }) {
  const map2 = useMapEvents({
    click(e) {
      console.log(e);
      alert(e.latlng);
      onClick(e.latlng);
    },
  });
  return null;
}

export default function MapForm() {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState([0, 0]);

  const createMarker = (positionGet) => {
    console.log(positionGet);
    setPosition(positionGet, () => console.log(position));
    console.log(position);
  };

  const displayMap = useMemo(
    () => (
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MyComponent onClick={createMarker} />
      </MapContainer>
    ),
    []
  );

  return (
    <div>
      {map ? <DisplayPosition map={map} postitionH={position} /> : null}
      {displayMap}
    </div>
  );
}
