"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getAreas,
  getCitiesWithImage,
  getOutlets,
} from "@/services/location/services";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { addressesActions } from "@/redux/address/slice";
import { clearCart } from "@/redux/cart/action";
import PopupHeader from "../UI/PopupHeader";
import CityPopup from "./CityDialog";
import AreaPopup from "./AreaPopup";
import OutletPopup from "./OutletPopup";
import LocationDisplay from "../UI/LocationDialog";
import { openToaster, setLoading } from "@/redux/toaster/slice";

interface LocationResponse {
  Name: string;
  ImageURL: string;
  delivery_tax: string;
}

const HeaderPopup = () => {
  const dispatch = useDispatch<StoreDispatch>();
  const addressState = useSelector((state: StoreState) => state.address);
  const cartItems = useSelector((state: StoreState) => state.cart.cartProducts);
  const userData = useSelector((state: StoreState) => state.auth.userData);
  const toasterOpen = useSelector((state: StoreState) => state.toaster.isOpen);
  const { isAuthenticated } = useSelector((state: StoreState) => state.auth);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCityDialog, setShowCityDialog] = useState<boolean>(false);
  const [showAreaDialog, setShowAreaDialog] = useState<boolean>(false);
  const [showOutletDialog, setShowOutletDialog] = useState<boolean>(false);
  const [cities, setCities] = useState<LocationResponse[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [outlets, setOutlets] = useState<string[]>([]);
  const [phone, setPhone] = useState<string | "">("");
  const [isCityLoading, setIsCityLoading] = useState<boolean>(false);
  const [isAreaLoading, setIsAreaLoading] = useState<boolean>(false);
  const [isOutletLoading, setIsOutletLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedOutlet, setSelectedOutlet] = useState<string>("");
  const [selectedAddressType, setSelectedAddressType] =
    useState<string>("Delivery");
  const [tax, setTax] = useState<string>("");

  const router = useRouter();
  const isValid =
    selectedAddressType === "Delivery"
      ? Boolean(
          selectedCity &&
            selectedArea &&
            (isAuthenticated
              ? userData && userData?.phone?.length >= 11
              : phone.length >= 11)
        )
      : Boolean(selectedCity && selectedOutlet);

  useEffect(() => {
    if (addressState.modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  });

  useEffect(() => {
    dispatch(setLoading(true));
    setSelectedAddressType("Delivery");
    setSelectedCity("");
    setSelectedArea("");
    setPhone("");
    setSelectedOutlet("");
    setTax("");
    dispatch(setLoading(false));
  }, [addressState.modalOpen]);

  useEffect(() => {
    const fetchCities = async () => {
      setIsCityLoading(true);
      try {
        const response = await getCitiesWithImage({});
        if (response) {
          setCities(response);
        }
      } catch (err) {
        console.error("Error Fetching Cities", err);
      }
      setIsCityLoading(false);
    };
    fetchCities();
  }, []);

  const handleClose = () => {
    dispatch(addressesActions.setAddresses({ modalOpen: false }));
  };

  const handleCitySelect = async (city: string, delivery_tax: string) => {
    if (cartItems.length > 0) {
      dispatch(clearCart());
    }
    setSelectedCity(city);
    setTax(delivery_tax);
    setShowCityDialog(false);

    if (selectedAddressType === "Delivery") {
      setShowAreaDialog(true);
      setIsAreaLoading(true);
      try {
        const areasResponse = await getAreas(city, {});
        if (areasResponse) {
          setAreas(areasResponse);
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
      setIsAreaLoading(false);
    }
    if (selectedAddressType === "Pickup") {
      setShowOutletDialog(true);
      setIsOutletLoading(true);
      try {
        const outletsResponse = await getOutlets(city, {});
        if (outletsResponse) {
          setOutlets(outletsResponse);
        }
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
      setIsOutletLoading(false);
    }
  };

  const handleOutletSelect = (outlet: string) => {
    setSelectedOutlet(outlet);
    setShowOutletDialog(false);

    const addressData = {
      city: selectedCity,
      area: "",
      outlet: outlet,
      addressType: "Pickup" as const,
      modalOpen: false,
      delivery_tax: "",
      phone: "",
    };

    dispatch(addressesActions.setAddresses(addressData));
    window.localStorage.setItem("address", JSON.stringify(addressData));

    dispatch(
      openToaster({
        showSuccess: true,
        message: "Address Selected",
        title: "Success",
      })
    );
    handleClose();
    router.refresh();
    router.push("/");
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setShowAreaDialog(false);
  };

  const handleSaveLocation = async () => {
    if (!isValid) {
      dispatch(
        openToaster({
          title: "Broadway Pizza Pakistan",
          message: "Please enter all required fields.",
          buttonText: "OK",
        })
      );
      return;
    }

    setIsSaving(true);
    if (selectedAddressType === "Delivery") {
      try {
        const response = await fetch(
          "https://beta.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=AddCustomerEvent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Event: "AddAddress",
              Phone: isAuthenticated ? userData?.phone : phone,
            }),
          }
        );

        const data = await response.json();

        if (data.ResponseType !== 1) {
          return;
        }

        const addressData = {
          city: selectedCity,
          area: selectedArea,
          outlet: selectedOutlet,
          addressType: "Delivery" as const,
          modalOpen: false,
          delivery_tax: tax,
          phone: phone,
        };

        dispatch(addressesActions.setAddresses(addressData));
        window.localStorage.setItem("address", JSON.stringify(addressData));
        dispatch(
          openToaster({
            showSuccess: true,
            message: "Address Selected",
            title: "Success",
          })
        );
        handleClose();
        router.refresh();
        router.push("/");
      } catch (error) {
        console.error("Error saving location:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!addressState.modalOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${
        toasterOpen ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      <div
        className={`bg-white dark:bg-[#121212] w-full sm:max-w-[800px] h-screen sm:h-[680px] z-60 sm:rounded-md shadow-xl overflow-hidden md:overflow-y-auto  pointer-events-auto ${
          addressState.modalOpen ? "slide-up" : "slide-down"
        }`}
      >
        <PopupHeader onClose={handleClose} />

        {addressState.city && addressState.addressType && (
          <div className="mx-4">
            <LocationDisplay
              city={addressState.city}
              area={addressState.area}
              outlet={addressState.outlet}
              addressType={addressState.addressType}
            />
          </div>
        )}

        <div className="flex border-b dark:bg-[#202020] dark:border-[#202020] m-4">
          <button
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-opacity ${
              selectedAddressType === "Delivery"
                ? "border-b-2 border-yellow-400 dark:bg-[#ffffff17]"
                : "opacity-50"
            }`}
            onClick={() => {
              setSelectedAddressType("Delivery");
              setSelectedCity("");
              setSelectedArea("");
              setPhone("");
              setSelectedOutlet("");
            }}
          >
            <Image src="/delivery.png" width={40} height={40} alt="delivery" />
            <span className="font-bold dark:text-white">DELIVERY</span>
          </button>
          <button
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-opacity ${
              selectedAddressType === "Pickup"
                ? "border-b-2 border-yellow-400 dark:bg-[#ffffff17]"
                : "opacity-50"
            }`}
            onClick={() => {
              setSelectedAddressType("Pickup");
              setSelectedCity("");
              setSelectedArea("");
              setPhone("");
              setSelectedOutlet("");
            }}
          >
            <Image src="/takeaway.png" width={40} height={40} alt="pickup" />
            <span className="font-bold dark:text-white">PICKUP</span>
          </button>
        </div>

        {cartItems.length > 0 && (
          <div className="px-4 py-2 sm:py-2 text-left flex mt-4 items-center gap-1">
            <p className="text-[var(--text-primary)] text-[13px] bg-[#ffe2e2] dark:bg-[#312300] dark:text-[#ff2626] rounded-md p-2 w-full">
              By updating your current Pickup/Delivery selection, Your cart
              items will be removed.
            </p>
          </div>
        )}

        {selectedAddressType === "Delivery" && !isAuthenticated && (
          <div className="px-4 py-2 sm:py-2 text-left flex mt-4 items-center gap-1 mb-5">
            <p className="text-gray-600 text-sm">
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => {
                  dispatch(addressesActions.setAddresses({ modalOpen: false }));
                  router.push("/profile");
                }}
              >
                Login with your profile{" "}
              </span>
              to save your address and enjoy more features!
            </p>
          </div>
        )}

        {/* Location Selection */}
        <div className=" dark:bg-[#202020] m-4">
          <button
            onClick={() => setShowCityDialog(true)}
            className="w-full py-2 border-b border-gray-300 flex justify-between items-center"
          >
            <span className="text-[16px] font-normal text-[var(--text-primary)]">
              Select City
            </span>
            <span className="text-sm text-[#000000] dark:text-white opacity-60 flex items-center gap-2">
              {selectedCity || "Select"}{" "}
              <span className="text-2xl opacity-70">&gt;</span>
            </span>
          </button>

          {selectedAddressType === "Delivery" && selectedCity && (
            <button
              onClick={() => setShowAreaDialog(true)}
              className="w-full py-2 border-b border-gray-300 flex justify-between items-center"
            >
              <span className="text-[16px] font-normal dark:text-white">
                Select Area
              </span>
              <span className="text-sm text-[#000000] dark:text-white opacity-60 flex items-center gap-2">
                {selectedArea
                  ? selectedArea
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")
                  : "Select your area"}{" "}
                <span className="text-2xl opacity-60">&gt;</span>
              </span>
            </button>
          )}

          {selectedAddressType === "Delivery" && (
            <div className="w-full py-2 ">
              <label
                className={`block text-[12px] ${
                  isPhoneFocused
                    ? "text-[var(--yellow-border)]"
                    : "text-gray-600"
                }`}
              >
                Phone
              </label>

              <input
                type="tel"
                placeholder="03xxxxxxxxx"
                value={isAuthenticated ? userData?.phone : phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                className={`w-full text-[16px] py-1 font-normal border-b-2 ${
                  isPhoneFocused
                    ? "border-[var(--yellow-border)]"
                    : "border-gray-300"
                } text-[var(--text-primary)] focus:outline-none bg-transparent`}
                required
                pattern="03[0-9]{9}"
                minLength={11}
                maxLength={11}
                readOnly={isAuthenticated}
              />
            </div>
          )}

          {selectedAddressType === "Pickup" && selectedCity && (
            <button
              onClick={() => setShowOutletDialog(true)}
              className="w-full py-4 border-b flex justify-between items-center"
            >
              <span className="text-[16px] font-normal dark:text-white">
                Select Outlet
              </span>
              <span className="text-sm text-[#000000] dark:text-white opacity-70 flex items-center gap-2">
                {selectedOutlet || "Select"}{" "}
                <span className="text-2xl">&gt;</span>
              </span>
            </button>
          )}
        </div>

        {/* Save Button */}
        <div className="p-4">
          {selectedAddressType === "Delivery" && (
            <button
              className={`w-full bg-[var(--primary)] text-[var(--text-primary)] dark:text-[#212121] font-extrabold py-3 rounded transition-colors text-[14px] hover:bg-[var(--primary-hover)]
   `}
              onClick={handleSaveLocation}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                </div>
              ) : (
                "SAVE LOCATION"
              )}
            </button>
          )}
        </div>
        {selectedAddressType === "Delivery" && (
          <div className="p-4 flex justify-center items-center">
            <Image
              src={"/assets/HeaderImage.png"}
              alt="Popup Image"
              width={300}
              height={120}
              className="object-contain w-auto md:w-[300px] h-auto"
              priority
            />
          </div>
        )}
      </div>

      {showCityDialog && (
        <CityPopup
          isOpen={showCityDialog}
          onClose={() => setShowCityDialog(false)}
          cities={cities}
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
          isLoading={isCityLoading}
        />
      )}
      {showAreaDialog && (
        <AreaPopup
          isOpen={showAreaDialog}
          onClose={() => setShowAreaDialog(false)}
          areas={areas}
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          selectedArea={selectedArea}
          onAreaSelect={handleAreaSelect}
          isLoading={isAreaLoading}
        />
      )}
      {showOutletDialog && (
        <OutletPopup
          isOpen={showOutletDialog}
          onClose={() => setShowOutletDialog(false)}
          outlets={outlets}
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          selectedOutlet={selectedOutlet}
          onOutletSelect={handleOutletSelect}
          isLoading={isOutletLoading}
        />
      )}
    </div>
  );
};

export default HeaderPopup;
