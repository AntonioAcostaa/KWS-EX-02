import React, { MutableRefObject, useEffect, useRef, useState } from "react";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { Layer } from "ol/layer";
import { Button } from '@intility/bifrost-react';

useGeographic();

const map = new Map({
  view: new View({
    center: [10, 59],
    zoom: 8,
  }),
});

export function MapApplication() {
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  //Updates the current chosen layer when the state changes
  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  //Sets the map target to the div element
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  //Focuses the map on the user
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.getView().animate({ center: [longitude, latitude], zoom: 18 });
    });
  }

  return (
    <>
      <header>
        <h1>Map Application</h1>
      </header>
      <nav>
        <KommuneLayerCheckbox setLayers={setLayers} map={map} />
        <Button onClick={handleFocusUser} >
          Focus user
        </Button>
      </nav>
      <main ref={mapRef}></main>
    </>
  );
}
