import React, { memo } from "react";
import { FiSearch } from "react-icons/fi";

interface AreaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  areas: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedArea: string | null;
  onAreaSelect: (area: string) => void;
  isLoading?: boolean;
}

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
  </div>
));

const SearchInput = memo(({ searchQuery, onSearchChange }: { searchQuery: string, onSearchChange: (query: string) => void }) => (
  <div className="relative mb-4">
    <div className="flex items-center w-full p-2 px-4 shadow-lg relative">
      <FiSearch className="mr-6 text-xl dark:text-white text-gray-600" />
      <input
        type="text"
        placeholder="Search Area"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 text-xl outline-none dark:bg-[#202020] dark:text-white"
      />
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-b from-black/10 to-transparent" />
    </div>
  </div>
));

const AreaList = memo(({ areas, searchQuery, selectedArea, onAreaSelect }: {
  areas: string[],
  searchQuery: string,
  selectedArea: string | null,
  onAreaSelect: (area: string) => void
}) => {
  const filteredAreas = [
    "Select your area",
    ...areas?.filter(area => 
      area.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-t border-b border-gray-200">
        <div className="p-4 space-y-4">
          {filteredAreas.map((area, index) => (
            <div key={index} className="relative">
              <label className="flex items-center space-x-12 mb-4 cursor-pointer">
                <input
                  type="radio"
                  name="area"
                  value={area}
                  checked={selectedArea === area || (!selectedArea && area === "Select your area")}
                  onChange={() => onAreaSelect(area)}
                  className="w-5 h-5 appearance-none border-2 rounded-full border-gray-800 dark:border-gray-200 checked:border-[var(--yellow-border)] relative before:content-[''] before:block before:w-[10px] before:h-[10px] before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-[var(--primary)]"
                />
                <span className="text-base ml-1 mb-2 dark:text-white">
                  {area}
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

const AreaPopup = memo(({ isOpen, onClose, areas, searchQuery, onSearchChange, selectedArea, onAreaSelect, isLoading }: AreaPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="fixed inset-0 pointer-events-auto slide-up">
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-[800px] h-screen sm:h-[680px] transform bg-white dark:bg-[#202020] shadow-xl transition-all flex flex-col">
                <div className="p-5 flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold dark:text-white text-center flex-1">
                    Select Area
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-lg font-medium cursor-pointer dark:text-white"
                  >
                    Close
                  </button>
                </div>

                <SearchInput searchQuery={searchQuery} onSearchChange={onSearchChange} />
                <AreaList 
                  areas={areas}
                  searchQuery={searchQuery}
                  selectedArea={selectedArea}
                  onAreaSelect={onAreaSelect}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

AreaPopup.displayName = 'AreaPopup';

export default AreaPopup;
