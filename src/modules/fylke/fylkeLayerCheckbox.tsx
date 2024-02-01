import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { MapBrowserEvent, Overlay } from "ol";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { Checkbox } from "@intility/bifrost-react";
import { MapContext } from "../map/mapContext";

interface FylkeProperties {
  fylkenummer: string;
  navn: { sprak: string; navn: string }[];
}

export function FylkeLayerCheckbox({}: {}) {
  const { map, setLayers } = useContext(MapContext);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedFylke = fylkeLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    const firstFeature = clickedFylke?.length ? clickedFylke[0] : undefined;
    if (firstFeature) {
      const fylkeProperties = firstFeature.getProperties() as FylkeProperties;
      setSelectedFylke(fylkeProperties);
      overlay.setPosition(e.coordinate);
    }
  }
  const fylkeLayer = useMemo(
    () =>
      new VectorLayer({
        className: "fylker",
        source: new VectorSource({
          url: "/KWS-EX-02/fylker.json",
          format: new GeoJSON(),
        }),
      }),
    [],
  );

  fylkeLayer.setStyle(
    new Style({
      stroke: new Stroke({
        color: "#0f2033",
        width: 2,
      }),
    }),
  );

  const [checked, setChecked] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const overlay = useMemo(() => new Overlay({}), []);

  useEffect(() => {
    overlay.setElement(overlayRef.current!);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, []);
  const [selectedFylke, setSelectedFylke] = useState<
    FylkeProperties | undefined
  >(undefined);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, fylkeLayer]);
      map.on("click", handleClick);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== fylkeLayer));
      map.un("click", handleClick);
    };
  }, [checked]);

  return (
    <div className="kommune-layer-checkbox">
      <Checkbox
        button
        type="switch"
        label={checked ? "Hide fylker" : "Show fylker"}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <div className="kommune-overlay" ref={overlayRef}>
        {selectedFylke &&
          selectedFylke.navn.find((n) => n.sprak === "nor")!.navn}
      </div>
    </div>
  );
}
