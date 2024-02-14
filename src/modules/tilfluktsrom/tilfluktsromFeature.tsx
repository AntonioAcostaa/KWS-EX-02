import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export type TilfluktsromFeature = {
  getProperties(): tilfluktsromProperties;
} & Feature<Point>;

export interface tilfluktsromProperties {
  romnr: string;
  plasser: number;
  adresse: string;
}

export const tilfluktsromStyle = (feature: FeatureLike) => {
  const tilfluktsrom = feature.getProperties() as tilfluktsromProperties;
  return new Style({
    image: new Circle({
      radius: 2 + tilfluktsrom.plasser / 150,
      stroke: new Stroke({ color: "white" }),
    }),
  });
};

export const activeSchoolStyle = (feature: FeatureLike) => {
  const tilfluktsrom = feature.getProperties() as tilfluktsromProperties;
  return new Style({
    image: new Circle({
      radius: 2 + tilfluktsrom.plasser / 150,
      stroke: new Stroke({ color: "white", width: 3 }),
    }),
    text: new Text({
      text: tilfluktsrom.adresse + " " + tilfluktsrom.romnr,
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
