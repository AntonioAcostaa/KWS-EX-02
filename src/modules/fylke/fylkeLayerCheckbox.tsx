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
interface FylkeProperties {
  fylkenummer: string;
  navn: Stedsnavn[];
}

interface Stedsnavn {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
}

type FylkeFeature = Feature & {
  getProperties(): FylkeProperties;
};

function getStedsnavn(navn: Stedsnavn[]): string | undefined {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

const fylkeLayer = new VectorLayer({
  className: "fylker",
  source: new VectorSource({
    url: "/KWS-EX-02/fylker.json",
    format: new GeoJSON(),
  }),
  style: defaultFylkeStyle,
});

function defaultFylkeStyle() {
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
export function selectedFylkeStyle(feature: FylkeFeature) {
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

export function FylkeLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const { map } = useContext(MapContext);
  const [activeFylkeFeature, setActiveFylkeFeature] =
    useState<FylkeFeature | null>(null);

  useLayer(fylkeLayer, checked);

  function handlePointMove(e: MapBrowserEvent<MouseEvent>) {
    map.forEachFeatureAtPixel(
      e.pixel,
      (f) => setActiveFylkeFeature(f as FylkeFeature),
      {
        layerFilter: (l) => l === fylkeLayer,
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
    if (activeFylkeFeature) {
      activeFylkeFeature.setStyle(selectedFylkeStyle(activeFylkeFeature));
    }

    return () => {
      if (activeFylkeFeature) {
        activeFylkeFeature.setStyle();
      }
    };
  }, [activeFylkeFeature]);

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
