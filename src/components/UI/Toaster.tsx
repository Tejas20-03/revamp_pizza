"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "@/redux/reduxStore";
import { closeToaster } from "@/redux/toaster/slice";

const Toaster: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, buttonText } = useSelector(
    (state: StoreState) => state.toaster
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-screen z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
      <div className="bg-white dark:bg-[#212121] rounded-md p-5 w-[280px] mx-4 shadow-lg pointer-events-auto">
        <h3 className="text-[20px] opacity-90 font-semibold mb-4 leading-tight dark:text-white">
          {title}
        </h3>
        <p className="text-[var(--text-primary)] opacity-70 mb-6 dark:text-white">
          {message}
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => dispatch(closeToaster())}
            className="text-[#ffc714] cursor-pointer font-medium rounded"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toaster;
