import { Modal } from "@intility/bifrost-react";
import React from "react";
import { TilfluktsromFeature } from "./tilfluktsromFeature";

interface TilfluktsromModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  feature: TilfluktsromFeature;
}

const tilfluktsromModal = ({
  open,
  setOpen,
  feature,
}: TilfluktsromModalProps) => {
  return (
    <Modal
      fromBottom
      header={
        "Tilfluktsrom" + (feature ? ` ${feature.getProperties().romnr}` : "")
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
          <p>Adresse: {feature.get("adresse")}</p>
          <p>Plasser: {feature.get("plasser")}</p>
        </div>
      )}
    </Modal>
  );
};

export default tilfluktsromModal;
