import React, { memo } from "react";
import { FiSearch } from "react-icons/fi";

interface LocationResponse {
  Name: string;
  ImageURL: string;
  delivery_tax: string;
}

interface CityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cities: LocationResponse[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string | null;
  onCitySelect: (city: string, delivery_tax: string) => void;
  isLoading?: boolean;
}

// Extract LoadingSpinner as separate component
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
  </div>
));

// Extract SearchInput as separate component
const SearchInput = memo(({ searchQuery, onSearchChange }: { searchQuery: string, onSearchChange: (query: string) => void }) => (
  <div className="relative mb-10">
    <div className="flex items-center w-full p-2 px-4 shadow-lg relative">
      <FiSearch className="mr-6 text-xl dark:text-white text-gray-600" />
      <input
        type="text"
        placeholder="Search City"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 text-xl outline-none dark:bg-[#202020] dark:text-white"
      />
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-b from-black/10 to-transparent" />
    </div>
  </div>
));

// Extract CityList as separate component
const CityList = memo(({ cities, searchQuery, selectedCity, onCitySelect }: {
  cities: LocationResponse[],
  searchQuery: string,
  selectedCity: string | null,
  onCitySelect: (city: string, delivery_tax: string) => void
}) => {
  const filteredCities = [
    { Name: "Select", ImageURL: "", delivery_tax: "" },
    ...cities?.filter(city => 
      city.Name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-t border-b border-gray-200">
        <div className="p-4 space-y-4">
          {filteredCities.map((city, index) => (
            <div key={index} className="relative">
              <label className="flex items-center space-x-12 mb-4 cursor-pointer">
                <input
                  type="radio"
                  name="city"
                  value={city.Name}
                  checked={selectedCity === city.Name || (!selectedCity && city.Name === "Select")}
                  onChange={() => onCitySelect(city.Name, city.delivery_tax)}
                  className="w-5 h-5 appearance-none border-2 rounded-full border-gray-800 dark:border-gray-200 checked:border-[var(--yellow-border)] relative before:content-[''] before:block before:w-[10px] before:h-[10px] before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-[var(--primary)]"
                />
                <span className="text-base ml-1 mb-2 dark:text-white">
                  {city.Name}
                </span>
              </label>
              <div className="absolute bottom-0 left-16 right-0 h-px bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const CityPopup = memo(({ isOpen, onClose, cities, searchQuery, onSearchChange, selectedCity, onCitySelect, isLoading }: CityPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="fixed inset-0 slide-up pointer-events-auto">
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-[800px] h-screen sm:h-[680px] transform bg-white dark:bg-[#202020] shadow-xl transition-all flex flex-col">
                <div className="p-5 flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold dark:text-white text-center flex-1">
                    Select City
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-lg font-medium cursor-pointer dark:text-white"
                  >
                    Close
                  </button>
                </div>

                <SearchInput searchQuery={searchQuery} onSearchChange={onSearchChange} />
                <CityList 
                  cities={cities}
                  searchQuery={searchQuery}
                  selectedCity={selectedCity}
                  onCitySelect={onCitySelect}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

CityPopup.displayName = 'CityPopup';

export default CityPopup;
