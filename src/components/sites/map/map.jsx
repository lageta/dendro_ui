import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Stack, Typography, Divider, IconButton, Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.setView(e.latlng, 13);
    });
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
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="baseline"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Typography>Latitude: {position.lat.toFixed(4)}</Typography>
        <Typography>Longitude: {position.lng.toFixed(4)} </Typography>
        <Button onClick={onClick}>
          <MyLocationIcon fontSize="small" />
        </Button>
      </Stack>
    </p>
  );
}

function SendPosition({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function Map({ onClick, position }) {
  const [map, setMap] = useState(null);
  const center = position;
  const zoom = 13;

  useEffect(() => {
    console.log(position);
  });

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        ref={setMap}
        style={{ height: "500px", width: "fullwidth" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <SendPosition onClick={onClick} />
      </MapContainer>
    ),
    []
  );

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  );
}

export default Map;
