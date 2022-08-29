/* eslint import/no-webpack-loader-syntax: off */

//* libraries
import { useReducer, useContext, useEffect } from "react";
//@ts-ignore
import { Map, Marker, Popup, AnySourceData, LngLatBounds } from "!mapbox-gl";
//* context
import { PlacesContext, MapContext } from "../";
import { mapReducer } from "./mapReducer";
//* apis
import { directionsApi } from "../../apis";
//* interfaces
import { DirectionResponse } from "../../interfaces/directions";

export interface MapState {
  isMapReady: boolean;
  map?: Map;
  markers: Marker[];
}

const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
  markers: [],
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);

  const { places } = useContext(PlacesContext);

  useEffect(() => {
    // remove markers from map
    state.markers.forEach((marker) => marker.remove());

    const newMarkers: Marker[] = [];

    // create popups, add them to markers and these to map markers
    for (const place of places) {
      const [lng, lat] = place.center;

      const popup = new Popup().setHTML(
        `
        <h6>${place.text}</h6>
        <p>${place.place_name}</p>
        `
      );

      const newMarker = new Marker()
        .setPopup(popup)
        .setLngLat([lng, lat])
        .addTo(state.map!);

      newMarkers.push(newMarker);
    }

    dispatch({ type: "setMarkers", payload: newMarkers });
  }, [places]);

  const setMap = (map: Map) => {
    const myLocationPopup = new Popup().setHTML(`
    <h4>I am here</h4>
    <p>In some place of the world</p>
    `);

    new Marker({ color: "purple" })
      .setLngLat(map.getCenter())
      .setPopup(myLocationPopup)
      .addTo(map);

    dispatch({ type: "setMap", payload: map });
  };

  const getRouteBetweenPoints = async (
    start: [number, number],
    end: [number, number]
  ) => {
    const response = await directionsApi.get<DirectionResponse>(
      `/${start.join(",")};${end.join(",")}`
    );

    const { distance, duration, geometry } = response.data.routes[0];
    const { coordinates: coords } = geometry;

    let kms = distance / 1000;
    kms = Math.round(kms * 100);
    kms /= 100;

    const minutes = Math.floor(duration / 60);
    console.log({ kms, minutes });

    // map content
    const bounds = new LngLatBounds(start, start);

    // add coords to bounds
    for (const coord of coords) {
      const newCoord: [number, number] = [coord[0], coord[1]];
      bounds.extend(newCoord);
    }

    // allow to see the map between the user and the location searched
    state.map?.fitBounds(bounds, {
      padding: 200,
    });

    // Polyline
    const sourceData: AnySourceData = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        ],
      },
    };

    // clean previous polyline
    if (state.map?.getLayer("RouteString")) {
      state.map.removeLayer("RouteString");
      state.map.removeSource("RouteString");
    }

    // render polyline
    state.map?.addSource("RouteString", sourceData);

    // polyline styles
    state.map?.addLayer({
      id: "RouteString",
      type: "line",
      source: "RouteString",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "black",
        "line-width": 3,
      },
    });
  };

  return (
    <MapContext.Provider
      value={{
        ...state,

        // methods
        setMap,
        getRouteBetweenPoints,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
