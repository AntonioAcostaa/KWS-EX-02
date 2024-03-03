import React, { useEffect } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { useVectorFeatures } from "../map/useVectorFeatures";
import { Stroke, Style } from "ol/style";
import { useActiveFeatures } from "../map/useActiveFeatures";
import { selectedFylkeStyle } from "./fylkeLayerCheckbox";

type FylkeVectorLayer = VectorLayer<VectorSource<FylkeFeature>>;

interface FylkeProperties {
  fylkenummer: string;
  navn: Stedsnavn[];
}

// "navn": [{ "rekkefolge": "", "sprak": "nor", "navn": "Værøy" }]
interface Stedsnavn {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
}

type FylkeFeature = {
  getProperties(): FylkeProperties;
} & Feature;

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

const activeStyle = new Style({
  stroke: new Stroke({ color: "black", width: 3 }),
});

export function FylkeASide() {
  const { visibleFeatures } = useVectorFeatures<FylkeFeature>(
    (l) => l.getClassName() === "fylker",
  );
  const { activeFeatures, setActiveFeatures } = useActiveFeatures<FylkeFeature>(
    (l) => l.getClassName() === "fylker",
  );
  useEffect(() => {
    activeFeatures.forEach((f) => f.setStyle(selectedFylkeStyle(f)));
    return () => activeFeatures.forEach((f) => f.setStyle(undefined));
  }, [activeFeatures]);

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Fylker</h2>
        <ul onMouseLeave={() => setActiveFeatures([])}>
          {visibleFeatures?.map((k) => (
            <li
              key={k.getProperties().fylkenummer}
              onMouseEnter={() => setActiveFeatures([k])}
              className={activeFeatures.includes(k) ? "active" : ""}
            >
              {getStedsnavn(k.getProperties().navn)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
