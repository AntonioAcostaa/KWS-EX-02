import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

import { Checkbox } from "@intility/bifrost-react";
import { useLayer } from "../map/useLayer";
import { MapBrowserEvent, Overlay } from "ol";
import { FeatureLike } from "ol/Feature";
import RenderFeature from "ol/render/Feature";
import { set } from "ol/transform";
import { MapContext } from "../map/mapContext";
import {
  VannkraftverkFeature,
  activeVannkraftverkStyle,
  vannkraftverkStyle,
} from "./vannkraftverkFeature";
import VannkraftverkModal from "./vannkraftverkModal";

const tilfluktsromLayer = new VectorLayer({
  source: new VectorSource({
    url: "/KWS-EX-02/vannkraftverk.json",
    format: new GeoJSON(),
  }),
  style: vannkraftverkStyle,
  className: "vannkraftverk",
});

export function VannkraftverkLayerCheckbox() {
  const { map } = useContext(MapContext);

  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<VannkraftverkFeature>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<VannkraftverkFeature>();

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
      setActiveFeature(features[0] as VannkraftverkFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeVannkraftverkStyle);
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
      return feature as VannkraftverkFeature;
    });

    if (feature?.getProperties().vannkraf_1) {
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
        label="Vannkraftverk"
      />
      {modalOpen && selectedFeature && (
        <VannkraftverkModal
          open={modalOpen}
          setOpen={setModalOpen}
          feature={selectedFeature}
        />
      )}
    </div>
  );
}
