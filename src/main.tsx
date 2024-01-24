import React from "react";
import ReactDOM from "react-dom/client";
import { MapApplication } from "./components/application/mapApplication";
import "@intility/bifrost-react/dist/bifrost-app.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(<MapApplication />);
