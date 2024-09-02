import React, { useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { fetchCities } from "../../api/OpenWeatherService";

const Search = ({ onSearchChange, clear }) => {
  const [searchValue, setSearchValue] = useState(null);

  const loadOptions = async (inputValue) => {
    const citiesList = await fetchCities(inputValue);

    return {
      options: citiesList.data.map((city) => {
        return {
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.regionCode}`,
        };
      }),
    };
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  useEffect(() => {
    if (clear) {
      setSearchValue("");
    }
  }, [clear]);
  return (
    <AsyncPaginate
      placeholder="Search for cities"
      debounceTimeout={600}
      value={searchValue}
      onChange={onChangeHandler}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
