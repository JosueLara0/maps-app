//* libraries
import { useContext, useState } from "react";
//* context
import { MapContext, PlacesContext } from "../context";
//* components
import { LoadingPlaces } from "./LoadingPlaces";
//* interfaces
import { Feature } from "../interfaces/places";

export const SearchResults = () => {
  const { places, isLoadingPlaces, userLocation } = useContext(PlacesContext);
  const { map, getRouteBetweenPoints } = useContext(MapContext);

  const [activeId, setActiveId] = useState<string>("");

  // use the menu option selected coords to move the screen to it
  const onPlaceClicked = (place: Feature) => {
    const [lng, lat] = place.center;

    setActiveId(place.id);

    map?.flyTo({
      zoom: 14,
      center: [lng, lat],
    });
  };

  // get route between the user location and the place selected
  const getRoute = (place: Feature) => {
    if (!userLocation) return;

    const [lng, lat] = place.center;

    getRouteBetweenPoints(userLocation, [lng, lat]);
  };

  if (isLoadingPlaces) return <LoadingPlaces />;

  if (places.length === 0) return <></>;

  return (
    <ul className="list-group mt-3">
      {places.map((place) => (
        <li
          key={place.id}
          className={`list-group-item list-group-item-action pointer ${
            activeId === place.id ? "active" : ""
          }`}
          onClick={() => onPlaceClicked(place)}
        >
          <h6>{place.text}</h6>

          <p style={{ fontSize: "12px" }}>{place.place_name}</p>

          <button
            className={`btn  btn-sm ${
              activeId === place.id
                ? "btn-outline-light"
                : "btn-outline-primary"
            }`}
            onClick={() => getRoute(place)}
          >
            Addresses
          </button>
        </li>
      ))}
    </ul>
  );
};
