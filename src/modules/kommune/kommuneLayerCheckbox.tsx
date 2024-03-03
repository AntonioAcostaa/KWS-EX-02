import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";
import { Polygon } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";
import { MapContext } from "../map/mapContext";
import { Checkbox } from "@intility/bifrost-react";
import { useLayer } from "../map/useLayer";

// Defining< the interfaces for the kommunen properties and stedsnavn
interface KommuneProperties {
  kommunenummer: string;
  navn: Stedsnavn[];
}

interface Stedsnavn {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
}

type KommuneFeature = Feature & {
  getProperties(): KommuneProperties;
};

function getStedsnavn(navn: Stedsnavn[]): string | undefined {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

const kommuneLayer = new VectorLayer({
  className: "kommuner",
  source: new VectorSource({
    url: "/KWS-EX-02/kommuner.json",
    format: new GeoJSON(),
  }),
  style: defaultKommuneStyle,
});

function defaultKommuneStyle() {
  return new Style({
    stroke: new Stroke({
      color: "Blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  });
}

// Adapt the selected style function to include kommunenav
export function selectedKommuneStyle(feature: KommuneFeature) {
  const navn = getStedsnavn(feature.getProperties().navn);
  return new Style({
    stroke: new Stroke({
      color: "black",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 255, 0, 0.1)",
    }),
    text: new Text({
      text: navn, // Display the kommunenavn
      overflow: true,
      font: "bold 15px sans-serif",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 6 }),
    }),
  });
}

export function KommuneLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const { map } = useContext(MapContext);
  const [activeKommuneFeature, setActiveKommuneFeature] =
    useState<KommuneFeature | null>(null);

  useLayer(kommuneLayer, checked);

  function handlePointMove(e: MapBrowserEvent<MouseEvent>) {
    map.forEachFeatureAtPixel(
      e.pixel,
      (f) => setActiveKommuneFeature(f as KommuneFeature),
      {
        layerFilter: (l) => l === kommuneLayer,
      },
    );
  }

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointMove);
    }

    return () => map?.un("pointermove", handlePointMove);
  }, [checked, map]);

  useEffect(() => {
    if (activeKommuneFeature) {
      activeKommuneFeature.setStyle(selectedKommuneStyle(activeKommuneFeature));
    }

    return () => {
      if (activeKommuneFeature) {
        activeKommuneFeature.setStyle();
      }
    };
  }, [activeKommuneFeature]);

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
