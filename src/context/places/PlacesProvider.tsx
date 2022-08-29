//* libraries
import { useEffect, useReducer } from "react";
import { getUserLocation } from "../../helpers";
//* context
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
//* api
import searchApi from "../../apis/searchApi";
//* interfaces
import { PlacesResponse, Feature } from "../../interfaces/places";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
  isLoadingPlaces: boolean;
  places: Feature[];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
  isLoadingPlaces: false,
  places: [],
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const PlacesProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

  useEffect(() => {
    getUserLocation().then((lngLat) =>
      dispatch({ type: "setUserLocation", payload: lngLat })
    );
  }, []);

  const searchPlacesByTerm = async (query: string): Promise<Feature[]> => {
    // clean state
    if (query.length === 0) {
      dispatch({ type: "setPlaces", payload: [] });
      return [];
    }

    if (!state.userLocation) throw new Error("User location not available");

    dispatch({ type: "setLoadingPlaces" });

    const response = await searchApi.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: state.userLocation.join(","),
      },
    });

    dispatch({ type: "setPlaces", payload: response.data.features });
    return response.data.features;
  };

  return (
    <PlacesContext.Provider
      value={{
        ...state,

        // methods
        searchPlacesByTerm,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};
