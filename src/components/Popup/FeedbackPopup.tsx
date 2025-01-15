"use client";

import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "@/redux/reduxStore";
import { FiSearch } from "react-icons/fi";
import { getFeedbackOutlet } from "@/services/Feedback/services";
import { AllOutletsResponseDataType } from "@/services/Feedback/types";
import { setLoading } from "@/redux/toaster/slice";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [showOutletDialog, setShowOutletDialog] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [outlets, setOutlets] = useState<AllOutletsResponseDataType[]>([]);
  const addressState = useSelector((state: StoreState) => state.address);

  const handleSelectOutlet = async () => {
    dispatch(setLoading(true));
    setShowOutletDialog(true);
    try {
      const response = await getFeedbackOutlet({});
      if (response?.Data) {
        setOutlets(response.Data);
      }
    } catch (error) {
      console.error("Error Fetching Outlets", error);
    }
    dispatch(setLoading(false));
  };

  const handleOutletSelect = (outletId: string) => {
    window.open(
      `https://feedback.broadwaypizza.com.pk/feedbackorder.html?OutletID=${outletId}`,
      "_blank"
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
      <div className="bg-white dark:bg-[#121212] w-full max-w-[800px] h-screen sm:h-[690px] z-60 sm:rounded-md slide-up  shadow-xl overflow-hidden md:overflow-y-auto  pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#202020] flex items-center py-4 px-2">
          <button onClick={onClose} className="p-2">
            <IoArrowBack size={24} className="dark:text-white" />
          </button>
          <h2 className="flex-1 text-center text-3xl dark:text-white font-extrabold">
            Feedback
          </h2>
        </div>

        <div className=" flex items-center flex-col gap-4">
          <div className="p-4 w-full">
            <div className="text-gray-600 dark:text-white dark:bg-[#202020] text-[14px] border rounded-lg w-full p-2">
              Select outlet to start Feedback
            </div>
          </div>
          <div className="border-b border-t w-full dark:bg-[#202020] dark:text-white">
            <button
              onClick={handleSelectOutlet}
              className="w-full flex justify-between items-center m-2 px-2"
            >
              <span className="text-[14px] font-normal">Select Outlet</span>
              <span className="text-[12px] text-[#000000] opacity-70 flex items-center gap-2 dark:text-white">
                {addressState.outlet || "Tap to select"}{" "}
                <span className="text-2xl">&gt;</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {showOutletDialog && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 pointer-events-auto  slide-up">
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-[800px] h-screen sm:h-[690px] transform bg-white dark:bg-[#121212] shadow-xl transition-all flex flex-col">
                <div className="p-5 flex justify-between items-center dark:bg-[#202020] dark:text-white">
                  <h2 className="text-2xl font-extrabold text-center flex-1">
                    Select Outlet
                  </h2>
                  <button
                    onClick={() => setShowOutletDialog(false)}
                    className="text-lg font-medium cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="relative mb-4 dark:bg-[#202020]">
                  <div className="flex items-center w-full p-2 px-4 shadow-lg relative">
                    <FiSearch className="mr-6 text-xl dark:text-white" />
                    <input
                      type="text"
                      placeholder="Search Outlet"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-xl outline-none dark:bg-[#202020] dark:text-white"
                    />
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-b from-black/10 to-transparent" />
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 overflow-y-auto h-[calc(100%-120px)] dark:bg-[#202020]">
                  <div className="p-4 space-y-2">
                    <div className="relative">
                      <label className="flex items-center space-x-8 mb-4 cursor-pointer">
                        <input
                          type="radio"
                          name="outlet"
                          value=""
                          defaultChecked
                          className="w-5 h-5 appearance-none border-2 rounded-full border-gray-800 checked:border-[var(--yellow-border)] relative before:content-[''] before:block before:w-[10px] before:h-[10px] before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-[var(--primary)]"
                        />
                        <span className="text-base ml-4 mb-2 dark:text-white">
                          Tap to Select
                        </span>
                      </label>
                      <div className="absolute bottom-0 left-10 right-0 h-px bg-gray-200" />
                    </div>
                    {outlets
                      .filter((outlet) =>
                        outlet.Name.toLowerCase().includes(
                          searchQuery.toLowerCase()
                        )
                      )
                      .map((outlet, index) => (
                        <div key={index} className="relative">
                          <label className="flex items-center space-x-8 mb-4 cursor-pointer">
                            <input
                              type="radio"
                              name="outlet"
                              value={outlet.Name}
                              onChange={() => handleOutletSelect(outlet.Id)}
                              className="w-5 h-5 appearance-none border-2 rounded-full border-gray-800 dark:border-gray-200 checked:border-[var(--yellow-border)] relative before:content-[''] before:block before:w-[10px] before:h-[10px] before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-[var(--primary)]"
                            />
                            <span className="text-base ml-4 mb-2 dark:text-white">
                              {outlet.Name}
                            </span>
                          </label>
                          <div className="absolute bottom-0 left-10 right-0 h-px bg-gray-200" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackPopup;
