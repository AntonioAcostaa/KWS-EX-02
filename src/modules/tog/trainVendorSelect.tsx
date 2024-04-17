import React from "react";

import { Select } from "@intility/bifrost-react";

interface TrainVendorSelectProps {
  codespaceId: string;
  setCodespaceId: (codespaceId: string) => void;
}

const trainVendorOptions = [
  { value: "NSB", label: "VY" },
  { value: "GOA", label: "GoAhead" },
];

const TrainVendorSelect = ({
  codespaceId,
  setCodespaceId,
}: TrainVendorSelectProps) => {
  return (
    <Select
      label="Velg togleverandør"
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      onChange={(option) => {
        if (option) {
          setCodespaceId(option.value);
        }
      }}
      options={trainVendorOptions}
    />
  );
};

export default TrainVendorSelect;
