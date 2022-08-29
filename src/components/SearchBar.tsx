//* libraries
import { ChangeEvent, useRef, useContext } from "react";
//* context
import { PlacesContext } from "../context/places/PlacesContext";
//* components
import { SearchResults } from "./SearchResults";

export const SearchBar = () => {
  const { searchPlacesByTerm } = useContext(PlacesContext);

  const debounceRef = useRef<NodeJS.Timeout>();

  // search user input text
  const onQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // wait one second after the last input of the user to make the search
    debounceRef.current = setTimeout(() => {
      searchPlacesByTerm(event.target.value);
    }, 350);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="form-control"
        placeholder="Search location..."
        onChange={onQueryChanged}
      />

      <SearchResults />
    </div>
  );
};
