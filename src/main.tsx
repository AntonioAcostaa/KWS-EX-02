import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/application/application";
import "@intility/bifrost-react/dist/bifrost-app.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(<Application />);
