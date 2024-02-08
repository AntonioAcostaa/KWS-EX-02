import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { schoolStyle } from "./schoolFeature";
import { useLayer } from "../modules/map/useLayer";
import { Checkbox } from "@intility/bifrost-react";

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/KWS-EX-02/schools.json",
    format: new GeoJSON(),
  }),
  style: schoolStyle,
  className: "schools",
});

export function SchoolLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  useLayer(schoolLayer, checked);
  return (
    <div>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Schools"
        />
    </div>
  );
}
