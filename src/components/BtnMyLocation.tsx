//* libraries
import { useContext } from "react";
//* context
import { MapContext, PlacesContext } from "../context";

export const BtnMyLocation = () => {
  const { map, isMapReady } = useContext(MapContext);
  const { userLocation } = useContext(PlacesContext);

  const onClick = () => {
    if (!isMapReady) throw new Error("Map is not ready");
    if (!userLocation) throw new Error("User Location is not available");

    //  move screen to user location
    map?.flyTo({
      zoom: 14,
      center: userLocation,
    });
  };

  return (
    <button
      className="btn btn-primary"
      style={{
        position: "fixed",
        right: "20px",
        top: "20px",
        zIndex: 999,
      }}
      onClick={onClick}
    >
      My Location
    </button>
  );
};
