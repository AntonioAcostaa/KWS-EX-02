import React, { MutableRefObject, useEffect, useRef, useState } from "react";

import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { Layer } from "ol/layer";
import { Button } from "@intility/bifrost-react";
import { map, MapContext } from "../map/mapContext";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { FylkeASide } from "../fylke/fylkeASide";
import { KommuneAside } from "../kommune/kommuneASide";

import { SchoolLayerCheckbox } from "../../school/schoolLayerCheckbox";
import { SchoolAside } from "../../school/schoolASide";


export function Application() {
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
      map.getView().animate({ center: [longitude, latitude], zoom: 14 });
    });
  }

  return (
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <header>
        <h1>Map Application</h1>
      </header>
      <nav>
        <KommuneLayerCheckbox />
        <FylkeLayerCheckbox />
        <SchoolLayerCheckbox />
        <Button onClick={handleFocusUser}>Focus user</Button>
      </nav>
      <main>
        <div ref={mapRef}></div>
        <KommuneAside />
        <FylkeASide />
        <SchoolAside />
      </main>
    </MapContext.Provider>
  );
}
