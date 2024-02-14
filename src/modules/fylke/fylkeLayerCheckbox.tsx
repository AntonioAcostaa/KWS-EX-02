import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FylkeFeature } from "./fylkeASide";
import { useLayer } from "../map/useLayer";
import { Checkbox } from "@intility/bifrost-react";

const fylkeLayer = new VectorLayer({
  className: "fylker",
  source: new VectorSource({
    url: "/KWS-EX-02/fylker.json",
    format: new GeoJSON(),
  }),
  style: (feature) => {
    const fylke = feature as FylkeFeature;
    const { fylkesnummer } = fylke.getProperties();
    return new Style({
      stroke: new Stroke({
        color: "var(--bfc-theme-c)",
        width: 2,
      }),
      text: new Text({
        stroke: new Stroke({
          color: "blue",
        }),
        text: fylkesnummer,
      }),
    });
  },
});

export function FylkeLayerCheckbox() {
  const [checked, setChecked] = useState(false);

  useLayer(fylkeLayer, checked);

  return (
    <div>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Fylker"
      />
    </div>
  );
}
