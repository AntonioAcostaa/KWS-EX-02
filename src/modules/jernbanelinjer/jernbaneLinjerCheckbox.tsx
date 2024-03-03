import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

import { Checkbox } from "@intility/bifrost-react";
import { useLayer } from "../map/useLayer";
import { MapContext } from "../map/mapContext";
import { MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import {
  JernbanelinjerFeature,
  activeJernbanelinjerStyle,
  jernbaneLinjerStyle,
} from "./jernbaneLinjerFeature";

const jernbaneLinjerLayer = new VectorLayer({
  source: new VectorSource({
    url: "/KWS-EX-02/jernbanelinjer-N50.json",
    format: new GeoJSON(),
  }),
  style: jernbaneLinjerStyle,
  className: "jernbanelinjer",
});

export function JernbaneLinjerLayerCheckbox() {
  const { map } = useContext(MapContext);

  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<JernbanelinjerFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === jernbaneLinjerLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as JernbanelinjerFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeJernbanelinjerStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  useLayer(jernbaneLinjerLayer, checked);

  return (
    <div>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Jernbanelinjer N50"
      />
    </div>
  );
}
