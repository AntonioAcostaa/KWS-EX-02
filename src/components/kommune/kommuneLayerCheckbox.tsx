import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Map, MapBrowserEvent, Overlay } from "ol";
import "../styles/sliderButton.css";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

interface KommuneProperties {
  kommunenummer: string;
  navn: { sprak: string; navn: string }[];
}

export function KommuneLayerCheckbox({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedKommune = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    const firstFeature = clickedKommune?.length ? clickedKommune[0] : undefined;
    if (firstFeature) {
      const kommuneProperties =
        firstFeature.getProperties() as KommuneProperties;
      setSelectedKommune(kommuneProperties);
      overlay.setPosition(e.coordinate);
    }
  }
  const kommuneLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          url: "/KWS-EX-02/kommuner.json",
          format: new GeoJSON(),
        }),
      }),
    [],
  );

  kommuneLayer.setStyle(
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
  const [selectedKommune, setSelectedKommune] = useState<
    KommuneProperties | undefined
  >(undefined);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("click", handleClick);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== kommuneLayer));
      map.un("click", handleClick);
    };
  }, [checked]);

  return (
    <div className="kommune-layer-checkbox">
      <label>{checked ? "Hide" : "Show"} kommuner</label>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span className="slider round"></span>
      </label>
      <div className="kommune-overlay" ref={overlayRef}>
        {selectedKommune &&
          selectedKommune.navn.find((n) => n.sprak === "nor")!.navn}
      </div>
    </div>
  );
}
