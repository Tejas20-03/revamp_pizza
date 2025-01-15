"use client";
import { StoreState } from "@/redux/reduxStore";
import { useSelector } from "react-redux";

const ProgressLoader = () => {
  const { progressLoader, progressMessage } = useSelector(
    (state: StoreState) => state.toaster
  );

  if (!progressLoader) return null;

  return (
    <div className="fixed inset-0 h-screen z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
      <div className="bg-white dark:bg-[#202020] rounded-md p-6 w-[280px] mx-4 shadow-lg pointer-events-auto text-center">
        <h3 className="text-xl font-extrabold mb-4 dark:text-white">
          {progressMessage}
        </h3>
        <div className="w-full h-1 bg-gray-200 dark:bg-[#202020] rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressLoader;
