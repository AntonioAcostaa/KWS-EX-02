import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../map/useLayer";
import { Checkbox } from "@intility/bifrost-react";

const kommuneLayer = new VectorLayer({
  className: "kommuner",
  source: new VectorSource({
    url: "/KWS-EX-02/kommuner.json",
    format: new GeoJSON(),
  }),
});

export function KommuneLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  useLayer(kommuneLayer, checked);

  return (
    <div>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Kommuner"
        />
    </div>
  );
}
