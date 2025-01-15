import { TiLocationArrowOutline } from "react-icons/ti";

interface LocationDisplayProps {
  city: string;
  area: string | null;
  outlet: string | null;
  addressType: string | null;
}

const LocationDisplay = ({
  city,
  area,
  outlet,
  addressType,
}: LocationDisplayProps) => {
  return (
    <div className="md:p-2">
      <div className="bg-[var(--primary-light)] p-2 rounded-lg flex justify-between dark:text-white items-center border border-yellow-200">
        <div>
          <p className="text-[12px] ">Selected {addressType}:</p>
          <p className="text-[12px]">
            {city && (addressType === "Delivery" ? area : outlet)
              ? `${
                  addressType === "Delivery"
                    ? area
                        ?.split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")
                    : outlet
                }, ${city}`
              : "Not selected"}
          </p>
        </div>
        <TiLocationArrowOutline className="text-[#FFC714] text-3xl" />
      </div>
    </div>
  );
};

export default LocationDisplay;
