import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

import { Checkbox } from "@intility/bifrost-react";
import { useLayer } from "../map/useLayer";
import {
  TilfluktsromFeature,
  activeTilfluktsromStyle,
  tilfluktsromStyle,
} from "./tilfluktsromFeature";
import { MapContext } from "../map/mapContext";
import { MapBrowserEvent, Overlay } from "ol";
import { FeatureLike } from "ol/Feature";
import TilfluktsromModal from "./tilfluktsromModal";

const tilfluktsromLayer = new VectorLayer({
  source: new VectorSource({
    url: "/KWS-EX-02/tilfluktsrom.json",
    format: new GeoJSON(),
  }),
  style: tilfluktsromStyle,
  className: "tilfluktsrom",
});

export function TilfluktsromLayerCheckbox() {
  const { map } = useContext(MapContext);

  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<TilfluktsromFeature>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<TilfluktsromFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === tilfluktsromLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as TilfluktsromFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeTilfluktsromStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  useLayer(tilfluktsromLayer, checked);

  map.on("click", function (evt) {
    const resolution = map.getView().getResolution();
    if (!checked || !resolution || resolution > 100) {
      return;
    }
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature as TilfluktsromFeature;
    });

    if (feature?.getProperties().romnr) {
      setSelectedFeature(feature);
      setModalOpen(true);
    }
  });

  return (
    <div>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Tilfluktsrom"
      />
      {modalOpen && selectedFeature && (
        <TilfluktsromModal
          open={modalOpen}
          setOpen={setModalOpen}
          feature={selectedFeature}
        />
      )}
    </div>
  );
}
