import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

import { Checkbox } from "@intility/bifrost-react";
import { useLayer } from "../map/useLayer";
import { tilfluktsromStyle } from "./tilfluktsromFeature";

const tilfluktsromlLayer = new VectorLayer({
  source: new VectorSource({
    url: "/KWS-EX-02/tilfluktsrom.json",
    format: new GeoJSON(),
  }),
  style: tilfluktsromStyle,
  className: "tilfluktsrom",
});

export function TilfluktsromLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  useLayer(tilfluktsromlLayer, checked);
  return (
    <div>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Tilfluktsrom"
      />
    </div>
  );
}
