/* eslint import/no-webpack-loader-syntax: off */

//* libraries
import React from "react";
import ReactDOM from "react-dom/client";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
//* apps
import { MapsApp } from "./MapsApp";

mapboxgl.accessToken = `${process.env.REACT_APP_ACCESS_TOKEN}`;

if (!navigator.geolocation) {
  alert("Geolocation is not available in your browser ");
  throw new Error("Geolocation is not available in your browser ");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MapsApp />
  </React.StrictMode>
);
