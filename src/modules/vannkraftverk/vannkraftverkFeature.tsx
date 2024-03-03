import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export type VannkraftverkFeature = {
  getProperties(): vannkraftverkProperties;
} & Feature<Point>;

export interface vannkraftverkProperties {
  vannkraftv: number;
  vannkraf_1: string;
  vannkraf_2: string;
  maksytelse: number;
  bruttofall: number;
  energikvi: number;
  opphav: string;
}

export const vannkraftverkStyle = (feature: FeatureLike) => {
  const vannkraftverk = feature.getProperties() as vannkraftverkProperties;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "black", width: 1 }),
      fill: new Fill({ color: "#ff47b6" }),
      radius: 3 + vannkraftverk.maksytelse / 50,
    }),
  });
};

export const activeVannkraftverkStyle = (feature: FeatureLike) => {
  const vannkraftverk = feature.getProperties() as vannkraftverkProperties;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "#ff47b6", width: 3 }),
      fill: new Fill({ color: "black" }),
      radius: 3 + vannkraftverk.maksytelse / 50,
    }),
    text: new Text({
      text: vannkraftverk.vannkraf_1 + " - " + vannkraftverk.opphav,
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
