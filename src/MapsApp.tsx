//* context
import { PlacesProvider, MapProvider } from "./context";
//* styles
import "./styles.css";
//* screens
import { HomeScreen } from "./screens";

export const MapsApp = () => {
  return (
    <PlacesProvider>
      <MapProvider>
        <HomeScreen />
      </MapProvider>
    </PlacesProvider>
  );
};
