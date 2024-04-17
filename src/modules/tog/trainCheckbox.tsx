import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { request } from "graphql-request";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import * as ol from "ol";
import { Checkbox } from "@intility/bifrost-react";
import { useLayer } from "../map/useLayer";
import { MapContext } from "../map/mapContext";
import { FeatureLike } from "ol/Feature";
import { MapBrowserEvent } from "ol";
import {
  TrainFeature,
  TrainProperties,
  activeTrainStyle,
  trainStyle,
} from "./trainFeature";
import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { useSubscription } from "@apollo/client";
import { Subscription } from "zen-observable-ts";
import { Geometry } from "ol/geom";
import TrainVendorSelect from "./trainVendorSelect";

// Create an http link:
const httpLink = new HttpLink({
  uri: "https://api.entur.io/realtime/v1/vehicles/graphql",
});

// Create a WebSocket link:
const wsLink = new WebSocketLink(
  new SubscriptionClient(
    "wss://api.entur.io/realtime/v1/vehicles/subscriptions",
    {
      reconnect: true,
    },
  ),
);

// Using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

// Instantiate client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// Define your subscription
const VEHICLES_QUERY = gql`
  query Vehicles($codespaceId: String!) {
    vehicles(codespaceId: $codespaceId) {
      line {
        lineRef
      }
      lastUpdated
      vehicleId
      location {
        latitude
        longitude
      }
      vehicleStatus
      delay
      speed
      bearing
    }
  }
`;

const VEHICLES_SUBSCRIPTION = gql`
  subscription Vehicles($codespaceId: String!) {
    vehicles(codespaceId: $codespaceId) {
      line {
        lineRef
      }
      lastUpdated
      vehicleId
      location {
        latitude
        longitude
      }
      vehicleStatus
      delay
      speed
      bearing
    }
  }
`;

const trainLayer = new VectorLayer({
  source: new VectorSource(),
  className: "trains",
  style: trainStyle,
});

export function TrainLayerCheckbox() {
  const { map } = useContext(MapContext);

  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<TrainFeature>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<TrainFeature>();
  const [codespaceId, setCodespaceId] = useState<string>("NSB"); // Add type assertion
  const validCodespaceId = codespaceId ?? "NSB";
  const fetchTrains = (codespaceId?: string) => {
    request(
      "https://api.entur.io/realtime/v1/vehicles/graphql",
      VEHICLES_QUERY,
      { codespaceId: codespaceId ?? validCodespaceId },
    )
      .then((data: any) => {
        const features: ol.Feature[] = (
          data as { vehicles: TrainProperties[] }
        ).vehicles.map((vehicle: TrainProperties) => {
          const feature = new ol.Feature({
            geometry: new Point([
              vehicle.location.longitude,
              vehicle.location.latitude,
            ]),
          });
          feature.setId(vehicle.vehicleId); // Set the ID here
          feature.setProperties(vehicle);
          return feature;
        });

        // ...

        if (trainLayer) {
          const source = trainLayer.getSource();
          if (source) {
            features.forEach((feature: Feature<Geometry>) => {
              const id = feature.getId() as string | number; // Add type assertion
              const existingFeature = source.getFeatureById(
                id,
              ) as Feature<Geometry>;
              if (existingFeature) {
                existingFeature.setGeometry(feature.getGeometry()); // Update the geometry
                existingFeature.setProperties(feature.getProperties()); // Update the properties
              } else {
                source.addFeature(feature);
              }
            });
          }
        }
      })
      .catch((error) => console.error(error));
  };

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === trainLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as TrainFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    if (activeFeature) {
      activeFeature.setStyle(activeTrainStyle);
    }
    return () => {
      if (activeFeature) {
        activeFeature.setStyle(trainStyle);
      }
    };
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  // Use the subscription
  useEffect(() => {
    let unsubscribe: Subscription | null = null;
    if (checked) {
      unsubscribe = client
        .subscribe({ query: VEHICLES_SUBSCRIPTION })
        .subscribe({
          next({ data }) {
            const features = data.vehicles.map((vehicle: TrainProperties) => {
              const feature = new ol.Feature({
                geometry: new Point([
                  vehicle.location.longitude,
                  vehicle.location.latitude,
                ]),
              });
              feature.setId(vehicle.vehicleId); // Set the ID here
              if (vehicle.line && vehicle.line.lineRef) {
                feature.setProperties({
                  lineRef: vehicle.line.lineRef,
                  lastUpdated: vehicle.lastUpdated,
                  vehicleStatus: vehicle.vehicleStatus,
                  delay: vehicle.delay,
                  speed: vehicle.speed,
                  bearing: vehicle.bearing,
                });
              }
              console.log("Train location updated!");
              return feature;
            });
            if (trainLayer) {
              const source = trainLayer.getSource();
              if (source) {
                features.forEach((feature: Feature<Geometry>) => {
                  const id = feature.getId() as string | number; // Add type assertion
                  const existingFeature = source.getFeatureById(
                    id,
                  ) as Feature<Geometry>;
                  if (existingFeature) {
                    existingFeature.setGeometry(feature.getGeometry()); // Update the geometry
                    existingFeature.setProperties(feature.getProperties()); // Update the properties
                  } else {
                    source.addFeature(feature);
                  }
                });
              }
            }
          },
          error(err) {
            console.error("err", err);
          },
        });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe.unsubscribe();
      }
    };
  }, [checked]);

  useEffect(() => {
    if (checked) {
      fetchTrains();
      map?.addLayer(trainLayer);
    } else {
      trainLayer?.getSource()?.clear();
      map?.removeLayer(trainLayer);
    }
  }, [checked, map]);

  useEffect(() => {
    if (checked) {
      // Clear the previous trains
      const source = trainLayer.getSource();
      if (source) {
        source.clear();
      }

      // Fetch the new trains
      fetchTrains(codespaceId);
    }
  }, [checked, codespaceId]);

  useLayer(trainLayer, checked);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <Checkbox
        checked={checked}
        type="switch"
        button
        onChange={(e) => setChecked(e.target.checked)}
        label="Vy trains (live)"
      />
      {checked && (
        <TrainVendorSelect
          codespaceId={codespaceId}
          setCodespaceId={setCodespaceId}
        />
      )}
    </div>
  );
}

export default TrainLayerCheckbox;
