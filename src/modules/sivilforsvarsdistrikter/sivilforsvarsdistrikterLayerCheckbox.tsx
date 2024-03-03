import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../map/useLayer";
import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";
import { MapContext } from "../map/mapContext";
import { Feature, MapBrowserEvent } from "ol";
import { Polygon } from "ol/geom";
import { Checkbox } from "@intility/bifrost-react";

const sivilforsvarsdistrikterLayer = new VectorLayer({
  className: "sivilforsvarsdistrikter",
  source: new VectorSource({
    url: "/KWS-EX-02/sivilforsvarsdistrikter.json",
    format: new GeoJSON(),
  }),
  //Making sure to set the layer as the defaulted style
  style: defaultDistrikterStyle,
});

//Styling the default look of the polygn layer
function defaultDistrikterStyle() {
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
//Styling the desired look of the polygon layer when hovering over
function selectedDistrikterStyle(feature: FeatureLike) {
  return new Style({
    stroke: new Stroke({
      color: "black",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 255, 0, 0.1)",
    }),
    text: new Text({
      text: feature.getProperties().navn,
      overflow: true,
      font: "bold 15px sans-serif",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 6 }),
    }),
  });
}
export function SivilforsvarsdistrikterLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  useLayer(sivilforsvarsdistrikterLayer, checked);
  const { map } = useContext(MapContext);
  const [activeDistrikterFeature, setActiveDistrikterFeature] =
    useState<Feature>();

  //Making a function to handle the pointer movement over the map and updating the style from default to selected style
  function handlePointMove(e: MapBrowserEvent<MouseEvent>) {
    map.forEachFeatureAtPixel(
      e.pixel,
      (f) => setActiveDistrikterFeature(f as Feature<Polygon>),
      {
        layerFilter: (l) => l === sivilforsvarsdistrikterLayer,
      },
    );
  }

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointMove);
    }

    return () => map?.un("pointermove", handlePointMove);
  }, [checked]);

  useEffect(() => {
    activeDistrikterFeature?.setStyle(selectedDistrikterStyle);

    return () => activeDistrikterFeature?.setStyle(defaultDistrikterStyle);
  }, [activeDistrikterFeature]);

  return (
    <div>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Sivilforsvarsdistrikter"
      />
    </div>
  );
}
