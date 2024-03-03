import { Modal } from "@intility/bifrost-react";
import React from "react";
import { VannkraftverkFeature } from "./vannkraftverkFeature";

interface VannkraftverkModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  feature: VannkraftverkFeature;
}

const VannkraftverkModal = ({
  open,
  setOpen,
  feature,
}: VannkraftverkModalProps) => {
  return (
    <Modal
      fromBottom
      header={
        "Vannkraftverk:" +
        (feature ? ` ${feature.getProperties().vannkraf_1}` : "")
      }
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      noPadding
    >
      {feature && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "20px 10px",
            marginLeft: "15px",
          }}
        >
          <p>Opphav: {feature.get("opphav")}</p>
          <p>Maksytelse: {feature.get("maksytelse")}</p>
        </div>
      )}
    </Modal>
  );
};

export default VannkraftverkModal;
