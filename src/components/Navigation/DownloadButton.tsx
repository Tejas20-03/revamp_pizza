"use client";

import React, { useState } from "react";

const DownloadButton = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const downloadFile = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://services.broadwaypizza.com.pk/Menu.pdf",
        {
          method: "GET",
        }
      );

      const buffer = await response.arrayBuffer();
      const file = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Menu.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={downloadFile}
      className="my-3 py-2 w-[90%] max-w-[850px] mx-auto text-[#0ca353] text-sm sm:text-base font-extrabold border-2 border-[#0ca353] hover:bg-white hover:text-[#0ca353] hover:border-[#0ca353] hover:shadow-md transition duration-200 rounded-md uppercase"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
      ) : (
        "Download Menu"
      )}
    </button>
  );
};

export default DownloadButton;
