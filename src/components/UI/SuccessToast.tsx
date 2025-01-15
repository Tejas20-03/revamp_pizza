"use client";

import { useSelector, useDispatch } from "react-redux";
import { StoreState } from "@/redux/reduxStore";
import { closeToaster } from "@/redux/toaster/slice";

import { useEffect } from "react";

const SuccessToast = () => {
  const { showSuccess, message } = useSelector(
    (state: StoreState) => state.toaster
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        dispatch(closeToaster());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, dispatch]);

  if (!showSuccess) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-32 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/90 rounded-xl px-8 py-4 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-white flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="text-white text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;
