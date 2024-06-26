import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { Layer } from "ol/layer";
import { Accordion, Button } from "@intility/bifrost-react";
import { map, MapContext } from "../map/mapContext";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";

import { KommuneAside } from "../kommune/kommuneASide";

import { SchoolLayerCheckbox } from "../school/schoolLayerCheckbox";
import { SchoolAside } from "../school/schoolAside";
import { View } from "ol";
import { BaseLayerDropdown } from "../baseLayer/baseLayerDropdown";
import { TilfluktsromLayerCheckbox } from "../tilfluktsrom/tilfluktsromCheckbox";
import { SivilforsvarsdistrikterLayerCheckbox } from "../sivilforsvarsdistrikter/sivilforsvarsdistrikterLayerCheckbox";
import { VannkraftverkLayerCheckbox } from "../vannkraftverk/vannkraftverkCheckbox";
import { JernbaneLinjerLayerCheckbox } from "../jernbanelinjer/jernbaneLinjerCheckbox";
import { FylkeASide } from "../fylke/fylkeASide";
import TrainLayerCheckbox from "../tog/trainCheckbox";

export function Application() {
  //Focuses the map on the user
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.getView().animate({ center: [longitude, latitude], zoom: 14 });
    });
  }

  const [baseLayer, setBaseLayer] = useState<Layer>(
    () => new TileLayer({ source: new OSM() }),
  );

  const [view, setView] = useState(new View({ center: [10, 59], zoom: 8 }));
  useEffect(() => map.setView(view), [view]);

  useEffect(() => {
    const projection = baseLayer?.getSource()?.getProjection();
    if (projection) {
      setView(
        (oldView) =>
          new View({
            center: oldView.getCenter(),
            zoom: oldView.getZoom(),
            projection,
          }),
      );
    }
  }, [baseLayer]);

  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);
  const layers = useMemo(
    () => [baseLayer, ...vectorLayers],
    [baseLayer, vectorLayers],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  return (
    <MapContext.Provider value={{ map, layers, setVectorLayers, setBaseLayer }}>
      <header>
        <h1>Map Application</h1>
      </header>
      <Accordion>
        <Accordion.Item title="Map settings" className="mapSettingsAccordion">
          <div className="mapSettingsContainer">
            <BaseLayerDropdown />
            <Button onClick={handleFocusUser}>Focus user</Button>
            <KommuneLayerCheckbox />
            <FylkeLayerCheckbox />
            <SchoolLayerCheckbox />
            <TilfluktsromLayerCheckbox />
            <JernbaneLinjerLayerCheckbox />
            <VannkraftverkLayerCheckbox />
            <SivilforsvarsdistrikterLayerCheckbox />
            <TrainLayerCheckbox />
          </div>
        </Accordion.Item>
      </Accordion>
      <main>
        <div ref={mapRef}></div>
        <KommuneAside />
        <FylkeASide />
        <SchoolAside />
      </main>
    </MapContext.Provider>
  );
}
